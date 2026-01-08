import React from 'react';
import { motion } from 'framer-motion';

interface EditorCanvasProps {
    content: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    editorRef: React.RefObject<HTMLTextAreaElement>;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
    content,
    onChange,
    placeholder,
    editorRef
}) => {
    return (
        <div className="flex-1 overflow-hidden flex flex-col relative bg-white">
            <textarea
                ref={editorRef}
                value={content}
                onChange={onChange}
                placeholder={placeholder}
                className="flex-1 w-full p-8 md:p-12 resize-none outline-none text-slate-700 text-lg leading-[1.8] font-nexus placeholder:text-slate-300 placeholder:italic bg-transparent scrollbar-nexus relative z-10"
                spellCheck={false}
            />
            
            {/* Background Grid Accent */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>
    );
};

export default EditorCanvas;
