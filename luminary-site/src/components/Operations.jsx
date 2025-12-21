// src/components/Operations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, ScrollText, FileSpreadsheet, ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';

const ToolCard = ({ title, subtitle, icon: Icon, onClick, colorClass, delay }) => (
  <button 
    onClick={onClick}
    className="group relative p-8 bg-white border border-stone-200 rounded-2xl text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Decorative Background Blob */}
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12 ${colorClass}`}></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 bg-white border border-stone-100 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${colorClass.replace('bg-', 'text-').replace('50', '600')}`}>
        <Icon size={28} strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">{title}</h3>
      <p className="text-sm text-stone-500 leading-relaxed mb-6 h-10 opacity-80">{subtitle}</p>
      
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 group-hover:text-amber-600 transition-all transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
        Launch Tool <ArrowRight size={14}/>
      </div>
    </div>
  </button>
);

const SkeletonCard = () => (
  <div className="h-64 rounded-2xl bg-stone-100 animate-pulse border border-stone-200 relative overflow-hidden">
     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-150%] animate-shimmer"></div>
     <div className="p-8">
        <div className="w-14 h-14 bg-stone-200 rounded-2xl mb-6"></div>
        <div className="h-6 w-3/4 bg-stone-200 rounded mb-3"></div>
        <div className="h-4 w-full bg-stone-200 rounded"></div>
     </div>
  </div>
);

const Operations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate premium loading feel
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top Banner */}
      <div className="bg-[#1c1917] text-white pt-32 pb-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-900/20 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
           <div className="flex items-center gap-2 text-amber-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
              <LayoutDashboard size={14} />
              <span>Restricted Access Area</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">Operations Hub</h1>
           <p className="text-stone-400 max-w-2xl font-light text-lg">
             Centralized command for logistics, financial generation, and contract management. Select a tool to begin.
           </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {loading ? (
             <>
               <SkeletonCard />
               <SkeletonCard />
               <SkeletonCard />
               <SkeletonCard />
             </>
          ) : (
             <>
                {/* 1. Invoice Generator */}
                <ToolCard 
                  title="Invoice Studio"
                  subtitle="Create GST-compliant bills for Hatsun, JVS, and Global Petroleum."
                  icon={FileText}
                  colorClass="bg-blue-50"
                  delay={100}
                  onClick={() => navigate('/invoice')}
                />

                {/* 2. Ledger Dashboard */}
                <ToolCard 
                  title="Client Ledgers"
                  subtitle="Track Debit/Credit and Volume supply across all brokerage accounts."
                  icon={TrendingUp}
                  colorClass="bg-emerald-50"
                  delay={200}
                  onClick={() => navigate('/ledger')}
                />

                {/* 3. Quotation Builder */}
                <ToolCard 
                  title="Quotation Builder"
                  subtitle="Generate Boiler Operation & Maintenance contracts (Nageshwar Format)."
                  icon={ScrollText}
                  colorClass="bg-amber-50"
                  delay={300}
                  onClick={() => navigate('/quotation')} 
                />

                {/* 4. Challan Manager */}
                <ToolCard 
                  title="Challan Manager"
                  subtitle="Create & Print Delivery Challans for logistics tracking."
                  icon={FileSpreadsheet}
                  colorClass="bg-orange-50"
                  delay={400}
                  onClick={() => navigate('/challan')}
                />
             </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Operations;