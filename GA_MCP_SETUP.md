# Configuración de Google Analytics MCP

Para que el asistente de IA pueda acceder a tus datos de Google Analytics,
necesitas configurar las credenciales de Google Cloud.

## Pasos para obtener las credenciales

1. **Crear un Proyecto en Google Cloud**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/).
   - Crea un nuevo proyecto (ej. "Kolink Analytics").

2. **Habilitar APIs**:
   - En el menú "APIs & Services" > "Library".
   - Busca y habilita **"Google Analytics Data API"**.
   - Busca y habilita **"Google Analytics Admin API"**.

3. **Crear una Cuenta de Servicio (Service Account)**:
   - Ve a "APIs & Services" > "Credentials".
   - Haz clic en "Create Credentials" > "Service Account".
   - Dale un nombre (ej. "analytics-mcp") y crea la cuenta.
   - En la lista de cuentas de servicio, haz clic en la que acabas de crear.
   - Ve a la pestaña **"Keys"** > "Add Key" > "Create new key" > **JSON**.
   - Se descargará un archivo `.json`. **Guarda este archivo en una ubicación
     segura** (por ejemplo, en `/Users/aramzakzuk/gamcp-credentials.json`).

4. **Dar acceso a Google Analytics**:
   - Abre el archivo JSON descargado y copia el `client_email`.
   - Ve a [Google Analytics](https://analytics.google.com/).
   - Ve a **Admin** > **Property Settings** > **Property Access Management**.
   - Haz clic en "+" > "Add users".
   - Pega el email de la cuenta de servicio y dale rol de **"Viewer"** (o
     "Analyst").

## Actualizar la configuración

He añadido la configuración básica a tu archivo de Claude Desktop, pero
necesitas poner la ruta real del archivo JSON y tu ID de Propiedad.

1. Abre el archivo de configuración:
   `/Users/aramzakzuk/Library/Application Support/Claude/claude_desktop_config.json`
2. Busca la sección `google-analytics`.
3. Cambia `PATH_TO_YOUR_CREDENTIALS_JSON` por la ruta real de tu archivo JSON
   (ej. `/Users/aramzakzuk/gamcp-credentials.json`).
4. Cambia `YOUR_GA4_PROPERTY_ID` por tu ID de propiedad de GA4 (lo encuentras en
   Admin > Property Settings).

Una vez hecho esto, reinicia Claude Desktop y podrás pedirle que analice tus
datos.
