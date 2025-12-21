import React, { useState, useRef } from 'react';
import { Printer, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import SignatureSelector from './SignatureSelector';

const InvoiceJK = () => {
    const navigate = useNavigate();
    const printRef = useRef();
    const [signature, setSignature] = useState(null);

    // --- STATE ---
    const [seller, setSeller] = useState({
        name: "VENUGOPALA TRADERS",
        desc: "FIRE WOOD, WOOD CHIPS AND BIOMASS BRIQUETTES MATERIAL SUPPLIERS",
        address: "Ram Nivas, Behind Morya Krishi Bhandar, Avhadnagar, Patas, Tal- Daund, Dist- Pune 412219",
        contact: "Jyoti Kadam 8830162266 / 8830156465"
    });

    const [buyer, setBuyer] = useState({
        name: "J K CAKE FACTORY",
        address: "Munjewadi Phata, Ekathpur, Saswad,",
        city: "Pune, Maharashtra"
    });

    const [meta, setMeta] = useState({
        billNo: "104/25/26",
        date: "2025-12-18"
    });

    const [items, setItems] = useState([
        { id: 1, desc: "Fire Wood", date: "2025-12-02", vehicle: "MH16CD0039", qty: 2270, rate: 4.7 },
        { id: 2, desc: "Fire Wood", date: "2025-12-05", vehicle: "MH11AL2950", qty: 3450, rate: 4.7 },
        { id: 3, desc: "Fire Wood", date: "2025-12-06", vehicle: "MH14GD9784", qty: 3580, rate: 4.7 },
        { id: 4, desc: "Fire Wood", date: "2025-12-13", vehicle: "MH14GD9784", qty: 3510, rate: 4.7 },
    ]);

    const [bank] = useState({
        accName: "Venugopala Traders",
        pan: "BFXPK7378N",
        bankName: "INDIAN BANK",
        branch: "Patas",
        accNo: "7678254669",
        ifsc: "IDIB000P261"
    });

    // --- CALCULATIONS ---
    const total = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-stone-100 p-8 font-sans" style={{ backgroundColor: '#E7E5E4' }}> {/* Stone-200 for contrast */}
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
                        <h1 className="text-2xl font-serif font-bold text-stone-900">JK Cake Format</h1>
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

                {/* HEADER */}
                <div className="text-center border-b-2 border-black pb-4 mb-4">
                    <input className="w-full text-center text-2xl font-bold uppercase border-none outline-none" value={seller.name} onChange={(e) => setSeller({ ...seller, name: e.target.value })} />
                    <input className="w-full text-center text-xs font-bold text-gray-600 border-none outline-none" value={seller.desc} onChange={(e) => setSeller({ ...seller, desc: e.target.value })} />
                    <textarea className="w-full text-center text-xs mt-1 border-none outline-none resize-none" value={seller.address} onChange={(e) => setSeller({ ...seller, address: e.target.value })} />
                    <input className="w-full text-center text-sm font-bold border-none outline-none" value={seller.contact} onChange={(e) => setSeller({ ...seller, contact: e.target.value })} />
                </div>

                {/* INVOICE INFO */}
                <div className="flex justify-between items-start mb-6">
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold underline mb-2">INVOICE</h2>
                        <div className="border p-2 border-gray-300">
                            <span className="font-bold">TO, </span>
                            <input className="font-bold border-none outline-none w-full" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} />
                            <textarea className="w-full border-none outline-none h-16 resize-none" value={buyer.address + '\n' + buyer.city} onChange={(e) => setBuyer({ ...buyer, address: e.target.value })} />
                        </div>
                    </div>
                    <div className="w-1/3 text-right pt-8">
                        <div className="flex justify-end items-center gap-2 mb-1">
                            <span className="font-bold">DATE:</span>
                            <input type="date" className="text-right border-b border-gray-300 outline-none" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} />
                        </div>
                        <div className="flex justify-end items-center gap-2">
                            <span className="font-bold">BILL NO:</span>
                            <input className="text-right w-24 border-b border-gray-300 outline-none font-bold" value={meta.billNo} onChange={(e) => setMeta({ ...meta, billNo: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="mb-6">
                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr className="bg-gray-100 text-center font-bold">
                                <th className="border border-black p-1 w-10">Sr No</th>
                                <th className="border border-black p-1">Description</th>
                                <th className="border border-black p-1 w-24">Date</th>
                                <th className="border border-black p-1 w-28">Vehicle No</th>
                                <th className="border border-black p-1 w-20">Qty</th>
                                <th className="border border-black p-1 w-16">Rate</th>
                                <th className="border border-black p-1 w-24">Amount</th>
                                <th className="border border-black p-1 w-8 print:hidden"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id} className="text-center group hover:bg-gray-50">
                                    <td className="border border-black p-1">{index + 1}</td>
                                    <td className="border border-black p-1"><input className="w-full text-center outline-none bg-transparent" value={item.desc} onChange={(e) => { const n = [...items]; n[index].desc = e.target.value; setItems(n) }} /></td>
                                    <td className="border border-black p-1"><input type="date" className="w-full text-center outline-none bg-transparent text-xs" value={item.date} onChange={(e) => { const n = [...items]; n[index].date = e.target.value; setItems(n) }} /></td>
                                    <td className="border border-black p-1"><input className="w-full text-center outline-none bg-transparent uppercase" value={item.vehicle} onChange={(e) => { const n = [...items]; n[index].vehicle = e.target.value; setItems(n) }} /></td>
                                    <td className="border border-black p-1"><input type="number" className="w-full text-center outline-none bg-transparent" value={item.qty} onChange={(e) => { const n = [...items]; n[index].qty = e.target.value; setItems(n) }} /></td>
                                    <td className="border border-black p-1"><input type="number" className="w-full text-center outline-none bg-transparent" value={item.rate} onChange={(e) => { const n = [...items]; n[index].rate = e.target.value; setItems(n) }} /></td>
                                    <td className="border border-black p-1 font-bold">{Math.round(item.qty * item.rate).toLocaleString('en-IN')}</td>
                                    <td className="border border-black p-1 print:hidden cursor-pointer text-red-500" onClick={() => setItems(items.filter(i => i.id !== item.id))}><Trash2 size={14} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setItems([...items, { id: Date.now(), desc: "Fire Wood", date: "", vehicle: "", qty: 0, rate: 0 }])} className="mt-2 text-blue-600 flex items-center gap-1 print:hidden text-xs font-bold"><Plus size={14} /> Add Row</button>
                </div>

                {/* TOTALS & FOOTER */}
                <div className="flex justify-end mb-4">
                    <div className="text-right">
                        <h3 className="text-xl font-bold border-b border-black inline-block pb-1">Total: {Math.round(total).toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="font-bold">RUPEES: - </span>
                    <input className="w-3/4 border-b border-gray-300 outline-none italic" placeholder="Enter amount in words..." defaultValue="Sixty Thousand Two Hundred Seven" />
                </div>

                {/* BANK & SIGNATURE */}
                <div className="flex justify-between items-end border-t border-black pt-4">
                    <div className="text-sm w-1/2">
                        <p className="font-bold underline mb-1">COMPANY BANK DETAILS:</p>
                        <div className="grid grid-cols-[100px_1fr] gap-0">
                            <span className="font-semibold">Account Name:</span> <span>{bank.accName}</span>
                            <span className="font-semibold">Pan No:</span> <span>{bank.pan}</span>
                            <span className="font-semibold">Bank Name:</span> <span>{bank.bankName}</span>
                            <span className="font-semibold">Account No:</span> <span>{bank.accNo}</span>
                            <span className="font-semibold">Branch:</span> <span>{bank.branch}</span>
                            <span className="font-semibold">IFSC CODE:</span> <span>{bank.ifsc}</span>
                        </div>
                    </div>
                    <div className="text-center w-1/3">
                        <p className="font-bold mb-4">For, {seller.name}</p>
                        {/* Signature Manager */}
                        <div className="mb-2 w-full flex justify-center">
                            {/* In Print mode, only show Image */}
                            <div className="hidden print:block h-20 flex items-end justify-center">
                                {signature ? (
                                    <img src={signature} alt="Authorized Sig" className="h-16 object-contain" />
                                ) : (
                                    <div className="h-16"></div>
                                )}
                            </div>
                            {/* In Interactive mode, show Selector */}
                            <div className="print:hidden w-full">
                                <SignatureSelector onSelect={setSignature} currentSignature={signature} />
                            </div>
                        </div>
                        <p className="border-t border-black pt-1 font-bold">Authorized Signature</p>
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

export default InvoiceJK;