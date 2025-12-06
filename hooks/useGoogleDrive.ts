import { useState, useEffect } from 'react';
import { CustomSource } from '../types';

interface UseGoogleDriveProps {
    language: 'en' | 'es';
    onFileSelected: (file: CustomSource) => void;
}

export const useGoogleDrive = ({ language, onFileSelected }: UseGoogleDriveProps) => {
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [pickerInited, setPickerInited] = useState(false);

    // Initialize Google API and Identity Services
    useEffect(() => {
        const initializeGoogle = () => {
            // Ensure all required Google objects are present
            if (!window.google || !window.google.accounts || !window.google.accounts.oauth2 || !window.gapi) {
                return;
            }

            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

            // CRITICAL FIX: Prevent crash if ID is missing or invalid
            if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
                console.warn("Google Client ID is missing or empty. Drive integration disabled.");
                return;
            }

            try {
                // Initialize Identity Services (for Token)
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'https://www.googleapis.com/auth/drive.readonly',
                    callback: (response: any) => {
                        if (response.error !== undefined) {
                            console.error("Auth Error:", response);
                            return;
                        }
                        createPicker(response.access_token);
                    },
                });
                setTokenClient(client);

                // Load Picker API
                window.gapi.load('picker', () => {
                    setPickerInited(true);
                });
            } catch (e) {
                console.error("Error initializing Google Auth:", e);
            }
        };

        // Check if scripts are loaded, if not, wait for window load
        if (document.readyState === 'complete') {
            initializeGoogle();
        } else {
            window.addEventListener('load', initializeGoogle);
        }

        // Attempt immediate init in case we mounted after load event or scripts loaded async
        const timer = setTimeout(initializeGoogle, 1000);

        return () => {
            window.removeEventListener('load', initializeGoogle);
            clearTimeout(timer);
        };
    }, []);

    const createPicker = (accessToken: string) => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

        if (!pickerInited || !clientId) {
            console.warn("Picker API not loaded or Client ID missing");
            return;
        }

        const pickerCallback = (data: any) => {
            if (data.action === window.google.picker.Action.PICKED) {
                const file = data.docs[0];
                const fileId = file.id;
                const name = file.name;
                const mimeType = file.mimeType;

                // Ideally we fetch content here. For now, we simulate success and add metadata.
                // In production, use fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`, ...)
                fetchDriveFileContent(fileId, accessToken, mimeType, name);
            }
        };

        const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
        const picker = new window.google.picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(accessToken)
            .setDeveloperKey(apiKey || '') // Required for Picker
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    };

    const fetchDriveFileContent = async (fileId: string, accessToken: string, mimeType: string, name: string) => {
        // Logic to attempt to get text content from the file to pass to Gemini
        let content = `File ID: ${fileId}`;

        try {
            let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

            // If it's a Google Doc, we need to export it
            if (mimeType === 'application/vnd.google-apps.document') {
                url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (res.ok) {
                content = await res.text();
            }
        } catch (e) {
            console.warn("Could not fetch drive content, using metadata only", e);
        }

        onFileSelected({
            id: fileId,
            type: 'drive',
            content: content,
            name: name,
            mimeType: mimeType
        });
    };

    const handleDriveClick = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        // Explicit check before trying to use tokenClient
        if (!clientId || clientId.trim() === '') {
            const msg = language === 'es'
                ? "Error: Falta configurar el GOOGLE_CLIENT_ID en el entorno."
                : "Error: GOOGLE_CLIENT_ID is missing in environment variables.";
            alert(msg);
            return;
        }

        if (!tokenClient) {
            const msg = language === 'es'
                ? "La integración de Drive se está cargando o ha fallado. Revisa la consola."
                : "Drive integration is loading or failed. Check console.";
            alert(msg);
            return;
        }
        // Trigger Auth Flow
        tokenClient.requestAccessToken({ prompt: 'consent' });
    };

    return { handleDriveClick };
};
