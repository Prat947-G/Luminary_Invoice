import React from 'react';
import { ArrowRight, BarChart3, FileCheck, Building2, Factory, Trees } from 'lucide-react';

// Sub-component for a single card
const Card = ({ id, image, date, title, subtitle, onClick }) => {
  // Card #2 is Invoice Tool, Card #3 is Ledger Dashboard
  const isInteractive = id === 2 || id === 3; 

  // Select the right icon for the card
  let Icon = Building2;
  if (id === 1) Icon = Factory; // Hatsun is a factory/producer
  if (id === 2) Icon = FileCheck; // Invoice Tool
  if (id === 3) Icon = BarChart3; // Ledger is analytics/brokerage
  if (title.includes("JK")) Icon = Trees; // JK is related to raw material

  return (
    <div 
      onClick={onClick}
      className={`group flex flex-col h-full bg-white border border-stone-200 transition-all duration-700 relative overflow-hidden ${isInteractive ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 hover:border-stone-300' : 'hover:shadow-lg'}`}
    >
      {/* Visual Indicator for Interactive Tools */}
      {isInteractive && (
        <div className={`absolute top-4 right-4 z-20 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md ${id === 3 ? 'bg-purple-900/80 text-purple-50' : 'bg-blue-900/80 text-blue-50'}`}>
           {id === 3 ? 'ENTER DASHBOARD' : 'OPEN TOOL'} <ArrowRight size={10} />
        </div>
      )}

      <div className="h-64 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[0.7] group-hover:saturate-100 contrast-[1.1]"
        />
        {/* Professional Dark & Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent mix-blend-multiply" />
        
        {/* Floating Icon on Image with Elegant Styling */}
        <div className="absolute bottom-5 left-5 text-white/80 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:text-white group-hover:bg-white/20 transition-all">
           <Icon size={28} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="p-8 flex flex-col gap-3 flex-1 relative bg-white">
        {/* Subtle accent line at the top of the text area */}
        <div className={`h-0.5 w-12 mb-2 ${id === 3 ? 'bg-purple-700' : (id === 2 ? 'bg-blue-700' : 'bg-stone-300')}`} />
        
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
            {date}
        </span>
        
        <div>
          <h3 className="text-2xl font-serif text-stone-900 group-hover:text-stone-700 transition-colors mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-stone-500 leading-relaxed font-light font-sans border-l-2 border-stone-100 pl-3">
            {subtitle}
          </p>
        </div>

        {/* Elegant Hover Action Link */}
        {isInteractive && (
            <div className={`mt-auto pt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-500 ${id === 3 ? 'text-purple-800' : 'text-blue-800'}`}>
                {id === 3 ? 'Access Brokerage Ledger' : 'Launch Invoice Studio'} <ArrowRight size={14}/>
            </div>
        )}
      </div>
    </div>
  );
};

const CardGrid = ({ text, onCardClick }) => {
  // PROFESSIONAL, INDUSTRIAL REALISM IMAGE MAPPING
  const imageMap = {
    // 1. Hatsun Agro: Large-scale industrial processing facility. Implies a major buyer.
    // Image: A massive, modern industrial plant at dusk.
    1: "https://images.unsplash.com/photo-1565610248329-443074b97442?auto=format&fit=crop&q=80&w=800", 

    // 2. Invoice Gen: Professional, high-end office desk with financial data.
    // Image: A clean desk with a laptop showing charts, a notebook, and a pen in a modern office.
    2: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", 

    // 3. Ledger & Analytics (JVS/Global/JK): The scale of timber logistics.
    // Image: An aerial shot of a massive timber yard with thousands of logs and heavy machinery. This perfectly captures the "Firewood Broker" scale.
    3: "https://images.unsplash.com/photo-1586283569584-417993a28425?auto=format&fit=crop&q=80&w=800" 
  };

  return (
    <section className="bg-[#FAF9F6] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-stone-800 tracking-tight font-serif">
              {text.lastUpdated}
            </h2>
            <div className="hidden md:block h-px bg-stone-300 w-32 mb-5"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {text.cards.map((card) => (
            <Card 
              key={card.id} 
              {...card} 
              image={imageMap[card.id]} 
              onClick={() => onCardClick && onCardClick(card.id)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardGrid;