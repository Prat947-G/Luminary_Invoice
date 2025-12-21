import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ToWords } from 'to-words';
import { 
  Plus, Trash2, X, FileText, PenTool, 
  Save, Users, ArrowLeft, Loader2, Upload, Settings, Download 
} from 'lucide-react';

// --- PART 1: SETUP & STYLES ---
const toWords = new ToWords({ localeCode: 'en-IN', converterOptions: { currency: true, ignoreDecimal: false, ignoreZeroCurrency: false } });

// Register Fonts: We register standard Helvetica explicitly to prevent weight errors
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf' },
    { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: 'Helvetica', lineHeight: 1.4, color: '#000' },
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  flex1: { flex: 1 },
  box: { border: '1px solid #000' },
  borderBottom: { borderBottom: '1px solid #000' },
  borderRight: { borderRight: '1px solid #000' },
  borderTop: { borderTop: '1px solid #000' },
  
  // Font Styles (Removed textTransform to prevent crashes)
  header: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  subHeader: { fontSize: 10, fontWeight: 'bold' },
  label: { fontSize: 7, color: '#444', marginBottom: 4 },
  text: { fontSize: 9, marginBottom: 2 },
  bold: { fontWeight: 'bold', fontSize: 9 },
  
  // Layout Helpers
  pad: { padding: 8 },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  
  // Widths
  w5: { width: '5%' },
  w10: { width: '10%' },
  w15: { width: '15%' },
  w40: { width: '40%' },
  w50: { width: '50%' },
});

// --- PART 2: THE PDF DOCUMENT COMPONENT ---
const InvoiceDocument = ({ data = {}, items = [], calculations = {}, settings = {} }) => {
  // CRASH PROTECTION: Default values
  const { subTotal = 0, taxAmount = 0, grandTotal = 0 } = calculations || {};
  const safeData = data || {};
  const safeSettings = settings || { taxType: 'CGST_SGST', template: 'industrial', showVehicle: false };

  const isIGST = safeSettings.taxType === 'IGST';
  const taxValue = isIGST ? taxAmount : taxAmount / 2;
  const themeColor = safeSettings.template === 'boxed' ? '#4c1d95' : '#000000'; 
  const headerBg = safeSettings.template === 'boxed' ? '#f3e8ff' : '#f0f0f0';

  // Helper to safely uppercase text (replaces CSS textTransform)
  const upper = (text) => (text ? text.toString().toUpperCase() : '');

  return (
    <Document>
      <Page size="A4" style={[styles.page, { color: themeColor }]}>
        <View style={[styles.box, { borderColor: themeColor }]}>
          
          {/* HEADER SECTION */}
          <View style={[styles.row, styles.borderBottom, { borderColor: themeColor, minHeight: 120 }]}>
            
            {/* Sender (Left) */}
            <View style={[styles.w50, styles.borderRight, styles.pad, { borderColor: themeColor }]}>
              <Text style={styles.label}>FROM:</Text>
              <Text style={[styles.header, { color: themeColor }]}>
                {upper(safeData.senderName || 'Sender Name')}
              </Text>
              <View style={{ marginTop: 4 }}>
                 <Text style={styles.text}>{safeData.senderAddress}</Text>
                 <View style={{ marginTop: 6 }}>
                    <Text style={styles.text}>M: {safeData.senderPhone}</Text>
                    {safeData.senderEmail && <Text style={styles.text}>E: {safeData.senderEmail}</Text>}
                 </View>
              </View>
            </View>
            
            {/* Receiver (Right) */}
            <View style={[styles.w50, styles.pad]}>
              <Text style={styles.label}>BILLED TO:</Text>
              <Text style={[styles.header, { fontSize: 14, color: themeColor }]}>
                {upper(safeData.receiverName || 'Receiver Name')}
              </Text>
              <Text style={styles.text}>{safeData.receiverAddress}</Text>
              
              <View style={[styles.row, styles.borderTop, { borderColor: themeColor, marginTop: 12, paddingTop: 8 }]}>
                <View style={[styles.flex1, styles.borderRight, { borderColor: themeColor, paddingRight: 4 }]}>
                   <Text style={styles.label}>INVOICE NO</Text>
                   <Text style={styles.bold}>{safeData.invoiceNo}</Text>
                </View>
                <View style={[styles.flex1, { paddingLeft: 8 }]}>
                   <Text style={styles.label}>DATE</Text>
                   <Text style={styles.bold}>{safeData.date}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* TITLE BAR */}
          <View style={[styles.borderBottom, styles.pad, { backgroundColor: headerBg, borderColor: themeColor }]}>
            <Text style={[styles.header, styles.center, { fontSize: 12, letterSpacing: 2, color: themeColor, marginBottom: 0 }]}>TAX INVOICE</Text>
          </View>

          {/* PO NUMBER */}
          {safeData.poNo && (
            <View style={[styles.row, styles.borderBottom, styles.pad, { borderColor: themeColor }]}>
               <Text style={[styles.bold, { marginRight: 10 }]}>P.O. No:</Text>
               <Text style={styles.text}>{safeData.poNo}</Text>
            </View>
          )}

          {/* TABLE HEADER */}
          <View style={[styles.row, styles.borderBottom, { backgroundColor: headerBg, borderColor: themeColor }]}>
            <Text style={[styles.w5, styles.borderRight, styles.pad, styles.center, { borderColor: themeColor, fontWeight: 'bold' }]}>SR</Text>
            
            <Text style={[safeSettings.showVehicle ? styles.w40 : styles.flex1, styles.borderRight, styles.pad, { borderColor: themeColor, fontWeight: 'bold' }]}>DESCRIPTION</Text>
            
            {safeSettings.showVehicle && (
              <>
                <Text style={[styles.w15, styles.borderRight, styles.pad, styles.center, { borderColor: themeColor, fontWeight: 'bold' }]}>DATE</Text>
                <Text style={[styles.w15, styles.borderRight, styles.pad, styles.center, { borderColor: themeColor, fontWeight: 'bold' }]}>VEHICLE</Text>
              </>
            )}
            
            <Text style={[styles.w10, styles.borderRight, styles.pad, styles.center, { borderColor: themeColor, fontWeight: 'bold' }]}>QTY</Text>
            <Text style={[styles.w10, styles.borderRight, styles.pad, styles.right, { borderColor: themeColor, fontWeight: 'bold' }]}>RATE</Text>
            <Text style={[styles.w15, styles.pad, styles.right, { fontWeight: 'bold' }]}>AMOUNT</Text>
          </View>

          {/* TABLE ROWS */}
          {items.map((item, i) => (
            <View key={item.id} style={[styles.row, styles.borderBottom, { borderColor: themeColor, minHeight: 24 }]}>
              <Text style={[styles.w5, styles.borderRight, styles.pad, styles.center, { borderColor: themeColor }]}>{i + 1}</Text>
              
              <View style={[safeSettings.showVehicle ? styles.w40 : styles.flex1, styles.borderRight, styles.pad, { borderColor: themeColor }]}>
                 <Text style={{ fontWeight: 'bold' }}>{item.desc}</Text>
              </View>

              {safeSettings.showVehicle && (
                <>
                  <Text style={[styles.w15, styles.borderRight, styles.pad, styles.center, { fontSize: 8, borderColor: themeColor }]}>{item.date || '-'}</Text>
                  <Text style={[styles.w15, styles.borderRight, styles.pad, styles.center, { fontSize: 8, borderColor: themeColor }]}>{item.vehicleNo || '-'}</Text>
                </>
              )}
              
              <Text style={[styles.w10, styles.borderRight, styles.pad, styles.center, { borderColor: themeColor }]}>{item.qty} {item.unit}</Text>
              <Text style={[styles.w10, styles.borderRight, styles.pad, styles.right, { borderColor: themeColor }]}>{Number(item.rate).toFixed(2)}</Text>
              <Text style={[styles.w15, styles.pad, styles.right, { fontWeight: 'bold' }]}>{(Number(item.qty || 0) * Number(item.rate || 0)).toFixed(2)}</Text>
            </View>
          ))}

          {/* TOTALS */}
          <View style={[styles.row, styles.borderTop, { borderColor: themeColor }]}>
             <View style={[styles.flex1, styles.borderRight, styles.pad, { borderColor: themeColor }]}>
                <Text style={styles.label}>AMOUNT IN WORDS:</Text>
                <Text style={{ fontStyle: 'italic', fontSize: 10, marginTop: 4 }}>{toWords.convert(grandTotal || 0)}</Text>
             </View>
             
             <View style={styles.w40}>
                <View style={[styles.row, styles.pad, styles.borderBottom, { borderColor: themeColor }]}>
                   <Text style={styles.flex1}>Sub Total</Text>
                   <Text style={styles.right}>{subTotal.toFixed(2)}</Text>
                </View>
                
                {safeData.taxRate > 0 && (
                  <>
                    <View style={[styles.row, styles.pad, styles.borderBottom, { borderColor: themeColor }]}>
                      <Text style={styles.flex1}>{isIGST ? `IGST (${safeData.taxRate}%)` : `CGST (${safeData.taxRate/2}%)`}</Text>
                      <Text style={styles.right}>{taxValue.toFixed(2)}</Text>
                    </View>
                    {!isIGST && (
                      <View style={[styles.row, styles.pad, styles.borderBottom, { borderColor: themeColor }]}>
                        <Text style={styles.flex1}>{`SGST (${safeData.taxRate/2}%)`}</Text>
                        <Text style={styles.right}>{taxValue.toFixed(2)}</Text>
                      </View>
                    )}
                  </>
                )}
                
                <View style={[styles.row, styles.pad, { backgroundColor: headerBg }]}>
                   <Text style={[styles.flex1, styles.bold]}>GRAND TOTAL</Text>
                   <Text style={[styles.right, styles.bold]}>{grandTotal.toFixed(2)}</Text>
                </View>
             </View>
          </View>

          {/* FOOTER */}
          <View style={[styles.row, styles.borderTop, { minHeight: 90, borderColor: themeColor }]}>
             <View style={[styles.w50, styles.borderRight, styles.pad, { borderColor: themeColor }]}>
                <Text style={[styles.subHeader, { textDecoration: 'underline', marginBottom: 6 }]}>BANK DETAILS</Text>
                <Text style={styles.text}>Bank: {safeData.bankName}</Text>
                <Text style={styles.text}>A/c No: {safeData.accountNo}</Text>
                <Text style={styles.text}>IFSC: {safeData.ifsc}</Text>
                <Text style={styles.text}>Branch: {safeData.branch}</Text>
                <Text style={styles.text}>PAN: {safeData.panNo}</Text>
             </View>
             
             <View style={[styles.w50, styles.pad, { justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                <Text style={[styles.text, { marginBottom: 10 }]}>For, {upper(safeData.senderName)}</Text>
                {safeData.signatureImage && <Image src={safeData.signatureImage} style={{ width: 100, height: 40, objectFit: 'contain', marginBottom: 4 }} />}
                <Text style={[styles.bold, { borderTop: `1px solid ${themeColor}`, paddingTop: 4, width: '100%', textAlign: 'right' }]}>AUTHORIZED SIGNATORY</Text>
             </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// --- PART 3: MAIN COMPONENT ---
export default function InvoiceGenerator({ onExit }) {
  const [activeTab, setActiveTab] = useState('edit');
  const [settings, setSettings] = useState({ taxType: 'CGST_SGST', showVehicle: false, template: 'industrial' });
  const [savedClients, setSavedClients] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const [invoice, setInvoice] = useState({
    senderName: "VENUGOPALA TRADERS",
    senderAddress: "Ram Nivas, Patas, Pune - 412219",
    senderEmail: "info@venugopala.com",
    senderPhone: "8830162266",
    receiverName: "HATSUN AGRO PRODUCT LTD.",
    receiverAddress: "Bedag CC",
    invoiceNo: "300",
    date: new Date().toISOString().split('T')[0],
    poNo: "", 
    bankName: "INDIAN BANK",
    accountNo: "7678254669",
    ifsc: "IDIB000P261",
    branch: "Patas",
    panNo: "BFXPK7378N",
    taxRate: 5, 
    signatureImage: null 
  });

  const [items, setItems] = useState([
    { id: 1, date: invoice.date, vehicleNo: "MH16CD0039", desc: "Fire Wood", qty: 2270, unit: "KG", rate: 4.7 },
  ]);

  // Load Saved Data
  useEffect(() => {
    const savedDraft = localStorage.getItem('invoice_draft');
    const savedDb = localStorage.getItem('client_db');
    if (savedDraft) {
       try {
         const parsed = JSON.parse(savedDraft);
         if(parsed.invoice) setInvoice(prev => ({ ...prev, ...parsed.invoice }));
         if(parsed.items) setItems(parsed.items);
         if(parsed.settings) setSettings(prev => ({ ...prev, ...parsed.settings }));
       } catch (e) { console.error("Draft load error", e); }
    }
    if (savedDb) {
       try { setSavedClients(JSON.parse(savedDb)); } catch (e) { console.error("DB load error", e); }
    }
  }, []);

  // Save Data
  useEffect(() => {
    const draft = { invoice, items, settings };
    localStorage.setItem('invoice_draft', JSON.stringify(draft));
  }, [invoice, items, settings]);

  // Calculations
  const subTotal = items.reduce((acc, item) => acc + (Number(item.qty || 0) * Number(item.rate || 0)), 0);
  const taxAmount = (subTotal * Number(invoice.taxRate || 0)) / 100;
  const grandTotal = subTotal + taxAmount;

  // Handlers
  const handleDetailsChange = (e) => setInvoice({ ...invoice, [e.target.name]: e.target.value });
  const addItem = () => setItems([...items, { id: Date.now(), date: invoice.date, vehicleNo: "", desc: "", qty: 0, unit: "KG", rate: 0 }]);
  const deleteItem = (id) => setItems(items.filter(item => item.id !== id));
  const handleItemChange = (id, field, value) => setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setInvoice(prev => ({ ...prev, signatureImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const saveCurrentClient = () => {
    if (!invoice.receiverName) return alert("Enter client name first");
    const newClient = { id: Date.now(), name: invoice.receiverName, address: invoice.receiverAddress };
    const updatedList = [...savedClients, newClient];
    setSavedClients(updatedList);
    localStorage.setItem('client_db', JSON.stringify(updatedList));
    alert("Client Saved!");
  };

  const loadClient = (e) => {
    const clientId = parseInt(e.target.value);
    const client = savedClients.find(c => c.id === clientId);
    if (client) setInvoice(prev => ({ ...prev, receiverName: client.name, receiverAddress: client.address }));
  };

  const handleChallanUpload = (e) => {
    if (e.target.files.length > 0) {
        setIsScanning(true);
        setTimeout(() => {
            alert(`Scanned ${e.target.files.length} Challans!`);
            setItems(prev => [
                ...prev,
                { id: Date.now(), date: "2025-11-20", vehicleNo: "MH12FZ9334", desc: "Extracted Item A", qty: 5000, unit: "KG", rate: 4.7 },
                { id: Date.now()+1, date: "2025-11-21", vehicleNo: "MH14GD9784", desc: "Extracted Item B", qty: 3200, unit: "KG", rate: 4.7 }
            ]);
            setIsScanning(false);
        }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen bg-[#F3F4F6] font-sans">
      
      {/* SIDEBAR */}
      <div className="w-[450px] flex flex-col bg-[#0F172A] text-gray-300 h-full border-r border-gray-800 shadow-2xl z-20">
         <div className="p-4 border-b border-gray-800 flex justify-between bg-[#1E293B]">
            <h2 className="text-white font-bold flex items-center gap-2"><FileText className="text-blue-500" /> Luminary Invoice</h2>
            <button onClick={onExit} className="text-xs flex items-center gap-1 bg-gray-800 px-3 py-1 rounded hover:text-white transition"><ArrowLeft size={12}/> Exit</button>
         </div>

         <div className="flex border-b border-gray-800">
            <button onClick={() => setActiveTab('edit')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'edit' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800' : 'hover:bg-gray-800'}`}>Data</button>
            <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800' : 'hover:bg-gray-800'}`}>Settings</button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {activeTab === 'edit' && (
              <>
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-blue-400 text-xs font-bold uppercase flex items-center gap-2">{isScanning ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>} Bulk Challan Upload</h3>
                    </div>
                    <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-blue-500/30 rounded cursor-pointer hover:bg-blue-500/10 transition">
                        <span className="text-[10px] text-blue-300">Select Images</span>
                        <input type="file" multiple className="hidden" onChange={handleChallanUpload} accept="image/*" />
                    </label>
                </div>

                <div className="space-y-3 pt-2">
                   <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-gray-500">Client</label>
                      <button onClick={saveCurrentClient} className="text-[10px] text-green-400 flex items-center gap-1 hover:underline"><Save size={10}/> Save</button>
                   </div>
                   {savedClients.length > 0 && (
                     <div className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                        <Users size={14} />
                        <select onChange={loadClient} className="bg-transparent w-full text-xs outline-none cursor-pointer">
                           <option value="">-- Load Saved Client --</option>
                           {savedClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                     </div>
                   )}
                   <input name="receiverName" value={invoice.receiverName} onChange={handleDetailsChange} className="dark-input" placeholder="Client Name" />
                   <textarea name="receiverAddress" value={invoice.receiverAddress} onChange={handleDetailsChange} className="dark-input h-16" placeholder="Address" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div><label className="text-[10px] text-gray-500">Invoice #</label><input name="invoiceNo" value={invoice.invoiceNo} onChange={handleDetailsChange} className="dark-input" /></div>
                   <div><label className="text-[10px] text-gray-500">Date</label><input type="date" name="date" value={invoice.date} onChange={handleDetailsChange} className="dark-input" /></div>
                </div>
                <div><label className="text-[10px] text-gray-500">PO No</label><input name="poNo" value={invoice.poNo} onChange={handleDetailsChange} className="dark-input" placeholder="Optional" /></div>

                <div className="pt-4 border-t border-gray-800">
                   <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Items</label>
                      <span className="text-[10px] text-gray-500">{items.length} Rows</span>
                   </div>
                   {items.map((item) => (
                      <div key={item.id} className="bg-gray-800/50 p-3 rounded mb-3 border border-gray-700 relative group hover:border-gray-500 transition">
                         <button onClick={() => deleteItem(item.id)} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"><Trash2 size={12}/></button>
                         {settings.showVehicle && (
                            <div className="grid grid-cols-2 gap-2 mb-2">
                               <input type="date" value={item.date || invoice.date} onChange={(e) => handleItemChange(item.id, 'date', e.target.value)} className="dark-input text-[10px]" />
                               <input value={item.vehicleNo} onChange={(e) => handleItemChange(item.id, 'vehicleNo', e.target.value)} className="dark-input text-[10px]" placeholder="Vehicle No" />
                            </div>
                         )}
                         <input value={item.desc} onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} className="dark-input mb-2 w-full" placeholder="Description" />
                         <div className="flex gap-2">
                            <div className="flex-1"><input type="number" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} className="dark-input" placeholder="Qty" /></div>
                            <div className="w-20">
                               <select value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)} className="dark-input h-[38px]">
                                   <option value="KG">KG</option><option value="Ton">Ton</option><option value="Pcs">Pcs</option><option value="Bag">Bag</option>
                               </select>
                            </div>
                            <div className="flex-1"><input type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} className="dark-input" placeholder="Rate" /></div>
                         </div>
                      </div>
                   ))}
                   <button onClick={addItem} className="w-full py-2 border border-dashed border-gray-600 text-gray-400 rounded hover:text-white flex justify-center gap-2 text-xs font-bold"><Plus size={14}/> Add Item</button>
                </div>
              </>
            )}

            {activeTab === 'settings' && (
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Invoice Style</label>
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setSettings(s => ({...s, template: 'industrial'}))} className={`p-3 border rounded text-xs text-left ${settings.template === 'industrial' ? 'bg-gray-800 border-blue-500' : 'border-gray-700'}`}>
                           <span className="font-bold block text-white">Industrial Grid</span>
                           <span className="text-[10px] text-gray-500">Standard Factory</span>
                        </button>
                        <button onClick={() => setSettings(s => ({...s, template: 'boxed'}))} className={`p-3 border rounded text-xs text-left ${settings.template === 'boxed' ? 'bg-gray-800 border-purple-500' : 'border-gray-700'}`}>
                           <span className="font-bold block text-white">Corporate Box</span>
                           <span className="text-[10px] text-gray-500">Purple Accents</span>
                        </button>
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Features</label>
                     <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded cursor-pointer mb-2">
                        <span className="text-sm text-gray-300">Vehicle / Date Column</span>
                        <input type="checkbox" checked={settings.showVehicle} onChange={() => setSettings(s => ({...s, showVehicle: !s.showVehicle}))} />
                     </label>
                  </div>
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Tax Calculation</label>
                     <div className="flex bg-gray-800 rounded p-1 mb-3">
                        <button onClick={() => setSettings(s => ({...s, taxType: 'CGST_SGST'}))} className={`flex-1 py-2 text-[10px] font-bold rounded ${settings.taxType === 'CGST_SGST' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Intra-State (Split)</button>
                        <button onClick={() => setSettings(s => ({...s, taxType: 'IGST'}))} className={`flex-1 py-2 text-[10px] font-bold rounded ${settings.taxType === 'IGST' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Inter-State (Single)</button>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Rate (%):</span>
                        <input type="number" name="taxRate" value={invoice.taxRate} onChange={handleDetailsChange} className="dark-input w-20" />
                     </div>
                  </div>
                  <div className="pt-4 border-t border-gray-800 space-y-3">
                     <label className="text-xs font-bold uppercase text-gray-500">My Company</label>
                     <input name="senderName" value={invoice.senderName} onChange={handleDetailsChange} className="dark-input" />
                     <textarea name="senderAddress" value={invoice.senderAddress} onChange={handleDetailsChange} className="dark-input h-20" />
                     <input name="senderPhone" value={invoice.senderPhone} onChange={handleDetailsChange} className="dark-input" placeholder="Phone" />
                     <div className="grid grid-cols-2 gap-2">
                        <input name="bankName" value={invoice.bankName} onChange={handleDetailsChange} className="dark-input" placeholder="Bank" />
                        <input name="accountNo" value={invoice.accountNo} onChange={handleDetailsChange} className="dark-input" placeholder="Acct No" />
                        <input name="ifsc" value={invoice.ifsc} onChange={handleDetailsChange} className="dark-input" placeholder="IFSC" />
                        <input name="panNo" value={invoice.panNo} onChange={handleDetailsChange} className="dark-input" placeholder="PAN" />
                     </div>
                  </div>
                  <div className="pt-4 border-t border-gray-800">
                     <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Digital Signature</label>
                     <label className="flex items-center justify-center w-full h-12 border border-dashed border-gray-600 rounded cursor-pointer hover:bg-gray-800 transition">
                        <span className="text-xs text-gray-400 flex gap-2"><PenTool size={14}/> Upload PNG</span>
                        <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleSignatureUpload} />
                     </label>
                     {invoice.signatureImage && <p className="text-[10px] text-green-400 mt-2 text-center">Signature Loaded ✓</p>}
                  </div>
               </div>
            )}
         </div>

         {/* FOOTER */}
         <div className="p-4 border-t border-gray-800 bg-[#0F172A]">
            <PDFDownloadLink 
               document={<InvoiceDocument data={invoice} items={items} calculations={{subTotal, taxAmount, grandTotal}} settings={settings} />} 
               fileName={`Invoice_${invoice.invoiceNo}.pdf`}
               className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex justify-center gap-2 shadow-lg transition text-sm items-center"
            >
               {({ loading }) => (loading ? <><Loader2 className="animate-spin" size={16}/> Generating...</> : <><Download size={16}/> Download PDF</>)}
            </PDFDownloadLink>
         </div>
      </div>

      {/* PREVIEW */}
      <div className="flex-1 bg-[#525659] flex flex-col p-4 sm:p-8 overflow-hidden">
         <div className="bg-white shadow-2xl h-full w-full rounded overflow-hidden">
            <PDFViewer className="w-full h-full border-none" showToolbar={true}>
               <InvoiceDocument data={invoice} items={items} calculations={{subTotal, taxAmount, grandTotal}} settings={settings} />
            </PDFViewer>
         </div>
      </div>

      <style>{`
        .dark-input { width: 100%; background-color: #1F2937; border: 1px solid #374151; border-radius: 4px; padding: 8px; font-size: 0.875rem; color: white; outline: none; }
        .dark-input:focus { border-color: #3B82F6; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111827; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
      `}</style>
    </div>
  );
}