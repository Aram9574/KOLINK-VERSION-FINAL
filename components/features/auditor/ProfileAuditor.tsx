import React, { useState } from 'react';
import PDFUploader from './PDFUploader';
import AuditResults from './AuditResults';
import { AuditService } from '../../../services/AuditService';
import { toast } from 'sonner';
import { useUser } from '../../../context/UserContext';

const ProfileAuditor: React.FC = () => {
    const [results, setResults] = useState<any>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('kolink_audit_results');
                return saved ? JSON.parse(saved) : null;
            } catch (e) { 
                return null;
            }
        }
        return null;
    });

    const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>(() => {
        if (typeof window !== 'undefined') {
             const saved = localStorage.getItem('kolink_audit_results');
             return saved ? 'results' : 'upload';
        }
        return 'upload';
    });
    
    const { language } = useUser();

    const handleFileSelect = async (file: File) => {
        setStep('analyzing');
        try {
            const data = await AuditService.analyzeProfilePDF(file);
            setResults(data);
            localStorage.setItem('kolink_audit_results', JSON.stringify(data));
            setStep('results');
            toast.success(language === 'es' ? 'Análisis completado' : 'Analysis complete');
        } catch (error) {
            console.error(error);
            setStep('upload');
            toast.error(language === 'es' ? 'Error al analizar el perfil. Intenta de nuevo.' : 'Error analyzing profile. Try again.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    {language === 'es' ? 'Auditor de Perfil AI' : 'AI Profile Auditor'}
                </h1>
                <p className="mt-2 text-slate-600">
                    {language === 'es' 
                        ? 'Sube tu perfil en PDF y obtén un análisis detallado para mejorar tu presencia profesional.' 
                        : 'Upload your profile PDF and get a detailed analysis to improve your professional presence.'}
                </p>
            </div>

            <div className="mt-8">
                {step === 'upload' && (
                    <PDFUploader onFileSelect={handleFileSelect} isAnalyzing={false} />
                )}
                
                {step === 'analyzing' && (
                     <PDFUploader onFileSelect={() => {}} isAnalyzing={true} />
                )}

                {step === 'results' && results && (
                    <div className="space-y-6">
                        <button 
                            onClick={() => { 
                                setStep('upload'); 
                                setResults(null); 
                                localStorage.removeItem('kolink_audit_results');
                            }}
                            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                        >
                            ← {language === 'es' ? 'Analizar otro perfil' : 'Analyze another profile'}
                        </button>
                        <AuditResults data={results} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileAuditor;
