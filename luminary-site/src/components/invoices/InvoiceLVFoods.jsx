// src/components/invoices/InvoiceLVFoods.jsx
import React, { useState, useRef } from 'react';
import { ArrowLeft, Printer, Mail, Plus, Trash2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

const InvoiceLVFoods = () => {
   const navigate = useNavigate();
   const printRef = useRef();

   const [data, setData] = useState({
      invoiceNo: '82-25-26',
      date: new Date().toISOString().split('T')[0],
      month: 'November 2025',
      period: '1/11/2025 to 30/11/2025',
      clientName: 'LV FOODS INDIA PRIVATE LIMITED',
      clientAddress: 'Gat No. 947/4, At Post-Patas, Tal- Daund, Dist- Pune 412219\nCIN: U15410PN2015PTC154722',
      rows: [
         { id: 1, desc: 'Boiler Operator', days: '90', amount: 100000 },
         { id: 2, desc: 'Labour', days: '120', amount: 80000 },
      ]
   });

   const total = data.rows.reduce((acc, row) => acc + Number(row.amount), 0);

   // Simplified number to words for Indian numbering (Just a placeholder for now as full lib is heavy)
   // In a real app, use 'number-to-words' package
   const numberToWords = (num) => {
      // Very basic implementation or just return "Rupees ..." 
      // For now, let's keep it editable or manual if complex
      return "Amount in Words (Auto-gen coming soon)";
   };

   const [amountInWords, setAmountInWords] = useState("One Lakh Eighty Thousand Only");

   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle: `Invoice_LVFoods_${data.date}`
   });

   const handleEmail = () => {
      // Navigate to mail helper instead of direct mailto
      navigate('/mail-helper', {
         state: {
            recipient: {
               name: 'LV Foods',
               email: 'accounts_lvdairy@live.com'
            }
         }
      });
   };

   const updateRow = (id, field, value) => {
      setData({
         ...data,
         rows: data.rows.map(r => r.id === id ? { ...r, [field]: value } : r)
      });
   };

   const addRow = () => {
      setData({
         ...data,
         rows: [...data.rows, { id: Date.now(), desc: '', days: '0', amount: 0 }]
      });
   };

   const removeRow = (id) => {
      if (data.rows.length > 1) {
         setData({ ...data, rows: data.rows.filter(r => r.id !== id) });
      }
   };

   return (
      <div className="min-h-screen bg-stone-100 p-8 flex justify-center">

         {/* TOOLBAR */}
         <div className="fixed top-4 left-4 flex flex-col gap-2 print:hidden">
            <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow hover:bg-stone-200"><ArrowLeft size={20} /></button>
            <button onClick={handlePrint} className="bg-amber-600 text-white p-3 rounded-full shadow hover:bg-amber-700"><Printer size={20} /></button>
            <button onClick={handleEmail} className="bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700"><Mail size={20} /></button>
            <button onClick={addRow} className="bg-green-600 text-white p-3 rounded-full shadow hover:bg-green-700"><Plus size={20} /></button>
         </div>

         {/* A4 PAPER - STRICT "VENUGOPALA" LAYOUT */}
         <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl relative text-black font-sans text-sm">

            {/* HEADER */}
            <div className="text-center mb-8">
               <h1 className="text-2xl font-bold uppercase underline mb-1">VENUGOPALA TRADERS</h1>
               <p className="font-bold text-sm">Boiler Operator and Maintenance</p>
               <p className="text-xs mt-1">Ram Nivas, Behind Morya Krishi Bhandar, Avhadnagar, Patas,<br />Tal- Daund, Dist- Pune 412219</p>
               <p className="text-xs font-bold mt-1">Jyoti Kadam - 8830162266 / Pramod Kadam 8830156465</p>
            </div>

            {/* CLIENT SECTION */}
            <div className="mb-8">
               <div className="border border-black p-4">
                  <p className="font-bold mb-1">To:</p>
                  <textarea
                     value={data.clientName}
                     onChange={(e) => setData({ ...data, clientName: e.target.value })}
                     className="w-full font-bold uppercase resize-none outline-none bg-transparent"
                  />
                  <textarea
                     value={data.clientAddress}
                     onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                     className="w-full text-xs resize-none h-12 outline-none bg-transparent"
                  />
               </div>
            </div>

            {/* TABLE */}
            <table className="w-full border-collapse border border-black mb-6">
               <thead>
                  <tr className="bg-gray-100">
                     <th className="border border-black p-2 w-16">Sr. No</th>
                     <th className="border border-black p-2 text-left">Description</th>
                     <th className="border border-black p-2 w-24">Total Days</th>
                     <th className="border border-black p-2 w-32 text-right">Amount</th>
                  </tr>
               </thead>
               <tbody>
                  {data.rows.map((row, i) => (
                     <tr key={row.id} className="group">
                        <td className="border border-black p-2 text-center relative">
                           {i + 1}
                           <button onClick={() => removeRow(row.id)} className="absolute left-0 top-2 hidden group-hover:block text-red-500 print:hidden"><Trash2 size={12} /></button>
                        </td>
                        <td className="border border-black p-2">
                           <input value={row.desc} onChange={(e) => updateRow(row.id, 'desc', e.target.value)} className="w-full outline-none bg-transparent" />
                        </td>
                        <td className="border border-black p-2 text-center">
                           <input value={row.days} onChange={(e) => updateRow(row.id, 'days', e.target.value)} className="w-full text-center outline-none bg-transparent" />
                        </td>
                        <td className="border border-black p-2 text-right">
                           <input value={row.amount} onChange={(e) => updateRow(row.id, 'amount', e.target.value)} className="w-full text-right outline-none bg-transparent" />
                        </td>
                     </tr>
                  ))}
                  <tr>
                     <td colSpan="3" className="border border-black p-2 text-right font-bold">Total</td>
                     <td className="border border-black p-2 text-right font-bold">{total.toLocaleString('en-IN')}</td>
                  </tr>
               </tbody>
            </table>

            {/* AMOUNT IN WORDS */}
            <div className="mb-8 font-bold flex gap-2">
               <span>RUPEES:</span>
               <input
                  value={amountInWords}
                  onChange={(e) => setAmountInWords(e.target.value)}
                  className="uppercase underline flex-1 outline-none bg-transparent font-bold"
               />
            </div>

            {/* BOTTOM SECTION: SPLIT LAYOUT */}
            <div className="flex justify-between items-start">

               {/* LEFT: BANK DETAILS */}
               <div className="w-1/2 text-xs border border-black p-3">
                  <p className="font-bold underline mb-2">Company's Bank Details</p>
                  <p><strong>Account Name:</strong> Venugopala Traders.</p>
                  <p><strong>Pan No:</strong> BFXPK7378N</p>
                  <p><strong>Bank Name:</strong> INDIAN BANK</p>
                  <p><strong>Account No:</strong> 7678254669</p>
                  <p><strong>Branch:</strong> Patas</p>
                  <p><strong>IFSC CODE:</strong> IDIB000P261</p>
               </div>

               {/* RIGHT: INVOICE META */}
               <div className="w-2/5 text-right">
                  <div className="mb-6">
                     <h2 className="text-xl font-bold border-b-2 border-black inline-block mb-2">INVOICE</h2>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Tax Invoice:</span>
                        <input value={data.invoiceNo} onChange={e => setData({ ...data, invoiceNo: e.target.value })} className="text-right w-24 outline-none bg-transparent" />
                     </div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Dated:</span>
                        <input type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} className="text-right w-32 outline-none bg-transparent" />
                     </div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Month:</span>
                        <input value={data.month} onChange={e => setData({ ...data, month: e.target.value })} className="text-right w-32 outline-none bg-transparent" />
                     </div>
                  </div>

                  <div className="mt-12 text-center">
                     <p className="mb-8">For, <br /><strong>VENUGOPALA TRADERS</strong></p>
                     <p className="text-[10px]">(Authorised Signatory)</p>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};
export default InvoiceLVFoods;