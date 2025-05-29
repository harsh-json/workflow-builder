import React from 'react';

const Header = ({ title = "Workflow Designer", onExport, viewMode, onToggleView }) => {
    const handleClear = () => {
        localStorage.removeItem('workflow_nodes');
        localStorage.removeItem('workflow_edges');
        window.location.reload();
    };
    return (
        <header className="w-full backdrop-blur-sm h-14 flex items-center justify-between border-b border-gray-200 px-6 sticky top-0 z-50">
            <div className="font-semibold text-lg text-gray-800">{title}</div>
            <div className="flex gap-3">
                <button
                    onClick={onExport}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium cursor-pointer"
                >
                    Export
                </button>
                <button
                    onClick={onToggleView}
                    className={`px-6 py-2 text-white rounded-md font-medium cursor-pointer ${viewMode === 'flowchart' ? 'bg-green-500' : 'bg-orange-500'}`}
                >
                    {viewMode !== 'flowchart' ? 'Flow Mode' : 'Data Mode'}
                </button>
                <button
                    onClick={handleClear}
                    className="px-6 py-2 bg-red-500 text-white rounded-md font-medium cursor-pointer"
                >
                    Clear Flow
                </button>
            </div>
        </header>
    );
}

    export default Header;
