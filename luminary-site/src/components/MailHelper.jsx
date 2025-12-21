// src/components/MailHelper.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const MailHelper = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [recipient, setRecipient] = useState(location.state?.recipient || null);

    const [emailData, setEmailData] = useState({
        to: recipient?.email || '',
        subject: recipient ? `Query regarding ${recipient.name}` : '',
        body: ''
    });

    const [aiLoading, setAiLoading] = useState(false);
    const [tone, setTone] = useState('formal'); // formal, urgent, friendly

    // Pre-filled templates acting as "AI" for now unless we have a real backend API
    const TEMPLATES = {
        formal: {
            invoice: "Dear Accounts Team,\n\nPlease find attached the invoice for the recent supply/services. We request you to kindly process the same at your earliest convenience.\n\nBest Regards,\nNageshwar Enterprises",
            quotation: "Dear Sir/Madam,\n\nAs discussed, we are pleased to submit our commercial proposal for the requested boiler operations and maintenance work. We look forward to your positive response.\n\nRegards,\nNageshwar Enterprises",
            general: "Dear Sir,\n\nThis is regarding the ongoing operations at your plant. We would like to bring to your attention [Subject].\n\nThanks,\nNageshwar Enterprises"
        },
        urgent: {
            invoice: "Dear Team,\n\nRef: Outstanding Payment.\n\nThis is a gentle reminder regarding the pending invoice. We request you to clear the dues immediately to ensure uninterrupted services.\n\nRegards,\nNageshwar Enterprises",
            quotation: "Dear Sir,\n\nPlease find the urgent quotation attached as requested. This offer is valid for 3 days.\n\nRegards,\nNageshwar Enterprises",
            general: "URGENT:\n\nWe need your immediate attention on [Subject] to avoid any operational downtime.\n\nThanks."
        }
    };

    const handleAiGenerate = (type) => {
        setAiLoading(true);
        setTimeout(() => {
            const template = TEMPLATES[tone][type] || TEMPLATES[tone]['general'];
            setEmailData(prev => ({ ...prev, body: template }));
            setAiLoading(false);
            toast.success("Draft generated!");
        }, 1000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`To: ${emailData.to}\nSubject: ${emailData.subject}\n\n${emailData.body}`);
        toast.success("Copied to clipboard!");
    };

    const handleOpenClient = () => {
        window.location.href = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    };

    return (
        <div className="min-h-screen bg-[#121212] text-stone-200 font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-stone-800 rounded-full hover:bg-stone-700 transition"><ArrowLeft size={20} /></button>
                    <h1 className="text-3xl font-black uppercase text-white tracking-tight">AI Mail Helper</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar: AI Tools */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-[#1c1c1c] p-6 rounded-2xl border border-stone-800">
                            <div className="flex items-center gap-2 mb-4 text-[#d97706]">
                                <Sparkles size={20} />
                                <h3 className="font-bold uppercase tracking-widest text-xs">AI Composer</h3>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-stone-500 uppercase">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full mt-1 bg-stone-900 border border-stone-700 rounded p-2 text-xs text-white focus:border-[#d97706] outline-none"
                                    >
                                        <option value="formal">Professional / Formal</option>
                                        <option value="urgent">Urgent / Strict</option>
                                    </select>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <button onClick={() => handleAiGenerate('invoice')} className="w-full py-2 bg-stone-800 hover:bg-stone-700 rounded text-xs font-bold text-stone-300 flex items-center justify-center gap-2 transition">
                                        Invoice Email
                                    </button>
                                    <button onClick={() => handleAiGenerate('quotation')} className="w-full py-2 bg-stone-800 hover:bg-stone-700 rounded text-xs font-bold text-stone-300 flex items-center justify-center gap-2 transition">
                                        Quotation Email
                                    </button>
                                    <button onClick={() => handleAiGenerate('general')} className="w-full py-2 bg-stone-800 hover:bg-stone-700 rounded text-xs font-bold text-stone-300 flex items-center justify-center gap-2 transition">
                                        General Follow-up
                                    </button>
                                </div>

                                {aiLoading && <div className="text-center text-[10px] text-[#d97706] animate-pulse">Generating draft...</div>}
                            </div>
                        </div>
                    </div>

                    {/* Main: Editor */}
                    <div className="lg:col-span-2">
                        <div className="bg-white text-stone-900 rounded-2xl p-6 shadow-xl">

                            <div className="mb-4">
                                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">To</label>
                                <input
                                    value={emailData.to}
                                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                                    className="w-full border-b border-stone-200 py-1 focus:border-[#d97706] outline-none font-medium"
                                    placeholder="recipient@example.com"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Subject</label>
                                <input
                                    value={emailData.subject}
                                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                    className="w-full border-b border-stone-200 py-1 focus:border-[#d97706] outline-none font-bold text-lg"
                                    placeholder="Enter Subject..."
                                />
                            </div>

                            <div className="mb-6 relative">
                                <textarea
                                    value={emailData.body}
                                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                    className="w-full h-64 resize-none outline-none leading-relaxed text-sm text-stone-700"
                                    placeholder="Draft your email here or use AI to generate..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                                <button onClick={handleCopy} className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-lg text-xs font-bold flex items-center gap-2 transition">
                                    <Copy size={16} /> Copy Text
                                </button>
                                <button onClick={handleOpenClient} className="px-6 py-2 bg-[#d97706] text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#b45309] transition shadow-lg hover:shadow-xl">
                                    <Send size={16} /> Open Mail App
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MailHelper;
