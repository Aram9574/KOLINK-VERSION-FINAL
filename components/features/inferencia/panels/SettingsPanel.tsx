import React from "react";

const SettingsPanel: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Creator Info</h4>
                <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                        </div>
                        <button className="text-xs text-brand-600 font-bold hover:underline">Change Photo</button>
                     </div>
                     
                     <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Name</label>
                        <input className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg" defaultValue="Aram Zakzuk" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Handle</label>
                        <input className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg" defaultValue="@aramzakzuk" />
                     </div>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Page Numbers</span>
                    <input type="checkbox" className="toggle toggle-sm toggle-brand" defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Swipe Arrow</span>
                    <input type="checkbox" className="toggle toggle-sm toggle-brand" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Dark Mode (Preview)</span>
                    <input type="checkbox" className="toggle toggle-sm toggle-brand" />
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
