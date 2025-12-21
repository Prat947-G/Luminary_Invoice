import React, { useState, useEffect } from 'react';
import { Upload, X, Check, Trash2 } from 'lucide-react';

const SignatureSelector = ({ onSelect, currentSignature }) => {
    const [signatures, setSignatures] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('invoice_signatures');
        if (saved) {
            setSignatures(JSON.parse(saved));
        }
    }, []);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            const newSigs = [base64, ...signatures].slice(0, 3); // Keep only last 3
            setSignatures(newSigs);
            localStorage.setItem('invoice_signatures', JSON.stringify(newSigs));
            onSelect(base64); // Auto-select new upload
            setIsOpen(false);
        };
        reader.readAsDataURL(file);
    };

    const deleteSignature = (index, e) => {
        e.stopPropagation();
        const newSigs = signatures.filter((_, i) => i !== index);
        setSignatures(newSigs);
        localStorage.setItem('invoice_signatures', JSON.stringify(newSigs));
        if (currentSignature === signatures[index]) {
            onSelect(null);
        }
    };

    return (
        <div className="relative print:hidden">
            {/* Trigger / Display Area */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center min-h-[80px] transition-colors"
            >
                {currentSignature ? (
                    <img src={currentSignature} alt="Signature" className="h-16 object-contain" />
                ) : (
                    <div className="text-gray-400 flex flex-col items-center text-xs">
                        <span className="font-bold">Click to Sign</span>
                        <span className="text-[10px]">(Select or Upload)</span>
                    </div>
                )}
            </div>

            {/* Dropdown / Modal */}
            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white shadow-xl rounded-lg border border-gray-200 p-3 z-50">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-gray-700 uppercase">Saved Signatures</h4>
                        <button onClick={() => setIsOpen(false)}><X size={14} /></button>
                    </div>

                    {/* List */}
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                        {signatures.map((sig, idx) => (
                            <div
                                key={idx}
                                onClick={() => { onSelect(sig); setIsOpen(false); }}
                                className="group relative border border-gray-100 rounded p-1 hover:bg-blue-50 cursor-pointer flex justify-center"
                            >
                                <img src={sig} alt={`Sig ${idx}`} className="h-12 object-contain" />
                                <button
                                    onClick={(e) => deleteSignature(idx, e)}
                                    className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                        {signatures.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No saved signatures</p>}
                    </div>

                    {/* Upload */}
                    <label className="flex items-center justify-center gap-2 w-full p-2 bg-blue-50 text-blue-600 rounded text-xs font-bold cursor-pointer hover:bg-blue-100 transition">
                        <Upload size={14} /> Upload New
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            )}
        </div>
    );
};

export default SignatureSelector;
