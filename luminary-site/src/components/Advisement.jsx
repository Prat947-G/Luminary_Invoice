// src/components/Advisement.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Megaphone, TrendingUp, AlertCircle } from 'lucide-react';

const Advisement = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-400 hover:text-[#d97706] transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back
                </button>

                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2d3a28] mb-4">Advisory & Updates</h1>
                    <p className="max-w-xl mx-auto text-stone-500 text-lg">
                        Strategic insights for industrial operations and important announcements for our partners.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Card 1: Compliance */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Safety Compliance Update</h3>
                        <p className="text-stone-500 text-sm leading-relaxed mb-4">
                            New boiler safety regulations (2025) require updated pressure valve checks every 3 months. Please schedule your maintenance via the Operations tab.
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Critical • Dec 20, 2025</span>
                    </div>

                    {/* Card 2: Market Trend */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Biomass Fuel Rates</h3>
                        <p className="text-stone-500 text-sm leading-relaxed mb-4">
                            Briquette prices are expected to stabilize in Q1 2026. We recommend stocking up inventory for the upcoming monsoon season buffers.
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Advisory • Dec 18, 2025</span>
                    </div>

                    {/* Card 3: New Service */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all md:col-span-2 flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4 text-[#d97706]">
                                <Megaphone size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest">New Launch</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">AI-Powered Quotation Builder</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">
                                We have launched a new tool to help you generate instant cost estimates for labour and operations. Try it out in the Tools section today to speed up your contracting process.
                            </p>
                        </div>
                        <button onClick={() => navigate('/quotation')} className="px-8 py-3 bg-[#2d3a28] text-white rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-stone-800 transition shadow-lg shrink-0">
                            Try Now
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Advisement;
