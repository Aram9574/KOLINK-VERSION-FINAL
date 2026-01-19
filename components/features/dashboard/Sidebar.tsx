import React from 'react';
import { useUser } from '../../../context/UserContext';

const Sidebar: React.FC<any> = (props) => {
    const { user } = useUser();
    return (
        <div className="w-64 h-full bg-slate-50 border-r border-slate-200">
            <div className="p-4">
                Sidebar Content
            </div>
        </div>
    );
};

export default Sidebar;
