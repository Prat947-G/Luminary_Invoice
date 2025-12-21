import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
   AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
   ArrowLeft, TrendingUp, DollarSign, Truck, FileText,
   Plus, Trash2, Edit2, Filter, Download, Briefcase, Search, X
} from 'lucide-react';

// --- MOCK DATA GENERATOR ---
const generateInitialData = () => {
   const clients = ['hatsun', 'jk-cake', 'global', 'jvs'];
   const data = {};

   // Helper to create random realistic data
   clients.forEach(client => {
      data[client] = [
         { id: Date.now() + Math.random(), client, date: '2025-10-01', type: 'INVOICE', desc: 'Supply: Firewood (Industrial)', vehicle: 'MH12FZ9334', weight: 15000, debit: 70500, credit: 0 },
         { id: Date.now() + Math.random(), client, date: '2025-10-05', type: 'PAYMENT', desc: 'NEFT Transfer', vehicle: '-', weight: 0, debit: 0, credit: 25000 },
         { id: Date.now() + Math.random(), client, date: '2025-10-12', type: 'INVOICE', desc: 'Supply: Biomass Briquettes', vehicle: 'MH14GD9784', weight: 10000, debit: 48000, credit: 0 },
         { id: Date.now() + Math.random(), client, date: '2025-10-20', type: 'PAYMENT', desc: 'Cheque Cleared', vehicle: '-', weight: 0, debit: 0, credit: 50000 },
      ];
   });
   return data;
};

export default function LedgerDashboard({ onExit }) {
   const { clientId } = useParams();
   const [selectedClient, setSelectedClient] = useState(clientId || 'Overview');
   const [ledgers, setLedgers] = useState(generateInitialData());
   const [modal, setModal] = useState({ show: false, mode: 'ADD', data: null });
   const [searchTerm, setSearchTerm] = useState('');

   // Handle URL param changes
   useEffect(() => {
      if (clientId) setSelectedClient(clientId);
   }, [clientId]);

   // --- DERIVED STATE (THE BRAIN) ---
   const allClients = Object.keys(ledgers);

   // 1. Get Transactions based on selection
   const rawTransactions = useMemo(() => {
      if (selectedClient === 'Overview') {
         // Flatten all arrays into one "Common Ledger"
         return Object.values(ledgers).flat().sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      return ledgers[selectedClient] || [];
   }, [selectedClient, ledgers]);

   // 2. Filter by Search
   const transactions = useMemo(() => {
      return rawTransactions.filter(t =>
         t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
      );
   }, [rawTransactions, searchTerm]);

   // 3. Calculate Totals
   const totals = useMemo(() => {
      return transactions.reduce((acc, t) => ({
         debit: acc.debit + t.debit,
         credit: acc.credit + t.credit,
         weight: acc.weight + t.weight,
         balance: (acc.debit + t.debit) - (acc.credit + t.credit)
      }), { debit: 0, credit: 0, weight: 0, balance: 0 });
   }, [transactions]);

   // 4. Prepare Chart Data
   const chartData = useMemo(() => {
      // Group by Date for cleaner charts
      const grouped = {};
      transactions.forEach(t => {
         if (!grouped[t.date]) grouped[t.date] = { date: t.date, Supply: 0, Payment: 0, Volume: 0 };
         grouped[t.date].Supply += t.debit;
         grouped[t.date].Payment += t.credit;
         grouped[t.date].Volume += t.weight / 1000;
      });
      return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
   }, [transactions]);

   // --- ACTIONS ---

   const handleSave = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const formClient = modal.mode === 'ADD' ? (selectedClient === 'Overview' ? fd.get('client') : selectedClient) : modal.data.client;

      const newTx = {
         id: modal.mode === 'EDIT' ? modal.data.id : Date.now(),
         client: formClient,
         date: fd.get('date'),
         type: fd.get('type'),
         desc: fd.get('desc'),
         vehicle: fd.get('vehicle') || '-',
         weight: Number(fd.get('weight')),
         debit: fd.get('type') === 'INVOICE' ? Number(fd.get('amount')) : 0,
         credit: fd.get('type') === 'PAYMENT' ? Number(fd.get('amount')) : 0,
      };

      setLedgers(prev => {
         const clientTx = prev[formClient] || [];
         let updatedClientTx;

         if (modal.mode === 'ADD') {
            updatedClientTx = [...clientTx, newTx];
         } else {
            updatedClientTx = clientTx.map(t => t.id === newTx.id ? newTx : t);
         }

         return { ...prev, [formClient]: updatedClientTx };
      });

      setModal({ show: false, mode: 'ADD', data: null });
   };

   const handleDelete = (id, client) => {
      if (!window.confirm("Delete this transaction?")) return;
      setLedgers(prev => ({
         ...prev,
         [client]: prev[client].filter(t => t.id !== id)
      }));
   };

   const handleEdit = (tx) => {
      setModal({ show: true, mode: 'EDIT', data: tx });
   };

   const handleExport = () => {
      const headers = ["Date,Client,Type,Description,Vehicle,Weight(KG),Debit,Credit\n"];
      const rows = transactions.map(t =>
         `${t.date},${t.client},${t.type},"${t.desc}",${t.vehicle},${t.weight},${t.debit},${t.credit}`
      );
      const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedClient}_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
   };

   return (
      <div className="fixed inset-0 z-50 flex h-screen bg-[#F1F5F9] font-sans">

         {/* SIDEBAR */}
         <div className="w-64 bg-[#0F172A] text-gray-300 flex flex-col shadow-2xl z-20">
            <div className="p-6 border-b border-gray-800">
               <h2 className="font-bold text-xl flex items-center gap-2 text-blue-400">
                  <Briefcase size={24} /> Ledger          </h2>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
               {/* Common Ledger Option */}
               <button
                  onClick={() => setSelectedClient('Overview')}
                  className={`w-full text-left px-6 py-4 text-sm font-bold flex items-center gap-3 transition-all border-l-4 ${selectedClient === 'Overview' ? 'bg-blue-600/20 border-blue-500 text-white' : 'border-transparent hover:bg-white/5'}`}
               >
                  <TrendingUp size={16} /> Common Ledger
               </button>

               <p className="px-6 mt-6 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Individual Companies</p>
               {allClients.map(client => (
                  <button
                     key={client}
                     onClick={() => setSelectedClient(client)}
                     className={`w-full text-left px-6 py-3 text-sm font-medium transition-all border-l-4 ${selectedClient === client ? 'bg-white/10 border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                     {client}
                  </button>
               ))}
            </div>

            <div className="p-4 border-t border-gray-800">
               <button onClick={onExit} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition w-full p-3 rounded-lg hover:bg-gray-800 border border-transparent hover:border-gray-700">
                  <ArrowLeft size={16} /> Return Home
               </button>
            </div>
         </div>

         {/* MAIN CONTENT */}
         <div className="flex-1 flex flex-col h-full overflow-hidden relative">

            {/* HEADER */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
               <div>
                  <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                     {selectedClient === 'Overview' ? 'Master Ledger' : selectedClient}
                     {selectedClient === 'Overview' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">All Clients</span>}
                  </h1>
               </div>

               <div className="flex items-center gap-3">
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search entries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-500 w-64"
                     />
                  </div>
                  <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                     <Download size={14} /> Export
                  </button>
                  <button onClick={() => setModal({ show: true, mode: 'ADD', data: null })} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition transform active:scale-95">
                     <Plus size={14} /> Add Entry
                  </button>
               </div>
            </header>

            {/* DASHBOARD SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

               {/* 1. KPI CARDS */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Net Balance</p>
                           <h3 className={`text-2xl font-bold mt-1 ${totals.balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                              ₹ {totals.balance.toLocaleString()}
                           </h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><DollarSign size={20} /></div>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Sales (Debit)</p>
                     <h3 className="text-2xl font-bold mt-1 text-gray-800">₹ {totals.debit.toLocaleString()}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Received (Credit)</p>
                     <h3 className="text-2xl font-bold mt-1 text-emerald-600">₹ {totals.credit.toLocaleString()}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Volume</p>
                     <h3 className="text-2xl font-bold mt-1 text-purple-600">{(totals.weight / 1000).toFixed(1)} Tons</h3>
                  </div>
               </div>

               {/* 2. CHARTS */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-80">
                  {/* Financial Chart */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                     <h4 className="text-sm font-bold text-gray-700 mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500" /> Financial Overview
                     </h4>
                     <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={chartData}>
                              <defs>
                                 <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
                              <Area type="monotone" dataKey="Supply" stroke="#3B82F6" strokeWidth={3} fill="url(#colorSupply)" />
                              <Area type="monotone" dataKey="Payment" stroke="#10B981" strokeWidth={3} fill="transparent" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Volume Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                     <h4 className="text-sm font-bold text-gray-700 mb-6 flex items-center gap-2">
                        <Truck size={16} className="text-purple-500" /> Volume Trend (Tons)
                     </h4>
                     <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                              <Bar dataKey="Volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>

               {/* 3. LIVE LEDGER TABLE */}
               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                     <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2"><FileText size={16} /> Transaction Log</h4>
                     <div className="flex gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Debit</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Credit</span>
                     </div>
                  </div>

                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                        <tr>
                           <th className="px-6 py-4">Date</th>
                           {selectedClient === 'Overview' && <th className="px-6 py-4">Client</th>}
                           <th className="px-6 py-4">Description</th>
                           <th className="px-6 py-4">Vehicle</th>
                           <th className="px-6 py-4 text-right">Debit</th>
                           <th className="px-6 py-4 text-right">Credit</th>
                           <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {transactions.map((t) => (
                           <tr key={t.id} className="hover:bg-blue-50/30 transition group">
                              <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{t.date}</td>
                              {selectedClient === 'Overview' && (
                                 <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">{t.client}</span>
                                 </td>
                              )}
                              <td className="px-6 py-4 font-medium text-gray-800">
                                 {t.desc}
                                 {t.weight > 0 && <span className="ml-2 px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] rounded-full font-bold">{t.weight} KG</span>}
                              </td>
                              <td className="px-6 py-4 text-gray-400 text-xs font-mono">{t.vehicle}</td>
                              <td className="px-6 py-4 text-right font-mono text-gray-800">{t.debit > 0 ? `₹${t.debit.toLocaleString()}` : '-'}</td>
                              <td className="px-6 py-4 text-right font-mono text-emerald-600 font-bold">{t.credit > 0 ? `₹${t.credit.toLocaleString()}` : '-'}</td>
                              <td className="px-6 py-4 flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition">
                                 <button onClick={() => handleEdit(t)} className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600"><Edit2 size={14} /></button>
                                 <button onClick={() => handleDelete(t.id, t.client)} className="p-1.5 rounded-md hover:bg-red-100 text-red-600"><Trash2 size={14} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {transactions.length === 0 && (
                     <div className="p-12 text-center text-gray-400 text-sm">No transactions found.</div>
                  )}
               </div>
            </div>
         </div>

         {/* EDIT/ADD MODAL */}
         {modal.show && (
            <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <h3 className="font-bold text-gray-800 text-lg">{modal.mode === 'ADD' ? 'New Transaction' : 'Edit Transaction'}</h3>
                     <button onClick={() => setModal({ show: false, mode: 'ADD', data: null })} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={18} /></button>
                  </div>

                  <form onSubmit={handleSave} className="p-6 space-y-5">
                     {/* Client Selector (Only show if in Overview mode and Adding) */}
                     {modal.mode === 'ADD' && selectedClient === 'Overview' && (
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Select Client</label>
                           <select name="client" className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                              {allClients.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                     )}

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Date</label>
                           <input required type="date" name="date" defaultValue={modal.data?.date} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Type</label>
                           <select name="type" defaultValue={modal.data?.type || 'INVOICE'} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                              <option value="INVOICE">Supply (Bill)</option>
                              <option value="PAYMENT">Payment (Rec)</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Description</label>
                        <input required name="desc" defaultValue={modal.data?.desc} placeholder="e.g. Supply 15 Tons Firewood" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Amount (₹)</label>
                           <input required type="number" name="amount" defaultValue={modal.data ? (modal.data.debit || modal.data.credit) : ''} placeholder="0.00" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Weight (KG)</label>
                           <input type="number" name="weight" defaultValue={modal.data?.weight} placeholder="0" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Vehicle No (Optional)</label>
                        <input name="vehicle" defaultValue={modal.data?.vehicle} placeholder="MH-12-XX-0000" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>

                     <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition transform active:scale-95 mt-2">
                        {modal.mode === 'ADD' ? 'Add Transaction' : 'Save Changes'}
                     </button>
                  </form>
               </div>
            </div>
         )}

         <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
      </div>
   );
}