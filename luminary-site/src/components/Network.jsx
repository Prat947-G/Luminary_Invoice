// src/components/Network.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Factory } from 'lucide-react';
import { CATEGORIES } from '../data/networkData';

const SkeletonCard = () => (
  <div className="h-64 w-full rounded-3xl bg-stone-200 animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
  </div>
);

const Network = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch for that premium feel
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-12 px-6 md:px-12 lg:px-24">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 animate-fade-in-up">
        <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Enterprise Network</span>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">Select Business Vertical</h1>
        <p className="text-stone-500 mt-4 max-w-xl text-lg font-light">Access client hubs, manage specific contracts, and generate documentation.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          CATEGORIES.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => navigate(`/network/${cat.id}`)}
              className="group relative overflow-hidden rounded-3xl p-8 h-80 w-full text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              
              {/* Colored Overlay (Green or Amber) */}
              <div className={`absolute inset-0 opacity-90 transition-opacity group-hover:opacity-95 
                ${cat.theme === 'green' ? 'bg-gradient-to-br from-emerald-900/95 to-stone-900/80' : 'bg-gradient-to-br from-amber-900/95 to-stone-900/80'}`} 
              />

              {/* Icon Decoration */}
              <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:opacity-20 transition-all duration-700 rotate-12 group-hover:rotate-0">
                 <cat.icon size={240} className="text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div className="w-16 h-16 rounded-2xl backdrop-blur-md bg-white/10 flex items-center justify-center border border-white/20 shadow-lg group-hover:bg-white/20 transition-colors">
                    <cat.icon size={32} className="text-white" />
                 </div>

                 <div>
                   <h3 className="text-3xl font-serif text-white mb-3">{cat.title}</h3>
                   <p className="text-stone-300 text-sm font-light leading-relaxed max-w-sm mb-6">{cat.description}</p>
                   
                   <div className="flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Enter Sector <ArrowRight size={14} />
                   </div>
                 </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Network;