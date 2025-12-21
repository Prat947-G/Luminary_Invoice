// src/components/ChallanManager.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Save, RefreshCw } from 'lucide-react';
import { useReactToPrint } from 'react-to-print'; // Optional: simplified printing logic

const ChallanManager = ({ onExit }) => {
  const navigate = useNavigate();
  const printRef = useRef();

  // DEFAULT DATA (From your uploaded PDF)
  const [formData, setFormData] = useState({
    challanNo: '56',
    date: new Date().toISOString().split('T')[0],
    
    // SUPPLIER DETAILS (Nageshwar Enterprise)
    supplierName: "NAGESHWAR ENTERPRISE",
    supplierDesc: "ALL TYPES BOILERS, IBR & NON OPERATION MAINTENANCE\nSuppliers of Biodegradable Agri waste in chips, Wood Chips and Biomass Briquettes",
    supplierAddress: "A/P PATAS (AVADNAGAR) TAL-DAUND, DIST-PUNE 412219",
    supplierContact: "Pramod Kadam | Mob: 9623041007 | Email: pramodkadam343@gmail.com",
    
    // BANK DETAILS
    bankName: "Axis Bank Ltd.",
    accName: "Nageshwar Enterprises",
    accNo: "917020061328975",
    ifsc: "UTIB0001952",
    pan: "BHGPK5499F",

    // CLIENT DETAILS
    clientName: "JVS Comatsco Industries Pvt. Ltd.",
    clientAddress: "Gate no. 385/402, Village Deulgaon Gada, Tal - Daund, Dist - Pune, 412203",

    // ITEM DETAILS
    srNo: "1",
    description: "Biodegradable Agri waste in chips",
    quantity: "15000 kg",
    vehicleNo: "MH-12-FZ-9334"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans">
      
      {/* --- 1. TOOLBAR (Hidden when printing) --- */}
      <div className="print:hidden bg-[#1c1917] text-white p-4 sticky top-0 z-50 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/operations')} className="text-stone-400 hover:text-amber-500 transition"><ArrowLeft size={20}/></button>
          <h1 className="text-lg font-bold uppercase tracking-widest text-amber-500">Challan Manager</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded text-xs font-bold uppercase tracking-wide transition">
             <RefreshCw size={14}/> Reset
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold uppercase tracking-wide shadow-lg transition animate-pulse-slow">
             <Printer size={16}/> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        
        {/* --- 2. EDITOR PANEL (Left Side - Hidden when printing) --- */}
        <div className="print:hidden w-full lg:w-1/3 bg-white border-r border-stone-200 p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 border-b pb-2">Entry Details</h2>
          
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Challan No</label>
                 <input name="challanNo" value={formData.challanNo} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 p-2 rounded text-sm focus:border-amber-500 outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Date</label>
                 <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 p-2 rounded text-sm focus:border-amber-500 outline-none" />
               </div>
            </div>

            {/* Client Info */}
            <div>
               <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Client Name</label>
               <input name="clientName" value={formData.clientName} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 p-2 rounded text-sm focus:border-amber-500 outline-none font-bold" />
            </div>
            <div>
               <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Client Address</label>
               <textarea name="clientAddress" value={formData.clientAddress} onChange={handleChange} rows={2} className="w-full bg-stone-50 border border-stone-200 p-2 rounded text-sm focus:border-amber-500 outline-none" />
            </div>

            <hr className="border-stone-100"/>

            {/* Item Details */}
            <div>
               <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Description of Goods</label>
               <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-stone-50 border border-stone-200 p-2 rounded text-sm focus:border-amber-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Vehicle No</label>
                 <input name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 p-2 rounded text-sm focus:border-amber-500 outline-none font-mono" />
               </div>
               <div>
                 <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Quantity (Kg/Tons)</label>
                 <input name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 p-2 rounded text-sm focus:border-amber-500 outline-none font-bold" />
               </div>
            </div>

          </div>
        </div>

        {/* --- 3. LIVE PREVIEW (Right Side - Takes full screen on Print) --- */}
        <div className="w-full lg:w-2/3 bg-stone-100 p-8 overflow-y-auto flex justify-center print:p-0 print:w-full print:bg-white print:absolute print:top-0 print:left-0 print:z-[100]">
           
           {/* THE A4 PAPER */}
           <div ref={printRef} className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[10mm] print:shadow-none print:w-full print:h-full relative text-black leading-tight">
              
              {/* HEADER (Replicating Nageshwar Enterprise Format) */}
              <div className="text-center border-b-2 border-black pb-2 mb-2">
                 <h1 className="text-3xl font-bold uppercase tracking-wide">{formData.supplierName}</h1>
                 <p className="text-xs font-bold mt-1 whitespace-pre-line">{formData.supplierDesc}</p>
                 <p className="text-xs mt-1 uppercase">{formData.supplierAddress}</p>
                 <p className="text-xs font-bold mt-1">{formData.supplierContact}</p>
              </div>

              {/* CHALLAN TITLE */}
              <div className="text-center mb-6">
                 <span className="inline-block border border-black px-6 py-1 text-lg font-bold uppercase bg-gray-100">Delivery Challan</span>
              </div>

              {/* INFO ROW */}
              <div className="flex justify-between mb-4 text-sm font-medium">
                 <div className="w-1/2">
                    <p><span className="font-bold">Challan No:</span> {formData.challanNo}</p>
                 </div>
                 <div className="w-1/2 text-right">
                    <p><span className="font-bold">Date:</span> {formData.date}</p>
                 </div>
              </div>

              {/* CLIENT SECTION */}
              <div className="border border-black p-3 mb-4 text-sm">
                 <p><span className="font-bold">To:</span> {formData.clientName}</p>
                 <p className="mt-1 ml-6 w-3/4">{formData.clientAddress}</p>
              </div>

              {/* MAIN TABLE */}
              <table className="w-full border-collapse border border-black mb-6 text-sm">
                 <thead className="bg-gray-100">
                    <tr>
                       <th className="border border-black p-2 w-16 text-center">Sr.No</th>
                       <th className="border border-black p-2 text-left">Description</th>
                       <th className="border border-black p-2 w-32 text-center">Quantity</th>
                       <th className="border border-black p-2 w-32 text-center">Vehicle No</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="h-40 align-top">
                       <td className="border border-black p-2 text-center">{formData.srNo}</td>
                       <td className="border border-black p-2 font-medium">{formData.description}</td>
                       <td className="border border-black p-2 text-center font-bold">{formData.quantity}</td>
                       <td className="border border-black p-2 text-center uppercase">{formData.vehicleNo}</td>
                    </tr>
                    {/* Empty rows to fill space if needed */}
                    <tr className="h-8">
                       <td className="border border-black p-2"></td>
                       <td className="border border-black p-2"></td>
                       <td className="border border-black p-2"></td>
                       <td className="border border-black p-2"></td>
                    </tr>
                 </tbody>
              </table>

              {/* FOOTER / BANK DETAILS */}
              <div className="flex justify-between items-end mt-12 text-sm">
                 
                 {/* Bank Info */}
                 <div className="border border-black p-3 w-[55%]">
                    <p className="font-bold underline mb-2">Company's Bank Details:</p>
                    <p><strong>Bank Name:</strong> {formData.bankName}</p>
                    <p><strong>Account Name:</strong> {formData.accName}</p>
                    <p><strong>Account No:</strong> {formData.accNo}</p>
                    <p><strong>IFSC CODE:</strong> {formData.ifsc}</p>
                    <p className="mt-2"><strong>PAN No:</strong> {formData.pan}</p>
                 </div>

                 {/* Signature */}
                 <div className="text-center w-[40%]">
                    <p className="mb-12 font-bold">For, {formData.supplierName}</p>
                    <p className="border-t border-black inline-block px-8 pt-1">Authorised Signatory</p>
                 </div>
              </div>

              {/* Subject to Jurisdiction */}
              <div className="text-center text-[10px] mt-8 text-gray-500">
                 Subject to Pune Jurisdiction
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default ChallanManager;