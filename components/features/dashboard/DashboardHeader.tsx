import React from 'react';

const DashboardHeader: React.FC<any> = (props) => {
    return (
        <div className="h-16 w-full border-b border-slate-200 bg-white flex items-center px-6">
            <h1>Dashboard</h1>
        </div>
    );
};

export default DashboardHeader;
