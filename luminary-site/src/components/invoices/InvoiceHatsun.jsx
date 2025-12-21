import React, { useState, useRef } from 'react';
import { Printer, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import SignatureSelector from './SignatureSelector';

const InvoiceHatsun = () => {
    const navigate = useNavigate();
    const printRef = useRef();
    const [signature, setSignature] = useState(null);

    // --- STATE ---
    const [seller, setSeller] = useState({
        name: "VENUGOPALA TRADERS",
        address: "MADHUKAR NAGAR, PATAS, PUNE - 412219",
        contact: "JYOTI PRAMOD KADAM",
        email: "jyotikadam2207@gmail.com",
        cell: "8830162266"
    });

    const [buyer, setBuyer] = useState({
        name: "HATSUN AGRO PRODUCT LTD.",
        details: "Sankh cc"
    });

    const [meta, setMeta] = useState({
        billNo: "292",
        date: "2025-12-02",
        poNo: "5500179767"
    });

    const [items, setItems] = useState([
        { id: 1, desc: "FIREWOOD", qty: 3780, rate: 4.87 }
    ]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-stone-100 p-8 font-sans" style={{ backgroundColor: '#E7E5E4' }}>
            {/* Print Button */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/network/operations')}
                        className="bg-white p-3 rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all text-stone-600 hover:text-amber-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-stone-900">Hatsun Format</h1>
                        <p className="text-xs text-amber-600 font-bold tracking-widest uppercase">Invoice Generator</p>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-md shadow-lg hover:bg-amber-600 transition-all duration-300 font-bold tracking-wide uppercase text-xs"
                >
                    <Printer size={16} /> Print / Save PDF
                </button>
            </div>

            <div id="invoice-container" className="max-w-4xl mx-auto bg-white shadow-xl p-8 text-sm print:shadow-none print:p-0">
                <h1 className="text-center text-xl font-bold mb-4 underline">TAX INVOICE</h1>

                {/* FROM / TO GRID [cite: 43-45] */}
                <div className="grid grid-cols-2 gap-0 border border-black mb-4">
                    {/* Left: From */}
                    <div className="p-2 border-r border-black">
                        <h3 className="font-bold underline mb-1">From</h3>
                        <input className="w-full font-bold uppercase outline-none" value={seller.name} onChange={(e) => setSeller({ ...seller, name: e.target.value })} />
                        <textarea className="w-full outline-none h-10 resize-none" value={seller.address} onChange={(e) => setSeller({ ...seller, address: e.target.value })} />
                        <div className="mt-2">
                            <span className="font-bold block">Contact Person:</span>
                            <input className="w-full outline-none" value={seller.contact} onChange={(e) => setSeller({ ...seller, contact: e.target.value })} />
                        </div>
                    </div>

                    {/* Right: To & Meta */}
                    <div className="p-2">
                        <h3 className="font-bold underline mb-1">TO</h3>
                        <input className="w-full font-bold uppercase outline-none" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} />
                        <input className="w-full outline-none mb-4" value={buyer.details} onChange={(e) => setBuyer({ ...buyer, details: e.target.value })} />

                        <div className="grid grid-cols-2 gap-2 text-xs font-bold border-t border-gray-400 pt-2">
                            <div>BILL NO: <input value={meta.billNo} onChange={(e) => setMeta({ ...meta, billNo: e.target.value })} className="w-12 border-b outline-none" /></div>
                            <div>Date: <input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} className="w-24 border-b outline-none" /></div>
                            <div>Cell No: {seller.cell}</div>
                            <div>P.O.No: <input value={meta.poNo} onChange={(e) => setMeta({ ...meta, poNo: e.target.value })} className="w-24 border-b outline-none" /></div>
                            <div className="col-span-2">E-Mail: {seller.email}</div>
                        </div>
                    </div>
                </div>

                {/* TABLE [cite: 46] */}
                <table className="w-full border-collapse border border-black mb-6">
                    <thead>
                        <tr className="bg-gray-100 text-center font-bold">
                            <th className="border border-black p-2 w-12">S.No</th>
                            <th className="border border-black p-2 text-left">Description</th>
                            <th className="border border-black p-2 w-24">Qty</th>
                            <th className="border border-black p-2 w-24">RATE</th>
                            <th className="border border-black p-2 w-32">Amount</th>
                            <th className="border border-black p-2 w-8 print:hidden"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} className="text-center h-12 group hover:bg-gray-50">
                                <td className="border border-black">{index + 1}</td>
                                <td className="border border-black text-left px-2"><input className="w-full outline-none bg-transparent" value={item.desc} onChange={(e) => { const n = [...items]; n[index].desc = e.target.value; setItems(n) }} /></td>
                                <td className="border border-black"><input type="number" className="w-full text-center outline-none bg-transparent" value={item.qty} onChange={(e) => { const n = [...items]; n[index].qty = e.target.value; setItems(n) }} /></td>
                                <td className="border border-black"><input type="number" className="w-full text-center outline-none bg-transparent" value={item.rate} onChange={(e) => { const n = [...items]; n[index].rate = e.target.value; setItems(n) }} /></td>
                                <td className="border border-black font-bold">{(item.qty * item.rate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                                <td className="border border-black print:hidden cursor-pointer text-red-500" onClick={() => setItems(items.filter(i => i.id !== item.id))}><Trash2 size={14} /></td>
                            </tr>
                        ))}
                        <tr className="font-bold bg-gray-50">
                            <td colSpan="4" className="border border-black text-right pr-4 py-2">TOTAL</td>
                            <td className="border border-black text-center py-2">{items.reduce((acc, i) => acc + (i.qty * i.rate), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                            <td className="border border-black print:hidden"></td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={() => setItems([...items, { id: Date.now(), desc: "FIREWOOD", qty: 0, rate: 0 }])} className="mb-6 text-blue-600 flex items-center gap-1 print:hidden text-xs font-bold"><Plus size={14} /> Add Row</button>

                {/* FOOTER [cite: 56-61] */}
                <div className="flex justify-between items-start">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold underline mb-2 text-sm">BANK DETAILS</p>
                        <div className="grid grid-cols-[100px_1fr] gap-1">
                            <span className="font-semibold">Account Name:</span> <span>Venugopala Traders</span>
                            <span className="font-semibold">Pan No:</span> <span>BFXPK7378N</span>
                            <span className="font-semibold">Bank Name:</span> <span>INDIAN BANK</span>
                            <span className="font-semibold">Account No:</span> <span>7678254669</span>
                            <span className="font-semibold">Branch:</span> <span>Patas</span>
                            <span className="font-semibold">IFSC CODE:</span> <span>IDIB000P261</span>
                        </div>
                    </div>
                    <div className="w-1/3 text-center">
                        {/* Signature Manager */}
                        <div className="mb-2 w-full">
                            {/* In Print mode, only show Image */}
                            <div className="hidden print:block h-20 flex items-end justify-center">
                                {signature ? (
                                    <img src={signature} alt="Authorized Sig" className="h-16 object-contain" />
                                ) : (
                                    <span className="text-transparent">.</span>
                                )}
                            </div>
                            {/* In Interactive mode, show Selector */}
                            <div className="print:hidden">
                                <SignatureSelector onSelect={setSignature} currentSignature={signature} />
                            </div>
                        </div>
                        <p className="font-bold">Authorized Signatory</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #invoice-container, #invoice-container * { visibility: visible; }
                    #invoice-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; }
                    @page { margin: 1cm; size: auto; }
                    .print\\:hidden { display: none !important; }
                    input, textarea { border: none !important; resize: none; background: transparent; }
                }
            `}</style>
        </div>
    );
};

export default InvoiceHatsun;