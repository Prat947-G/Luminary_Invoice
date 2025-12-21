import React, { useState, useRef } from 'react';
import { Printer, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import SignatureSelector from './SignatureSelector';

const InvoiceJVS = () => {
    const navigate = useNavigate();
    const printRef = useRef();
    const [signature, setSignature] = useState(null);

    // --- STATE MANAGEMENT ---

    // Seller Details (Defaulted to Nageshwar Enterprise )
    const [seller, setSeller] = useState({
        name: "NAGESHWAR ENTERPRISE",
        tagline1: "ALL TYPES BOILERS, IBR & NON OPERATION MAINTENANCE",
        tagline2: "Suppliers of Biodegradable Agri waste in chips, Wood Chips and Biomass Briquettes",
        address: "A/P PATAS (AVADNAGAR) TAL-DAUND, DIST-PUNE 412219",
        contact: "Pramod Kadam | Mob: 9623041007 | Email: pramodkadam343@gmail.com",
        gstin: "27BHGPK5499F1ZX",
        pan: "BHGPK5499F"
    });

    // Buyer Details (Defaulted to JVS Comatsco [cite: 8])
    const [buyer, setBuyer] = useState({
        name: "JVS comatsco Industries Pvt. Ltd.",
        address: "Gate no. 385/402, village; Deulgaon Gada, Tal - Daund, Dist - Pune, 412203",
        gstin: "27AABCJ7220K1ZJ"
    });

    // Invoice Meta Data [cite: 10, 12]
    const [invoiceMeta, setInvoiceMeta] = useState({
        invoiceNo: "56/25-26",
        date: "2025-11-28", // Formatted for input type="date"
    });

    // Line Items (Defaulted to source table )
    const [items, setItems] = useState([
        { id: 1, description: "Biodegradable Agri waste in chips", dcNo: "279", dcDate: "2025-11-20", vehicle: "MH45 AQ5155", qty: 10010, rate: 3.8 },
        { id: 2, description: "Biodegradable Agri waste in chips", dcNo: "280", dcDate: "2025-11-22", vehicle: "MH17 BY8371", qty: 12070, rate: 3.8 },
        { id: 3, description: "Biodegradable Agri waste in chips", dcNo: "281", dcDate: "2025-11-22", vehicle: "MH45 AE4645", qty: 11800, rate: 3.8 },
        { id: 4, description: "Biodegradable Agri waste in chips", dcNo: "282", dcDate: "2025-11-23", vehicle: "MH17 BY8371", qty: 11920, rate: 3.8 },
        { id: 5, description: "Biodegradable Agri waste in chips", dcNo: "283", dcDate: "2025-11-24", vehicle: "MH45 AE4645", qty: 11620, rate: 3.8 },
        { id: 6, description: "Biodegradable Agri waste in chips", dcNo: "284", dcDate: "2025-11-24", vehicle: "MH45 AF6355", qty: 9490, rate: 3.8 },
    ]);

    // Bank Details [cite: 16-22]
    const [bank, setBank] = useState({
        bankName: "Axis Bank Ltd.",
        accName: "Nageshwar Enterprises",
        accNo: "917020061328975",
        ifsc: "UTIB0001952"
    });

    // Tax Rates 
    const [taxRates, setTaxRates] = useState({
        cgst: 2.5,
        sgst: 2.5
    });

    // --- CALCULATIONS ---

    const calculateAmount = (qty, rate) => (qty * rate).toFixed(2);

    const subTotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    const cgstAmount = subTotal * (taxRates.cgst / 100);
    const sgstAmount = subTotal * (taxRates.sgst / 100);
    const totalTax = cgstAmount + sgstAmount;
    const grandTotal = Math.round(subTotal + totalTax);

    // Helper to convert number to words (Simplified for demo)
    const numberToWords = (num) => {
        // In a real production app, use a library like 'to-words'
        return `${num} (Amount in words to be calculated dynamically)`;
    };

    // --- HANDLERS ---

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: "", dcNo: "", dcDate: "", vehicle: "", qty: 0, rate: 0 }]);
    };

    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-stone-100 p-8 font-sans" style={{ backgroundColor: '#E7E5E4' }}>
            {/* Control Bar (Hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/network/operations')}
                        className="bg-white p-3 rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all text-stone-600 hover:text-amber-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-stone-900">JVS Format</h1>
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

            {/* Invoice Paper */}
            <div id="invoice-container" className="max-w-4xl mx-auto bg-white shadow-xl p-8 print:shadow-none print:p-0">

                {/* HEADER [cite: 1-6] */}
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                    <input
                        className="w-full text-center text-3xl font-bold uppercase text-blue-900 border-none focus:ring-0 p-0"
                        value={seller.name}
                        onChange={(e) => setSeller({ ...seller, name: e.target.value })}
                    />
                    <input
                        className="w-full text-center text-xs font-bold text-gray-600 mt-1 border-none focus:ring-0 p-0"
                        value={seller.tagline1}
                        onChange={(e) => setSeller({ ...seller, tagline1: e.target.value })}
                    />
                    <input
                        className="w-full text-center text-sm font-semibold text-green-700 mt-1 border-none focus:ring-0 p-0"
                        value={seller.tagline2}
                        onChange={(e) => setSeller({ ...seller, tagline2: e.target.value })}
                    />
                    <div className="mt-2 text-sm">
                        <input className="w-full text-center border-none focus:ring-0 p-0" value={seller.address} onChange={(e) => setSeller({ ...seller, address: e.target.value })} />
                        <input className="w-full text-center border-none focus:ring-0 p-0 font-medium" value={seller.contact} onChange={(e) => setSeller({ ...seller, contact: e.target.value })} />
                        <div className="flex justify-center items-center gap-2 font-bold mt-1">
                            <span>GSTIN:</span>
                            <input className="w-40 border-none focus:ring-0 p-0 font-bold" value={seller.gstin} onChange={(e) => setSeller({ ...seller, gstin: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* INVOICE TITLE & BUYER INFO [cite: 7-12] */}
                <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-4">
                    <div className="w-1/2 pr-4">
                        <h2 className="text-xl font-bold bg-gray-200 inline-block px-2 py-1 mb-2">TAX INVOICE</h2>
                        <div className="text-sm">
                            <p className="font-bold text-gray-600">Bill To:</p>
                            <textarea
                                className="w-full font-bold text-lg border-none resize-none focus:ring-0 p-0"
                                rows={1}
                                value={buyer.name}
                                onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                            />
                            <textarea
                                className="w-full text-sm border-none resize-none focus:ring-0 p-0 h-16"
                                value={buyer.address}
                                onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                            />
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold">GSTIN:</span>
                                <input className="w-full border-none focus:ring-0 p-0" value={buyer.gstin} onChange={(e) => setBuyer({ ...buyer, gstin: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 pl-4 text-right">
                        <div className="flex justify-end items-center gap-2 mb-1">
                            <span className="font-bold text-gray-600">Invoice No:</span>
                            <input className="w-32 text-right font-bold border-b border-gray-300 focus:border-blue-500 outline-none" value={invoiceMeta.invoiceNo} onChange={(e) => setInvoiceMeta({ ...invoiceMeta, invoiceNo: e.target.value })} />
                        </div>
                        <div className="flex justify-end items-center gap-2">
                            <span className="font-bold text-gray-600">Date:</span>
                            <input type="date" className="text-right border-b border-gray-300 focus:border-blue-500 outline-none" value={invoiceMeta.date} onChange={(e) => setInvoiceMeta({ ...invoiceMeta, date: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* ITEMS TABLE  */}
                <div className="mb-6">
                    <table className="w-full border-collapse border border-gray-800 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-center font-bold">
                                <th className="border border-gray-800 p-1 w-10">Sr</th>
                                <th className="border border-gray-800 p-1">Description</th>
                                <th className="border border-gray-800 p-1 w-20">DC No</th>
                                <th className="border border-gray-800 p-1 w-24">DC Date</th>
                                <th className="border border-gray-800 p-1 w-28">Vehicle No</th>
                                <th className="border border-gray-800 p-1 w-20">Qty</th>
                                <th className="border border-gray-800 p-1 w-16">Rate</th>
                                <th className="border border-gray-800 p-1 w-24">Amount</th>
                                <th className="border border-gray-800 p-1 w-8 print:hidden"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id} className="text-center group hover:bg-gray-50">
                                    <td className="border border-gray-800 p-1">{index + 1}</td>
                                    <td className="border border-gray-800 p-1 text-left">
                                        <input className="w-full bg-transparent outline-none" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                                    </td>
                                    <td className="border border-gray-800 p-1">
                                        <input className="w-full text-center bg-transparent outline-none" value={item.dcNo} onChange={(e) => handleItemChange(index, 'dcNo', e.target.value)} />
                                    </td>
                                    <td className="border border-gray-800 p-1">
                                        <input type="date" className="w-full text-center bg-transparent outline-none text-xs" value={item.dcDate} onChange={(e) => handleItemChange(index, 'dcDate', e.target.value)} />
                                    </td>
                                    <td className="border border-gray-800 p-1">
                                        <input className="w-full text-center bg-transparent outline-none uppercase" value={item.vehicle} onChange={(e) => handleItemChange(index, 'vehicle', e.target.value)} />
                                    </td>
                                    <td className="border border-gray-800 p-1">
                                        <input type="number" className="w-full text-center bg-transparent outline-none" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="border border-gray-800 p-1">
                                        <input type="number" className="w-full text-center bg-transparent outline-none" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="border border-gray-800 p-1 font-medium">
                                        {calculateAmount(item.qty, item.rate)}
                                    </td>
                                    <td className="border border-gray-800 p-1 print:hidden text-red-500 cursor-pointer" onClick={() => deleteItem(index)}>
                                        <Trash2 size={16} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={addItem} className="mt-2 text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 print:hidden">
                        <Plus size={16} /> Add Line Item
                    </button>
                </div>

                {/* TOTALS & TAXES  */}
                <div className="flex justify-end mb-6">
                    <div className="w-1/2 border border-gray-800 text-sm">
                        <div className="flex justify-between p-2 border-b border-gray-800">
                            <span className="font-bold">SUB TOTAL</span>
                            <span>{subTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>
                        <div className="flex justify-between p-2 border-b border-gray-800">
                            <span>CGST ({taxRates.cgst}%)</span>
                            <span>{cgstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>
                        <div className="flex justify-between p-2 border-b border-gray-800">
                            <span>SGST ({taxRates.sgst}%)</span>
                            <span>{sgstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-200 font-bold text-lg">
                            <span>GRAND TOTAL</span>
                            <span>{grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>
                    </div>
                </div>

                {/* AMOUNT IN WORDS & BANK INFO [cite: 15-22] */}
                <div className="border-t-2 border-gray-800 pt-4">
                    <p className="font-bold mb-4">
                        Amount In Words: <span className="font-normal italic underline">Two Lakh Sixty Six Thousand Nine Hundred Seventy Only. (Static for demo)</span>
                    </p>

                    <div className="flex justify-between items-end">
                        <div className="text-sm">
                            <p className="font-bold underline mb-1">Company's Bank Details:</p>
                            <div className="grid grid-cols-[100px_1fr] gap-1">
                                <span className="font-semibold">Bank Name:</span>
                                <input className="border-none p-0 h-5" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} />

                                <span className="font-semibold">Account Name:</span>
                                <input className="border-none p-0 h-5" value={bank.accName} onChange={(e) => setBank({ ...bank, accName: e.target.value })} />

                                <span className="font-semibold">Account No:</span>
                                <input className="border-none p-0 h-5" value={bank.accNo} onChange={(e) => setBank({ ...bank, accNo: e.target.value })} />

                                <span className="font-semibold">IFSC Code:</span>
                                <input className="border-none p-0 h-5" value={bank.ifsc} onChange={(e) => setBank({ ...bank, ifsc: e.target.value })} />

                                <span className="font-semibold">PAN No:</span>
                                <input className="border-none p-0 h-5" value={seller.pan} onChange={(e) => setSeller({ ...seller, pan: e.target.value })} />
                            </div>
                        </div>

                        <div className="text-center w-64">
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
                            <p className="border-t border-gray-400 pt-1 font-semibold">Authorised Signatory</p>
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
          input, textarea { border: none !important; resize: none; }
        }
      `}</style>
            </div>
        </div>
    );
};

export default InvoiceJVS;