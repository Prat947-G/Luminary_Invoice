// src/components/HomeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, FileText, Users, FileSpreadsheet, Mail } from 'lucide-react';

// SKELETON LOADER
const SkeletonCard = () => (
  <div className="h-64 rounded-3xl bg-stone-100 animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 translate-x-[-150%] animate-shimmer" />
  </div>
);

const ActivityCard = ({ title, subtitle, meta, icon: Icon, theme, onClick, delay }) => (
  <button
    onClick={onClick}
    className="group relative w-full h-72 rounded-3xl overflow-hidden text-left shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* DYNAMIC BACKGROUNDS (Green or Brown) */}
    <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 
      ${theme === 'green'
        ? "bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80')]"
        : "bg-[url('https://images.unsplash.com/photo-1586283569584-417993a28425?auto=format&fit=crop&q=80')]"
      }`}
    />

    {/* GRADIENT OVERLAY */}
    <div className={`absolute inset-0 opacity-90 transition-opacity group-hover:opacity-95 
      ${theme === 'green'
        ? "bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-stone-900/90"
        : "bg-gradient-to-br from-amber-900/90 via-orange-900/80 to-stone-900/90"
      }`}
    />

    {/* CONTENT */}
    <div className="relative z-10 p-8 h-full flex flex-col justify-between">

      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className={`w-14 h-14 rounded-2xl backdrop-blur-md bg-white/10 flex items-center justify-center border border-white/20 shadow-xl group-hover:bg-white/20 transition-all`}>
          <Icon size={28} className="text-white" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white/80 text-[10px] font-bold uppercase tracking-widest border border-white/10">
          <Clock size={12} /> {meta}
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <h3 className="text-3xl font-serif text-white mb-2 leading-tight">{title}</h3>
        <p className="text-white/70 text-sm font-light mb-6 max-w-sm">{subtitle}</p>

        <div className="flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 group-hover:gap-4 transition-all">
          Resume Work <ArrowRight size={16} />
        </div>
      </div>
    </div>
  </button>
);

const HomeDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800); // Fake load
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 -mt-10 relative z-20">

      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 animate-fade-in">
        <div>
          <span className="text-stone-400 font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Dashboard</span>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Your Workstation</h2>
        </div>
      </div>

      {/* RECENTLY USED TOOLS (New Section) */}
      <div className="mb-12">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Recently Used</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          <button onClick={() => navigate('/invoice')} className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100 min-w-[200px]">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
            <div className="text-left">
              <p className="font-bold text-stone-800 text-sm">Invoice Gen</p>
              <p className="text-[10px] text-stone-500">Created 2m ago</p>
            </div>
          </button>
          <button onClick={() => navigate('/ledger')} className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100 min-w-[200px]">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileSpreadsheet size={20} /></div>
            <div className="text-left">
              <p className="font-bold text-stone-800 text-sm">Master Ledger</p>
              <p className="text-[10px] text-stone-500">Active now</p>
            </div>
          </button>
          <button onClick={() => navigate('/mail-helper')} className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100 min-w-[200px]">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Mail size={20} /></div>
            <div className="text-left">
              <p className="font-bold text-stone-800 text-sm">Mail Helper</p>
              <p className="text-[10px] text-stone-500">Drafted 1h ago</p>
            </div>
          </button>
        </div>
      </div>

      {/* THE TWO MAIN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* CARD 1: Operations Style (Amber/Brown) */}
            <ActivityCard
              title="Hatsun Agro Product"
              subtitle="Draft Invoice #55 • 200 Tons Supply"
              meta="Edited 2h ago"
              icon={FileText}
              theme="brown"
              delay={100}
              onClick={() => navigate('/invoice/hatsun')}
            />

            {/* CARD 2: Labour Style (Green) */}
            <ActivityCard
              title="JK Paper Mills"
              subtitle="Labour Attendance Sheet • Shift B"
              meta="Updated Yesterday"
              icon={Users}
              theme="green"
              delay={200}
              onClick={() => navigate('/network/labour')}
            />
          </>
        )}
      </div>

      {/* ACTIVITY FEED (Simple List) */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2"><Clock size={18} className="text-stone-400" /> Activity Feed</h3>
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-stone-800">Generated Monthly Invoice for <span className="font-bold">Hatsun Agro</span></p>
              <p className="text-xs text-stone-400 mt-1">Today, 10:23 AM • Invoice #292</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-stone-800">Updated Ledger for <span className="font-bold">Global Petroleum</span></p>
              <p className="text-xs text-stone-400 mt-1">Yesterday, 4:45 PM • Added 3 Entries</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-stone-800">Drafted Quotation for <span className="font-bold">JVS Comatsco</span></p>
              <p className="text-xs text-stone-400 mt-1">Yesterday, 2:15 PM • Est. ₹12.5L</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomeDashboard;