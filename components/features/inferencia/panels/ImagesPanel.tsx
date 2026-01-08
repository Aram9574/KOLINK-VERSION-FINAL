import React from "react";
import { Upload, Search } from "lucide-react";

interface ImagesPanelProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagesPanel: React.FC<ImagesPanelProps> = ({ onUpload }) => {
    return (
        <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors relative">
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={onUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-sm font-bold text-slate-700">Upload Image</span>
                <span className="text-xs text-slate-400 mt-1">JPG, PNG, WebP up to 5MB</span>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        placeholder="Search Unsplash..."
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
                     {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-square bg-slate-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                             <img src={`https://picsum.photos/seed/${i * 123}/200`} alt="Stock" className="w-full h-full object-cover" />
                        </div>
                     ))}
                </div>
            </div>
        </div>
    );
};

export default ImagesPanel;
