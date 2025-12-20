import React, { useRef, useState } from "react";
import { AlertCircle, FileText, Loader2, Upload } from "lucide-react";
import { useUser } from "../../../context/UserContext";

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const PDFUploader: React.FC<PDFUploaderProps> = (
  { onFileSelect, isAnalyzing },
) => {
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
    if (file.type !== "application/pdf") {
      setFileError(
        language === "es"
          ? "Por favor sube un archivo PDF válido."
          : "Please upload a valid PDF file.",
      );
      return;
    }
    // Limit size if needed, e.g., 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError(
        language === "es"
          ? "El archivo es demasiado grande (máx 5MB)."
          : "File is too large (max 5MB).",
      );
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-[2.5rem] p-12 lg:p-16 transition-all duration-500 ease-in-out text-center cursor-pointer overflow-hidden group/uploader ${
          isDragOver
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]"
            : "border-slate-200 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/20 hover:border-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/40"
        } ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/uploader:opacity-100 transition-opacity duration-500" />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isAnalyzing}
        />

        <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
          {isAnalyzing
            ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {language === "es"
                    ? "Analizando tu perfil..."
                    : "Analyzing your profile..."}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {language === "es"
                    ? "Nuestra IA está leyendo tu trayectoria profesional."
                    : "Our AI is reading your professional journey."}
                </p>
              </div>
            )
            : (
              <>
                <div className="w-20 h-20 bg-blue-500 dark:bg-blue-600 rounded-3xl flex items-center justify-center mb-2 shadow-lg shadow-blue-500/20 group-hover/uploader:scale-110 group-hover/uploader:rotate-3 transition-transform duration-500">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {language === "es"
                      ? "Sube tu Perfil (PDF)"
                      : "Upload your Profile (PDF)"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                    {language === "es"
                      ? "Arrastra y suelta aquí o presiona para buscar"
                      : "Drag and drop here or click to browse"}
                  </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                  <FileText className="w-4 h-4" />
                  <span>PDF de LinkedIn (Max 5MB)</span>
                </div>
              </>
            )}
        </div>
      </div>

      {fileError && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold justify-center animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          {fileError}
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
