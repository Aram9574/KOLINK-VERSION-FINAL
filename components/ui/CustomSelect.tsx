import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";

interface Option {
    value: string | number;
    label: string;
    isPremium?: boolean;
}

interface CustomSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: any) => void;
    disabled?: boolean;
    className?: string;
    isFreeUser?: boolean;
    onPremiumClick?: () => void;
    icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    disabled = false,
    className = "",
    isFreeUser = false,
    onPremiumClick,
    icon,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value) ||
        options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        if (isFreeUser && option.isPremium) {
            onPremiumClick?.();
            return;
        }
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 h-[46px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium text-slate-900 dark:text-white transition-all hover:border-brand-300 shadow-sm ${
                    disabled
                        ? "opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50"
                        : "cursor-pointer"
                }`}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && (
                        <span className="text-slate-400 shrink-0">{icon}</span>
                    )}
                    {isFreeUser && selectedOption?.isPremium && (
                        <Lock size={12} className="text-amber-500 shrink-0" />
                    )}
                    <span className="truncate">{selectedOption?.label}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                                    value === option.value
                                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-bold"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {isFreeUser && option.isPremium && (
                                    <Lock
                                        size={12}
                                        className="text-amber-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
