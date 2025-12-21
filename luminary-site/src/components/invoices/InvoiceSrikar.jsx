// src/components/invoices/InvoiceSrikar.jsx
import React, { useState, useRef } from 'react';
import { ArrowLeft, Printer, Mail, Plus, Trash2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

const InvoiceSrikar = () => {
   const navigate = useNavigate();
   const printRef = useRef();

   const [data, setData] = useState({
      invoiceNo: '57/25/26',
      date: new Date().toISOString().split('T')[0],
      month: 'November 2025',
      clientName: 'SRIKAR BUILDING MATERIALS (MH) PRIVATE LIMITED',
      clientAddress: 'GAT NO.272, KHOR VILLAGE, DAUND TALUKA, PUNE DISTRICT-412203\nGSTN: 27ABICS3594F1ZZ',
      items: [
         { id: 1, desc: 'MAINTENANCE OF BOILER AND AUTOCLAVES WITH SUITABLE MANPOWER AS PER ANNEXURE', qty: 1, rate: 287000 }
      ]
   });

   const baseTotal = data.items.reduce((acc, item) => acc + (Number(item.qty) * Number(item.rate)), 0);
   const gst = baseTotal * 0.18;
   const grandTotal = baseTotal + gst;

   const handlePrint = useReactToPrint({ content: () => printRef.current });

   const updateItem = (id, field, value) => {
      const newItems = data.items.map(item =>
         item.id === id ? { ...item, [field]: value } : item
      );
      setData({ ...data, items: newItems });
   };

   const addItem = () => {
      setData({
         ...data,
         items: [...data.items, { id: Date.now(), desc: '', qty: 1, rate: 0 }]
      });
   };

   const removeItem = (id) => {
      if (data.items.length > 1) {
         setData({ ...data, items: data.items.filter(item => item.id !== id) });
      }
   };

   return (
      <div className="min-h-screen bg-stone-100 p-8 flex justify-center">
         <div className="fixed top-4 left-4 flex flex-col gap-2 print:hidden">
            <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow hover:bg-stone-200"><ArrowLeft size={20} /></button>
            <button onClick={handlePrint} className="bg-amber-600 text-white p-3 rounded-full shadow hover:bg-amber-700"><Printer size={20} /></button>
            <button onClick={addItem} className="bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700" title="Add Row"><Plus size={20} /></button>
         </div>

         {/* A4 PAPER - STRICT "NAGESHWAR" LAYOUT */}
         <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] p-[12mm] shadow-2xl relative text-black font-serif text-sm">

            {/* HEADER */}
            <div className="border-b-2 border-black pb-4 mb-4 text-center">
               <h1 className="text-3xl font-bold text-red-700 uppercase">NAGESHWAR ENTERPRISES</h1>
               <p className="font-bold text-xs">All Type Boiler Operation and Maintenance & Biomass Fuel Supplier.</p>
               <p className="text-xs">Address: At Post Patas (Avhadnagar), Tal Daund, Dist Pune - 412219</p>
               <div className="flex justify-center gap-4 text-xs font-bold mt-1">
                  <span>Prop: Pramod Kadam / Ganesh Bhawar</span>
                  <span>Mob: 9623041007</span>
               </div>
               <p className="text-xs font-bold">GSTIN: 27BHGPK5499F1ZX</p>
            </div>

            {/* CLIENT & META GRID */}
            <div className="flex justify-between mb-6">
               <div className="w-1/2 border border-black p-2">
                  <p className="font-bold uppercase text-xs text-gray-500 mb-1">Bill To:</p>
                  <textarea value={data.clientName} onChange={e => setData({ ...data, clientName: e.target.value })} className="w-full font-bold h-12 resize-none outline-none" />
                  <textarea value={data.clientAddress} onChange={e => setData({ ...data, clientAddress: e.target.value })} className="w-full text-xs h-16 resize-none outline-none" />
               </div>
               <div className="w-1/3 text-right">
                  <div className="flex justify-between items-center mb-1">
                     <strong>Date:</strong>
                     <input type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} className="text-right outline-none w-32" />
                  </div>
                  <div className="flex justify-between items-center mb-1">
                     <strong>Invoice No:</strong>
                     <input value={data.invoiceNo} onChange={e => setData({ ...data, invoiceNo: e.target.value })} className="text-right outline-none w-24" />
                  </div>
                  <div className="flex justify-between items-center">
                     <strong>Service Month:</strong>
                     <input value={data.month} onChange={e => setData({ ...data, month: e.target.value })} className="text-right outline-none w-32" />
                  </div>
               </div>
            </div>

            {/* TABLE */}
            <table className="w-full border-collapse border border-black mb-4">
               <thead>
                  <tr className="bg-gray-200">
                     <th className="border border-black p-2 w-12">Sr No</th>
                     <th className="border border-black p-2 text-left">Description</th>
                     <th className="border border-black p-2 w-16">Qty</th>
                     <th className="border border-black p-2 w-24">Rate</th>
                     <th className="border border-black p-2 w-28">Amount</th>
                  </tr>
               </thead>
               <tbody>
                  {data.items.map((item, i) => (
                     <tr key={item.id} className="align-top group">
                        <td className="border border-black p-2 text-center relative">
                           {i + 1}
                           <button onClick={() => removeItem(item.id)} className="absolute left-0 top-2 hidden group-hover:block text-red-500 print:hidden"><Trash2 size={12} /></button>
                        </td>
                        <td className="border border-black p-2">
                           <textarea
                              value={item.desc}
                              onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                              className="w-full h-20 resize-none outline-none bg-transparent"
                           />
                        </td>
                        <td className="border border-black p-2 text-center">
                           <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                              className="w-full text-center outline-none bg-transparent"
                           />
                        </td>
                        <td className="border border-black p-2 text-right">
                           <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                              className="w-full text-right outline-none bg-transparent"
                           />
                        </td>
                        <td className="border border-black p-2 text-right font-bold">
                           {(item.qty * item.rate).toLocaleString('en-IN')}
                        </td>
                     </tr>
                  ))}
                  <tr>
                     <td colSpan="4" className="border border-black p-2 text-right font-bold">Total</td>
                     <td className="border border-black p-2 text-right">{baseTotal.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                     <td colSpan="4" className="border border-black p-2 text-right font-bold">GST (18%)</td>
                     <td className="border border-black p-2 text-right">{gst.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-gray-100">
                     <td colSpan="4" className="border border-black p-2 text-right font-bold text-lg">TOTAL</td>
                     <td className="border border-black p-2 text-right font-bold text-lg">{grandTotal.toLocaleString('en-IN')}</td>
                  </tr>
               </tbody>
            </table>

            {/* FOOTER */}
            <div className="mt-8 border border-black p-4 flex justify-between items-end">
               <div className="text-xs">
                  <p className="font-bold underline mb-2">Bank Details:</p>
                  <p><strong>Bank:</strong> Axis Bank Ltd</p>
                  <p><strong>Acc No:</strong> 917020061328975</p>
                  <p><strong>IFSC:</strong> UTIB0001952</p>
               </div>
               <div className="text-center">
                  <p className="font-bold mb-8">For Nageshwar Enterprises</p>
                  <p className="border-t border-black pt-1">Authorized Signature</p>
               </div>
            </div>
         </div>
      </div>
   );
};
export default InvoiceSrikar;