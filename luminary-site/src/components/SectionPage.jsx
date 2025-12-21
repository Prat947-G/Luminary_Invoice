// src/components/SectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin } from 'lucide-react';
import { CATEGORIES, COMPANIES } from '../data/networkData';

const SectionPage = () => {
  const { type } = useParams(); // 'labour' or 'operations'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES.find(c => c.id === type);
  const companies = COMPANIES.filter(c => c.category === type);

  useEffect(() => {
    // Fake loading for effect
    setTimeout(() => setLoading(false), 600);
  }, [type]);

  if (!category) return <div>Category not found</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb & Back */}
        <button onClick={() => navigate('/network')} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
           <ArrowLeft size={16}/> Back to Sectors
        </button>

        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
           <h1 className="text-4xl font-serif text-stone-900 mb-4">{category.title} Clients</h1>
           <p className="text-stone-500 max-w-2xl">{category.description}</p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             // SKELETONS
             [1,2,3,4].map(i => (
               <div key={i} className="h-48 bg-white rounded-xl border border-stone-100 shadow-sm animate-pulse p-6">
                 <div className="w-12 h-12 bg-stone-200 rounded-lg mb-4"/>
                 <div className="h-6 w-3/4 bg-stone-200 rounded mb-2"/>
                 <div className="h-4 w-1/2 bg-stone-200 rounded"/>
               </div>
             ))
          ) : (
             // REAL DATA
             companies.map((company, idx) => (
               <button 
                 key={company.id}
                 onClick={() => navigate(`/company/${company.id}`)}
                 className="group bg-white p-8 rounded-2xl border border-stone-200 text-left hover:shadow-xl hover:border-amber-200 transition-all duration-300 animate-fade-in-up"
                 style={{ animationDelay: `${idx * 100}ms` }}
               >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${category.theme === 'green' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'}`}>
                     <Building2 size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{company.name}</h3>
                  <div className="flex items-center gap-2 text-stone-400 text-sm">
                     <MapPin size={14} /> {company.location}
                  </div>
                  <div className="mt-6 pt-6 border-t border-stone-100 flex justify-between items-center">
                     <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{company.type}</span>
                     <ArrowRight size={16} className="text-stone-300 group-hover:text-stone-900 transition-colors"/>
                  </div>
               </button>
             ))
          )}
        </div>

      </div>
    </div>
  );
};

export default SectionPage;