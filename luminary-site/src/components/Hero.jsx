// src/components/Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// OPTION 1: Warm Sunset Timber Stacks (Recommended - feels energetic & large scale)
const IMAGE_URL = "https://images.unsplash.com/photo-1586283569584-417993a28425?auto=format&fit=crop&q=80&w=2000";

const Hero = ({ text }) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-stone-900">
      {/* BACKGROUND IMAGE with warm filter */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 transition-transform duration-[10s] hover:scale-105"
        style={{ backgroundImage: `url('${IMAGE_URL}')` }}
      >
        {/* PROFESSIONAL OVERLAY: A warm, dark gradient to make text readable but keep the warmth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-amber-900/30" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        
        {/* Blue accent -> Warm Amber */}
        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm mb-4 animate-fade-in-up flex items-center gap-3">
          <span className="h-[2px] w-8 bg-amber-500 inline-block"></span>
          {text.heroSubtitle}
        </span>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight max-w-4xl animate-fade-in-up delay-100 drop-shadow-lg">
          {text.heroTitle}
        </h1>
        
        <p className="text-stone-200 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed animate-fade-in-up delay-300 drop-shadow-md">
          Streamlining the firewood supply chain with advanced financial analytics and automated invoicing for modern industry leaders.
        </p>

        {/* UPDATED BUTTON: Links to /network */}
        <button 
          onClick={() => navigate('/network')}
          className="group flex items-center gap-3 w-fit px-8 py-4 bg-white text-stone-900 rounded-sm font-bold tracking-wide hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 shadow-xl animate-fade-in-up delay-500"
        >
          {text.readMore} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Hero;