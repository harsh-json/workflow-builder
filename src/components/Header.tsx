import React, { useState } from 'react';
import { config } from '../utils/config';

const Header = ({
    title = "Workflow Designer",
    onExport,
    viewMode,
    onToggleView,
    onImportJson
}) => {
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');
    const [error, setError] = useState('');
    const [showCopyDropdown, setShowCopyDropdown] = useState(false);

    const handleClear = () => {
        localStorage.removeItem('workflow_nodes');
        localStorage.removeItem('workflow_edges');
        window.location.reload();
    };

    const handleImport = () => {
        try {
            let text = importText.trim();
            if (!text.startsWith('{')) text = '{' + text;
            if (!text.endsWith('}')) text = text + '}';
            const json = JSON.parse(text);
            setError('');
            setShowImport(false);
            setImportText('');
            if (onImportJson) onImportJson(json);
        } catch (e) {
            setError('Invalid JSON: ' + (e.message || ''));
        }
    };


    return (
        <header className="w-full backdrop-blur-sm h-14 flex items-center justify-between border-b border-gray-200 px-6 sticky top-0 z-50">
            <div className="font-semibold text-lg text-gray-800 ml-2">{title}</div>
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
                {/* Copy Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowCopyDropdown(v => !v)}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md font-medium cursor-pointer"
                    >
                        Config
                    </button>
                    {showCopyDropdown && (
                        <div className="absolute -right-[75%] mt-2 w-48 bg-white border rounded shadow-lg z-50">
                            {[
                                { key: 'global_variables', label: 'Process Variables' },
                                { key: 'missing_info', label: 'Missing Info' },
                                { key: 't_missing_info', label: 'T Missing Info' }
                            ].map(({ key, label }) => (
                                <div
                                    key={key}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                                    onClick={() => {
                                        const obj = config[key];
                                        console.log('Copying config:', obj);
                                        if (obj) {
                                            const text = JSON.stringify(obj, null, 2);
                                            navigator.clipboard.writeText(text);
                                        }
                                        setShowCopyDropdown(false);
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowImport(true)}
                    className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium cursor-pointer"
                >
                    Import JSON
                </button>
            </div>
            {showImport && (
                <div className="fixed inset-0 bg-[#00000099] top-0 h-screen flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg h-1/2 w-1/2 flex flex-col gap-3 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            onClick={() => { setShowImport(false); setError(''); }}
                        >&#10005;</button>
                        <div className="font-semibold mb-2">Paste Workflow JSON</div>
                        <textarea
                            className="border rounded p-2 w-full h-full font-mono text-xs"
                            value={importText}
                            onChange={e => setImportText(e.target.value)}
                            placeholder="Paste JSON here"
                        />
                        {error && <div className="text-red-500 text-xs">{error}</div>}
                        <button
                            className="bg-blue-500 text-white rounded px-4 py-2 mt-2 hover:bg-blue-600 cursor-pointer"
                            onClick={handleImport}
                        >
                            Import
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;