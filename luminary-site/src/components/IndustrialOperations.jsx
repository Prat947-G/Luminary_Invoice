// src/components/IndustrialOperations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, FileText, FileSpreadsheet, ChevronRight, Settings } from 'lucide-react';
import { COMPANIES } from '../data/networkData';
import toast from 'react-hot-toast';

// 1. COMPANY CARD COMPONENT (Industrial Style)
const CompanyCard = ({ company, onInvoice, onEmail, onLedger }) => (
    <div className="group relative bg-[#1c1c1c] rounded-xl overflow-hidden border border-stone-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">

        {/* Decorative Header Background */}
        <div className="h-28 bg-[#d97706] relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
            <div className="absolute -bottom-6 -right-6 text-black/10 group-hover:text-black/20 transition-colors duration-500">
                <company.icon size={120} />
            </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-10 relative flex flex-col flex-grow text-stone-300">
            {/* Icon Badge */}
            <div className="absolute -top-8 left-6 w-16 h-16 bg-[#262626] rounded-xl border-2 border-[#d97706] shadow-md flex items-center justify-center text-[#d97706]">
                <company.icon size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1 leading-tight">{company.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#d97706] mb-4">{company.type}</p>

            {/* Details Area */}
            <div className="bg-[#262626] p-3 rounded border border-stone-700 mb-6 h-28 overflow-y-auto custom-scrollbar grow-0">
                <p className="text-[10px] text-stone-400 leading-relaxed font-medium whitespace-pre-line">
                    {company.details}
                </p>
            </div>

            {/* Buttons */}
            <div className="mt-auto grid grid-cols-3 gap-2">
                <button
                    onClick={() => onEmail(company)}
                    className="flex items-center justify-center gap-2 py-2 rounded bg-stone-800 text-stone-300 font-bold text-[10px] uppercase hover:bg-stone-700 transition-colors border border-stone-700"
                    title="Email"
                >
                    <Mail size={14} />
                </button>

                {/* Ledger Button (Available for all) */}
                <button
                    onClick={() => onLedger(company)}
                    className="flex items-center justify-center gap-2 py-2 rounded bg-stone-800 text-stone-300 font-bold text-[10px] uppercase hover:bg-stone-700 transition-colors border border-stone-700"
                    title="Ledger"
                >
                    <FileSpreadsheet size={14} />
                </button>

                {/* Invoice Button (Hidden for Globus 'global') */}
                {company.id !== 'global' && (
                    <button
                        onClick={() => onInvoice(company)}
                        className="flex items-center justify-center gap-2 py-2 rounded bg-[#d97706] text-white font-bold text-[10px] uppercase hover:bg-[#b45309] transition-colors shadow-md"
                        title="Invoice"
                    >
                        <FileText size={14} />
                    </button>
                )}
            </div>
        </div>
    </div>
);

// 2. MAIN PAGE COMPONENT
const IndustrialOperations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Filter only Operations companies
    const operationsCompanies = COMPANIES.filter(c => c.category === 'operations');

    useEffect(() => {
        setTimeout(() => setLoading(false), 600);
    }, []);

    const handleInvoice = (company) => {
        // Route Map: company.id -> Route Path
        const specificRoutes = {
            'hatsun': '/invoice/hatsun',
            'jvs': '/invoice/jvs',
            'jk-cake': '/invoice/jk'
        };

        if (specificRoutes[company.id]) {
            navigate(specificRoutes[company.id]);
        } else {
            // Fallback for others (generic)
            navigate('/invoice', { state: { clientData: company } });
        }
    };

    const handleLedger = (company) => {
        navigate(`/ledger/${company.id}`);
    };

    const handleEmail = (company) => {
        // Route to the new MailHelper
        navigate('/mail-helper', { state: { recipient: company } });
    };

    return (
        <div className="min-h-screen bg-[#121212] text-stone-200 font-sans pb-24">

            {/* --- HERO SECTION (Industrial Amber Theme) --- */}
            <div className="relative pt-28 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>

                <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
                    <button onClick={() => navigate('/network')} className="flex items-center gap-2 text-[#d97706] hover:text-white transition-colors mb-6 text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Return to Network
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="p-2 bg-[#d97706] rounded text-black"><Settings size={20} /></span>
                        <span className="text-[#d97706] font-bold tracking-[0.2em] uppercase text-xs">Operations Division</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight uppercase tracking-tight">Industrial Operations</h1>
                    <p className="max-w-2xl text-base font-light text-stone-400 leading-relaxed">
                        Supply chain partnerships, boiler maintenance contracts, and specialized industrial services for major manufacturing units.
                    </p>
                </div>
            </div>

            {/* --- COMPANY CARDS SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[400px] bg-[#1c1c1c] rounded-xl animate-pulse border border-stone-800" />
                        ))
                    ) : (
                        operationsCompanies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onInvoice={handleInvoice}
                                onEmail={handleEmail}
                                onLedger={handleLedger}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* --- GLOBAL TOOLS SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-stone-800 flex-1"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Fast Actions</span>
                    <div className="h-px bg-stone-800 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. Quotation Generator */}
                    <button
                        onClick={() => navigate('/quotation')}
                        className="group flex p-6 bg-[#1c1c1c] rounded-xl border border-stone-800 hover:border-[#d97706] transition-all duration-300 text-left"
                    >
                        <div className="mr-4 text-[#d97706]"><FileSpreadsheet size={24} /></div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase mb-1">Quotations</h3>
                            <p className="text-[10px] text-stone-500">Create operation estimates.</p>
                        </div>
                        <ChevronRight size={16} className="ml-auto text-stone-600 group-hover:text-[#d97706]" />
                    </button>

                    {/* 2. Mail Helper (New) */}
                    <button
                        onClick={() => navigate('/mail-helper')}
                        className="group flex p-6 bg-[#1c1c1c] rounded-xl border border-stone-800 hover:border-[#d97706] transition-all duration-300 text-left"
                    >
                        <div className="mr-4 text-[#d97706]"><Mail size={24} /></div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase mb-1">Mail Helper</h3>
                            <p className="text-[10px] text-stone-500">AI-assisted communication.</p>
                        </div>
                        <ChevronRight size={16} className="ml-auto text-stone-600 group-hover:text-[#d97706]" />
                    </button>

                    {/* 3. Advisement (New) */}
                    <button
                        onClick={() => navigate('/advisement')}
                        className="group flex p-6 bg-[#1c1c1c] rounded-xl border border-stone-800 hover:border-[#d97706] transition-all duration-300 text-left"
                    >
                        <div className="mr-4 text-[#d97706]"><Settings size={24} /></div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase mb-1">Advisement</h3>
                            <p className="text-[10px] text-stone-500">Consultation & Strategy.</p>
                        </div>
                        <ChevronRight size={16} className="ml-auto text-stone-600 group-hover:text-[#d97706]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IndustrialOperations;
