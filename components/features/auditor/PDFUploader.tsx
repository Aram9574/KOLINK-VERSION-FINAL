import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from '../../../context/UserContext';

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileSelect, isAnalyzing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useUser();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setFileError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setFileError(language === 'es' ? 'Por favor sube un archivo PDF válido.' : 'Please upload a valid PDF file.');
      return;
    }
    // Limit size if needed, e.g., 5MB
    if (file.size > 5 * 1024 * 1024) {
       setFileError(language === 'es' ? 'El archivo es demasiado grande (máx 5MB).' : 'File is too large (max 5MB).');
       return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center cursor-pointer ${
          isDragOver
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
        } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isAnalyzing}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {isAnalyzing ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">
                {language === 'es' ? 'Analizando tu perfil...' : 'Analyzing your profile...'}
              </h3>
              <p className="text-slate-500">
                {language === 'es' 
                  ? 'Nuestra IA está leyendo tu trayectoria profesional.' 
                  : 'Our AI is reading your professional journey.'}
              </p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-2">
                <Upload className="w-8 h-8 text-brand-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {language === 'es' ? 'Sube tu perfil de LinkedIn (PDF)' : 'Upload your LinkedIn Profile (PDF)'}
                </h3>
                <p className="text-slate-500 text-sm">
                  {language === 'es' 
                    ? 'Arrastra y suelta tu archivo aquí o haz clic para explorar' 
                    : 'Drag and drop your file here or click to browse'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
                <FileText className="w-4 h-4" />
                <span>PDF (Max 5MB)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {fileError && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm justify-center">
          <AlertCircle className="w-4 h-4" />
          {fileError}
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
