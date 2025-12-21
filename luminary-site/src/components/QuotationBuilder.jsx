import React, { useState, useRef } from 'react';
import { ArrowLeft, Printer, Plus, Trash2, Settings, Upload, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const QuotationBuilder = ({ onExit }) => {
  const printRef = useRef();

  // --- STATE ---
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    
    // SENDER
    companyName: "NAGESHWAR ENTERPRISES",
    subtitle: "All Type Boiler Operation and Maintenance & Biomass Fuel Supplier.",
    address: "At Post Patas (Avhadnagar), Tal Daund, Dist Pune – 412219",
    proprietors: "Proprietor: Pramod Kadam / Ganesh Bhawar",
    contact: "Mob No: 9623041007 / 7030215008 | Email: pramodkadam343@gmail.com",
    gstin: "GSTIN: 27BHGPK5499F1ZX",

    // CLIENT
    clientName: "ATHARVA MEDIAQUA PVT LTD",
    clientAddress: "MIDC Ranjangaon Tal Shirur Dist Pune Maharashtra.",
    
    // CONTENT
    subject: "Quotation for Work Contract of Operation & Maintenance For 1.5 TPH Wood Fired Boiler",
    intro: "We got the information through reliable resources that your company is planning to give a work contract for operation & maintenance of boiler in your company. We are submitting the offer for the same as follows.",
    
    // LISTS
    scope: [
      "Boiler Operation & Maintenance for 30 days.",
      "The contract stipulates 24-hour daily boiler operation, with the operator and fireman each assigned a 12-hour duty shift.",
      "Maintenance charges will be separate from boiler operations.",
      "In the event of the boiler operator's absence, the remaining personnel will cover the full 24-hour shift."
    ],
    terms: [
      "100% Payment within Ten Days Form Submission on Bills i.e., on 10th of each month.",
      "SGST 9 % CGST 9 % Extra. Total GST 18 % Pay by you.",
      "PO Order required."
    ],

    // BANK DETAILS (Optional)
    showBankDetails: false,
    bankName: "Axis Bank Ltd.",
    accNo: "917020061328975",
    ifsc: "UTIB0001952"
  });

  const [items, setItems] = useState([
    { id: 1, desc: "Thermic Fluid Boiler Operator", unit: "1", rate: 42000 },
    { id: 2, desc: "Fireman", unit: "2", rate: 44000 },
  ]);

  // FINANCIAL SETTINGS
  const [rates, setRates] = useState({
    serviceCharge: 16,
    gst: 18
  });

  const [signature, setSignature] = useState(null);

  // --- CALCULATIONS ---
  const subTotal = items.reduce((sum, item) => sum + (Number(item.rate)), 0);
  const serviceAmt = (subTotal * rates.serviceCharge) / 100;
  const taxableAmt = subTotal + serviceAmt;
  const gstAmt = (taxableAmt * rates.gst) / 100;
  const grandTotal = taxableAmt + gstAmt;

  // --- HANDLERS ---
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Quotation_${formData.clientName.replace(/ /g, '_')}`
  });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleRateChange = (e) => setRates({ ...rates, [e.target.name]: Number(e.target.value) });

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems([...items, { id: Date.now(), desc: "", unit: "1", rate: 0 }]);
  const removeItem = (id) => setItems(items.filter(item => item.id !== id));

  // Handle Image Upload for Signature
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignature(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans flex flex-col">
      
      {/* --- TOOLBAR --- */}
      <div className="print:hidden bg-[#1c1917] text-white p-3 sticky top-0 z-50 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="text-stone-400 hover:text-amber-500 transition"><ArrowLeft size={20}/></button>
          <h1 className="text-lg font-bold uppercase tracking-widest text-amber-500">Quotation Builder</h1>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold uppercase tracking-wide shadow-lg transition">
             <Printer size={16}/> Print PDF
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-[calc(100vh-60px)]">
        
        {/* --- LEFT: EDITOR PANEL --- */}
        <div className="print:hidden w-full lg:w-1/3 bg-white border-r border-stone-200 p-6 overflow-y-auto custom-scrollbar pb-24">
           <div className="space-y-6">
              
              {/* 1. COMMERCIAL SETTINGS */}
              <div className="bg-amber-50 p-4 rounded border border-amber-100 shadow-sm">
                 <div className="flex items-center gap-2 mb-3 text-amber-700">
                    <Settings size={14}/> 
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Commercial Settings</h3>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                    <div>
                       <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Date</label>
                       <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 text-xs border border-amber-200 rounded bg-white focus:outline-amber-500" />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Service %</label>
                       <input type="number" name="serviceCharge" value={rates.serviceCharge} onChange={handleRateChange} className="w-full p-2 text-xs border border-amber-200 rounded bg-white focus:outline-amber-500" />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">GST %</label>
                       <input type="number" name="gst" value={rates.gst} onChange={handleRateChange} className="w-full p-2 text-xs border border-amber-200 rounded bg-white focus:outline-amber-500" />
                    </div>
                 </div>
              </div>

              {/* 2. Client Details */}
              <div className="bg-stone-50 p-4 rounded border border-stone-100">
                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Client Information</h3>
                <div className="space-y-3">
                   <input name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Client Name" className="w-full p-2 text-sm border rounded" />
                   <textarea name="clientAddress" value={formData.clientAddress} onChange={handleInputChange} placeholder="Address" rows={2} className="w-full p-2 text-sm border rounded" />
                   <input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject Line" className="w-full p-2 text-sm border rounded font-medium text-amber-700" />
                </div>
              </div>

              {/* 3. Items Table */}
              <div>
                <div className="flex justify-between items-end mb-2">
                   <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Items</h3>
                   <button onClick={addItem} className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:underline"><Plus size={12}/> Add</button>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={item.id} className="flex gap-2 items-start group">
                       <span className="text-xs text-stone-400 py-2 w-4">{idx + 1}.</span>
                       <input value={item.desc} onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} placeholder="Description" className="flex-1 p-2 text-xs border rounded" />
                       <input value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)} placeholder="Unit" className="w-10 p-2 text-xs border rounded text-center" />
                       <input type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} placeholder="Rate" className="w-16 p-2 text-xs border rounded text-right" />
                       <button onClick={() => removeItem(item.id)} className="p-2 text-red-300 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Terms & Bank */}
              <div className="bg-stone-50 p-4 rounded border border-stone-100">
                 <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Terms & Extras</h3>
                 <textarea 
                    value={formData.terms.join('\n')} 
                    onChange={(e) => setFormData({...formData, terms: e.target.value.split('\n')})} 
                    rows={4} 
                    className="w-full p-2 text-xs border rounded mb-3"
                 />
                 
                 {/* Bank Details Toggle */}
                 <div className="flex items-center gap-2 mb-3">
                    <input 
                      type="checkbox" 
                      checked={formData.showBankDetails} 
                      onChange={(e) => setFormData({...formData, showBankDetails: e.target.checked})}
                      className="accent-amber-600"
                    />
                    <label className="text-xs font-bold text-stone-600">Show Bank Details on Print</label>
                 </div>

                 {/* Signature Upload */}
                 <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Digital Signature</label>
                    <div className="flex items-center gap-2">
                       <label className="cursor-pointer bg-white border border-stone-300 rounded px-3 py-2 text-xs flex items-center gap-2 hover:bg-stone-50">
                          <Upload size={14}/> Upload Image
                          <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                       </label>
                       {signature && (
                          <button onClick={() => setSignature(null)} className="text-red-500 p-1 hover:bg-red-50 rounded"><X size={14}/></button>
                       )}
                    </div>
                 </div>
              </div>

           </div>
        </div>

        {/* --- RIGHT: PREVIEW --- */}
        <div className="w-full lg:w-2/3 bg-stone-200 p-8 overflow-y-auto flex justify-center print:p-0 print:w-full print:bg-white print:overflow-visible">
           
           <div ref={printRef} className="bg-white shadow-xl w-[210mm] min-h-[297mm] p-[12mm] relative text-black leading-snug text-[10pt] font-serif print:shadow-none print:w-full box-border">
              
              {/* HEADER */}
              <div className="text-center border-b-2 border-black pb-3 mb-4">
                 <h1 className="text-2xl font-bold uppercase tracking-wider mb-1 text-[#C2410C]">{formData.companyName}</h1>
                 <p className="font-bold text-xs mb-1">{formData.subtitle}</p>
                 <p className="text-[10px] mb-2">{formData.address}</p>
                 <div className="flex justify-center gap-6 text-[10px] font-bold border-t border-black pt-1 mt-1 w-4/5 mx-auto">
                    <span>{formData.proprietors}</span>
                 </div>
                 <div className="text-[10px] mt-1">{formData.contact}</div>
                 <div className="text-[10px] font-bold mt-1">{formData.gstin}</div>
              </div>

              {/* META */}
              <div className="flex justify-between items-start mb-4 text-xs">
                 <div className="w-2/3">
                    <p className="font-bold mb-1">To,</p>
                    <p className="font-bold text-sm uppercase text-black">{formData.clientName}</p>
                    <p className="w-full opacity-80">{formData.clientAddress}</p>
                 </div>
                 <div className="text-right">
                    <p><strong>Date:</strong> {formData.date.split('-').reverse().join('/')}</p>
                 </div>
              </div>

              {/* SUBJECT */}
              <div className="mb-4 text-xs">
                 <p className="font-bold underline mb-1">Subject: {formData.subject}</p>
                 <p className="text-justify leading-relaxed opacity-90">{formData.intro}</p>
              </div>

              {/* SCOPE */}
              <div className="mb-4">
                 <p className="font-bold underline mb-1 text-xs">Scope of Work Contract:</p>
                 <ul className="list-disc pl-4 text-xs space-y-0.5 opacity-90">
                    {formData.scope.map((point, i) => <li key={i}>{point}</li>)}
                 </ul>
              </div>

              {/* COMMERCIAL TABLE - Crisp Edges */}
              <table className="w-full border-collapse border border-black mb-4 text-xs">
                 <thead className="bg-gray-200">
                    <tr>
                       <th className="border border-black px-2 py-1 w-10 text-center font-bold">Sr.</th>
                       <th className="border border-black px-2 py-1 text-left font-bold">Description</th>
                       <th className="border border-black px-2 py-1 w-12 text-center font-bold">Unit</th>
                       <th className="border border-black px-2 py-1 text-right w-24 font-bold">Rate</th>
                       <th className="border border-black px-2 py-1 text-right w-28 font-bold">Total</th>
                    </tr>
                 </thead>
                 <tbody>
                    {items.map((item, i) => (
                       <tr key={item.id}>
                          <td className="border border-black px-2 py-1 text-center">{i + 1}</td>
                          <td className="border border-black px-2 py-1">{item.desc}</td>
                          <td className="border border-black px-2 py-1 text-center">{item.unit}</td>
                          <td className="border border-black px-2 py-1 text-right">{Number(item.rate).toLocaleString('en-IN')}</td>
                          <td className="border border-black px-2 py-1 text-right font-bold">{Number(item.rate).toLocaleString('en-IN')}</td>
                       </tr>
                    ))}
                    
                    {/* TOTALS */}
                    <tr>
                       <td colSpan="3" className="border border-black px-2 py-1 text-right font-bold">Service Charges ({rates.serviceCharge}%)</td>
                       <td className="border border-black px-2 py-1 text-right">-</td>
                       <td className="border border-black px-2 py-1 text-right">{serviceAmt.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                    </tr>
                    <tr>
                       <td colSpan="3" className="border border-black px-2 py-1 text-right font-bold">Total (Base + Service)</td>
                       <td className="border border-black px-2 py-1 text-right">-</td>
                       <td className="border border-black px-2 py-1 text-right">{taxableAmt.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                    </tr>
                    <tr>
                       <td colSpan="3" className="border border-black px-2 py-1 text-right font-bold">GST ({rates.gst}%)</td>
                       <td className="border border-black px-2 py-1 text-right">-</td>
                       <td className="border border-black px-2 py-1 text-right">{gstAmt.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                    </tr>
                    <tr className="bg-gray-100">
                       <td colSpan="3" className="border border-black px-2 py-1 text-right font-bold text-sm">Grand Total</td>
                       <td className="border border-black px-2 py-1 text-right"></td>
                       <td className="border border-black px-2 py-1 text-right font-bold text-sm">{grandTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                    </tr>
                 </tbody>
              </table>

              {/* TERMS */}
              <div className="mb-6">
                 <p className="font-bold underline mb-1 text-xs">Terms & Conditions:</p>
                 <ol className="list-decimal pl-4 text-xs space-y-0.5 opacity-90">
                    {formData.terms.map((term, i) => <li key={i}>{term}</li>)}
                 </ol>
              </div>

              {/* BANK DETAILS */}
              {formData.showBankDetails && (
                 <div className="mb-6 border border-black p-2 text-xs w-2/3">
                    <p className="font-bold underline mb-1">Bank Details:</p>
                    <p>Bank: {formData.bankName}</p>
                    <p>Acc No: {formData.accNo}</p>
                    <p>IFSC: {formData.ifsc}</p>
                 </div>
              )}

              {/* FOOTER & SIGNATURE - INDUSTRIAL STANDARD */}
              <div className="mt-10">
                 <p className="font-bold text-sm mb-6">Thanks & Regards</p>
                 
                 <div className="flex flex-col items-start gap-4">
                    {/* Company Name */}
                    <p className="font-bold uppercase text-sm">For {formData.companyName}</p>

                    {/* Signature Placement */}
                    <div className="h-16 flex items-end">
                        {signature ? (
                           <img src={signature} alt="Sig" className="h-14 object-contain" />
                        ) : (
                           <div className="w-48 h-10 border-b border-dashed border-gray-400"></div> // Placeholder line
                        )}
                    </div>

                    {/* Signatory Text */}
                    <p className="text-xs font-bold">(Authorised Signatory)</p>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationBuilder;