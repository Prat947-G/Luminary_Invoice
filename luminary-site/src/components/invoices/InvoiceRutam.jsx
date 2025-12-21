// src/components/invoices/InvoiceRutam.jsx
import React, { useState, useRef } from 'react';
import { ArrowLeft, Printer, Plus, Trash2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

const InvoiceRutam = () => {
   const navigate = useNavigate();
   const printRef = useRef();

   const [data, setData] = useState({
      invoiceNo: '35/25-26',
      date: new Date().toISOString().split('T')[0],
      clientName: 'RUTAM ENGINEERING PVT. LTD.',
      clientAddress: 'Clarion park near Gaikwad petrol pump, Aundh, Pune 411067.',
      items: [
         { id: 1, desc: 'Cipla Pharma Ltd Unit 1 boiler inspection work (Boiler 1)', rate: 40000, qty: 1 },
         { id: 2, desc: 'Cipla Pharma Ltd Unit 1 boiler inspection work (Boiler 2)', rate: 40000, qty: 1 }
      ]
   });

   const total = data.items.reduce((acc, i) => acc + Number(i.rate) * Number(i.qty), 0);
   const handlePrint = useReactToPrint({ content: () => printRef.current });

   const updateItem = (id, field, value) => {
      setData({
         ...data,
         items: data.items.map(item => item.id === id ? { ...item, [field]: value } : item)
      });
   };

   const addItem = () => {
      setData({
         ...data,
         items: [...data.items, { id: Date.now(), desc: '', rate: 0, qty: 1 }]
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
            <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow"><ArrowLeft size={20} /></button>
            <button onClick={handlePrint} className="bg-amber-600 text-white p-3 rounded-full shadow"><Printer size={20} /></button>
            <button onClick={addItem} className="bg-blue-600 text-white p-3 rounded-full shadow" title="Add Item"><Plus size={20} /></button>
         </div>

         {/* A4 PAPER - STRICT "JYOTI KADAM" LAYOUT */}
         <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl relative text-black font-sans">

            {/* HEADER */}
            <div className="mb-8">
               <h1 className="text-xl font-bold">JYOTI KADAM</h1>
               <p className="text-xs font-bold">IBR & NON IBR BOILER OPERATION MAINTANANCE</p>
               <p className="text-xs">A/P PATAS (AVADNAGAR) TAL-DAUND, DIST-PUNE 412219</p>
               <p className="text-xs">Pramod Kadam MOB: 9623041007 | Email: pramodkadam343@gmail.com</p>
            </div>

            <h2 className="text-center text-2xl font-bold underline tracking-widest mb-6">INVOICE</h2>

            {/* TABLE */}
            <table className="w-full border-collapse border border-black mb-6 text-sm">
               <thead>
                  <tr>
                     <th className="border border-black p-2 w-12">Sr.No</th>
                     <th className="border border-black p-2 text-left">Description</th>
                     <th className="border border-black p-2 w-24">Rate</th>
                     <th className="border border-black p-2 w-16">Qty</th>
                     <th className="border border-black p-2 w-28">Amount</th>
                  </tr>
               </thead>
               <tbody>
                  {data.items.map((item, i) => (
                     <tr key={item.id} className="group">
                        <td className="border border-black p-2 text-center relative">
                           {i + 1}
                           <button onClick={() => removeItem(item.id)} className="absolute left-0 top-1 hidden group-hover:block text-red-500 print:hidden"><Trash2 size={12} /></button>
                        </td>
                        <td className="border border-black p-2">
                           <textarea
                              value={item.desc}
                              onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                              className="w-full outline-none resize-none h-12 bg-transparent"
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
                        <td className="border border-black p-2 text-center">
                           <div className="flex items-center justify-center">
                              <input
                                 type="number"
                                 value={item.qty}
                                 onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                 className="w-8 text-center outline-none bg-transparent"
                              />
                              <span>Nos</span>
                           </div>
                        </td>
                        <td className="border border-black p-2 text-right font-bold">{(item.rate * item.qty).toLocaleString('en-IN')}</td>
                     </tr>
                  ))}
                  <tr>
                     <td colSpan="4" className="border border-black p-2 text-right font-bold">TOTAL</td>
                     <td className="border border-black p-2 text-right font-bold">{total.toLocaleString('en-IN')}</td>
                  </tr>
               </tbody>
            </table>

            {/* CLIENT DETAILS (BOTTOM LEFT IN PDF) */}
            <div className="mb-6 text-sm">
               <div className="flex gap-2">
                  <span className="font-bold">NAME:</span>
                  <textarea
                     value={data.clientName}
                     onChange={(e) => setData({ ...data, clientName: e.target.value })}
                     className="font-bold flex-1 outline-none resize-none overflow-hidden bg-transparent h-6"
                  />
               </div>

               <textarea
                  value={data.clientAddress}
                  onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                  className="w-1/2 outline-none resize-none bg-transparent h-16"
               />

               <div className="mt-4">
                  <div className="flex gap-2 items-center">
                     <strong>Date:</strong>
                     <input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} className="outline-none bg-transparent" />
                  </div>
                  <div className="flex gap-2 items-center">
                     <strong>BILL NO:</strong>
                     <input value={data.invoiceNo} onChange={(e) => setData({ ...data, invoiceNo: e.target.value })} className="outline-none bg-transparent font-bold" />
                  </div>
               </div>
            </div>

            <div className="border-t-2 border-black my-4"></div>

            {/* BANK & SIGNATURE */}
            <div className="flex justify-between items-end text-sm">
               <div>
                  <p className="font-bold underline mb-1">Company's Bank Details:</p>
                  <p>Bank: State Bank of India</p>
                  <p>Acc No: 36811233518</p>
                  <p>Branch: Kurkumbh MIDC</p>
                  <p>IFSC: SBIN0009331</p>
               </div>
               <div className="text-center">
                  <p className="mb-6">For, <strong>JYOTI KADAM</strong></p>
                  <p className="border-t border-black pt-1">Authorised Signatory</p>
               </div>
            </div>

         </div>
      </div>
   );
};
export default InvoiceRutam;