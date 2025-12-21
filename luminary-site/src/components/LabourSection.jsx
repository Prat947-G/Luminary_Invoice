// src/components/LabourSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, FileText, FileSpreadsheet, ChevronRight, HardHat } from 'lucide-react';
import { COMPANIES } from '../data/networkData';
import toast from 'react-hot-toast';

// 1. COMPANY CARD COMPONENT (Earth Tone Aesthetic)
const CompanyCard = ({ company, onInvoice, onEmail }) => (
  <div className="group relative bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
    
    {/* Decorative Header Background */}
    <div className="h-32 bg-[#2d3a28] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-white/10 transition-colors duration-500">
           <company.icon size={150} />
        </div>
    </div>

    {/* Content */}
    <div className="p-8 pt-12 relative flex flex-col flex-grow">
       {/* Icon Badge */}
       <div className="absolute -top-10 left-8 w-20 h-20 bg-[#e8e6d9] rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-[#2d3a28]">
          <company.icon size={32} />
       </div>

       <h3 className="text-xl font-serif font-bold text-[#2d3a28] mb-2 leading-tight">{company.name}</h3>
       <p className="text-xs font-bold uppercase tracking-widest text-[#8c7e68] mb-4">{company.type}</p>
       
       {/* Details Area - Fixed Height for alignment */}
       <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6 h-32 overflow-y-auto custom-scrollbar grow-0">
          <p className="text-[10px] text-stone-600 leading-relaxed font-medium whitespace-pre-line">
             {company.details}
          </p>
       </div>

       {/* Spacer to push buttons to bottom */}
       <div className="mt-auto">
         <div className="grid grid-cols-2 gap-3">
            <button 
               onClick={() => onEmail(company)}
               className="flex items-center justify-center gap-2 py-3 rounded-lg border border-[#2d3a28] text-[#2d3a28] font-bold text-xs uppercase hover:bg-[#2d3a28] hover:text-white transition-colors"
            >
               <Mail size={14} /> Email
            </button>
            <button 
               onClick={() => onInvoice(company)}
               className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#996f4e] text-white font-bold text-xs uppercase hover:bg-[#855e3f] transition-colors shadow-md"
            >
               <FileText size={14} /> Bill
            </button>
         </div>
       </div>
    </div>
  </div>
);

// 2. MAIN PAGE COMPONENT
const LabourSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Filter only Labour companies
  const labourCompanies = COMPANIES.filter(c => c.category === 'labour');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- SMART ROUTING HANDLER ---
  const handleInvoice = (company) => {
    // Check specific IDs to route to specialized templates
    if (company.id === 'lv-foods') {
       navigate('/invoice/lv-foods');
    } else if (company.id === 'srikar') {
       navigate('/invoice/srikar');
    } else if (company.id === 'rutam') {
       navigate('/invoice/rutam');
    } else {
       // Fallback for generic labour clients
       navigate('/invoice', { state: { clientData: company } });
    }
  };

  const handleEmail = (company) => {
    const subject = `Invoice / Quotation for ${company.name}`;
    const body = `Dear Accounts Team,\n\nPlease find attached the labour supply invoice for the current month.\n\nRegards,\nNageshwar Enterprises`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success(`Opening mail for ${company.shortName || company.name}`);
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] text-[#2d3a28] font-sans pb-24">
       
       {/* --- HERO SECTION (Green Nature Theme) --- */}
       <div className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden bg-[#2d3a28] text-[#e8e6d9]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
             <button onClick={() => navigate('/network')} className="flex items-center gap-2 text-[#996f4e] hover:text-white transition-colors mb-6 text-xs font-bold uppercase tracking-widest">
               <ArrowLeft size={16}/> Return to Network
             </button>
             <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-[#996f4e] rounded text-white"><HardHat size={20}/></span>
                <span className="text-[#996f4e] font-bold tracking-[0.2em] uppercase text-xs">Contractor Hub</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-serif mb-6 text-white leading-tight">Labour Workforce</h1>
             <p className="max-w-2xl text-lg font-light text-[#dcdacb] leading-relaxed">
                Manage contracts for LV Foods, Srikar Materials, and Rutam Engineering. Access specialized billing structures and communication channels.
             </p>
          </div>
       </div>

       {/* --- COMPANY CARDS SECTION --- */}
       <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {loading ? (
                [1,2,3].map(i => (
                  <div key={i} className="h-[500px] bg-white rounded-3xl animate-pulse shadow-sm" />
                ))
             ) : (
                labourCompanies.map((company) => (
                   <CompanyCard 
                      key={company.id} 
                      company={company} 
                      onInvoice={handleInvoice}
                      onEmail={handleEmail}
                   />
                ))
             )}
          </div>
       </div>

       {/* --- GLOBAL TOOLS SECTION --- */}
       <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-24">
          <div className="flex items-center gap-4 mb-10">
             <div className="h-px bg-[#2d3a28]/20 flex-1"></div>
             <span className="text-xs font-bold uppercase tracking-widest text-[#996f4e]">General Labour Functions</span>
             <div className="h-px bg-[#2d3a28]/20 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* 1. Labour Quotation Generator */}
             <button 
                onClick={() => navigate('/quotation')}
                className="group flex items-center justify-between p-10 bg-white rounded-3xl border border-stone-200 hover:border-[#996f4e] hover:shadow-2xl transition-all duration-300"
             >
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-[#F2F0E9] rounded-2xl flex items-center justify-center text-[#2d3a28] group-hover:scale-110 transition-transform">
                      <FileSpreadsheet size={32} strokeWidth={1.5}/>
                   </div>
                   <div className="text-left">
                      <h3 className="text-xl font-bold text-[#2d3a28] font-serif">Labour Quotation Generator</h3>
                      <p className="text-xs text-stone-500 mt-2 font-medium tracking-wide">Create estimates for new manpower contracts.</p>
                   </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-[#996f4e] group-hover:text-white group-hover:border-[#996f4e] transition-all">
                   <ChevronRight size={24}/>
                </div>
             </button>

             {/* 2. Labour Invoice Generator (Generic) */}
             <button 
                onClick={() => navigate('/invoice')}
                className="group flex items-center justify-between p-10 bg-white rounded-3xl border border-stone-200 hover:border-[#2d3a28] hover:shadow-2xl transition-all duration-300"
             >
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center text-[#2d3a28] group-hover:scale-110 transition-transform">
                      <FileText size={32} strokeWidth={1.5}/>
                   </div>
                   <div className="text-left">
                      <h3 className="text-xl font-bold text-[#2d3a28] font-serif">Labour Invoice Generator</h3>
                      <p className="text-xs text-stone-500 mt-2 font-medium tracking-wide">Standard billing for ad-hoc labour supply.</p>
                   </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-[#2d3a28] group-hover:text-white group-hover:border-[#2d3a28] transition-all">
                   <ChevronRight size={24}/>
                </div>
             </button>
          </div>
       </div>
    </div>
  );
};

export default LabourSection;