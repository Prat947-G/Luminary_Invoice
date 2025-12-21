import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogIn, ChevronDown, TrendingUp, Menu, X, FileText, LayoutDashboard, Globe } from 'lucide-react';

const Navbar = ({ onLanguageChange, currentLang }) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [mobileOpen, setMobileOpen] = useState(false);
   const { currentUser, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const isLoginPage = location.pathname === '/login';

   // SCROLL LISTENER
   useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const handleAuth = async () => {
      if (currentUser) {
         await logout();
         navigate('/');
      } else {
         navigate('/login');
      }
   };

   if (isLoginPage) return null;

   // HIDE NAVBAR ON INVOICES (To prevent overlay/click issues)
   if (location.pathname.startsWith('/invoice')) return null;

   // DYNAMIC STYLING
   const isToolPage = ['/invoice', '/ledger', '/challan', '/quotation'].includes(location.pathname);
   const isSolidNav = isScrolled || isToolPage;

   const navClass = isSolidNav
      ? "bg-white/95 backdrop-blur-md text-stone-900 shadow-sm py-3 border-b border-stone-100"
      : "bg-transparent text-white py-6";

   const textColor = isSolidNav ? "text-stone-900" : "text-white";
   const hoverColor = "hover:text-amber-500 transition-colors";

   return (
      <nav className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 transition-all duration-300 flex justify-between items-center ${navClass}`}>

         {/* 1. BRAND IDENTITY */}
         <Link to="/" className="flex items-center gap-3 group" aria-label="Go to Homepage">
            <div className={`w-10 h-10 border-2 flex items-center justify-center rounded-sm transition-transform duration-500 group-hover:rotate-45 ${isSolidNav ? 'border-amber-600 text-amber-600' : 'border-white text-white'}`}>
               <span className="font-serif font-bold text-xl group-hover:-rotate-45 transition-transform">L</span>
            </div>
            <div className="flex flex-col">
               <span className={`text-lg font-bold uppercase tracking-widest leading-none ${textColor}`}>Luminary</span>
               <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-amber-500 mt-1">Firewood Supply</span>
            </div>
         </Link>

         {/* 2. DESKTOP NAVIGATION */}
         <div className={`hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest ${textColor}`}>

            {/* OPERATIONS DROPDOWN - FIXED */}
            <div className="relative group h-full flex items-center cursor-pointer">
               <span className={`flex items-center gap-1 py-4 ${hoverColor}`}>
                  Operations <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
               </span>

               {/* THE FIX: 
              1. Removed 'mt-2' 
              2. Added a wrapper div with 'pt-4' (padding-top). 
              This padding acts as an invisible bridge so the mouse never loses focus.
           */}
               <div className="hidden group-hover:block absolute top-full left-0 w-64 pt-2">
                  <div className="bg-white text-stone-900 shadow-2xl rounded-sm border-t-4 border-amber-500 p-1 ring-1 ring-black/5 animate-in slide-in-from-top-2">
                     <Link to="/operations" className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded transition-colors group/item">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded group-hover/item:bg-amber-600 group-hover/item:text-white transition">
                           <LayoutDashboard size={18} />
                        </div>
                        <div className="flex flex-col">
                           <span>Tools Hub</span>
                           <span className="text-[9px] text-stone-400 font-normal capitalize">Quick access to all tools</span>
                        </div>
                     </Link>
                     <Link to="/invoice" className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded transition-colors group/item">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded group-hover/item:bg-blue-600 group-hover/item:text-white transition">
                           <FileText size={18} />
                        </div>
                        <span>Invoicing</span>
                     </Link>
                     <Link to="/ledger" className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded transition-colors group/item">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded group-hover/item:bg-emerald-600 group-hover/item:text-white transition">
                           <TrendingUp size={18} />
                        </div>
                        <span>Ledgers</span>
                     </Link>
                  </div>
               </div>
            </div>

            {/* NETWORK LINK */}
            <Link to="/network" className={`py-4 ${hoverColor}`}>Network</Link>

            {/* AUTH BUTTON */}
            <button
               onClick={handleAuth}
               className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-sm shadow-md transition-all active:scale-95"
            >
               {currentUser ? <User size={14} /> : <LogIn size={14} />}
               <span>{currentUser ? 'Exit' : 'Login'}</span>
            </button>
         </div>

         {/* 3. MOBILE TOGGLE */}
         <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded ${textColor} hover:bg-white/10 transition`}
         >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
         </button>

         {/* 4. MOBILE MENU OVERLAY */}
         {mobileOpen && (
            <div className="absolute top-full left-0 w-full bg-[#1c1917]/95 backdrop-blur-xl text-white shadow-2xl py-8 px-6 md:hidden border-t border-white/10 animate-in slide-in-from-top-10 z-40 h-screen">
               <div className="flex flex-col space-y-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Navigation</span>

                  <Link to="/network" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 bg-white/5 rounded border border-white/10 active:bg-white/10">
                     <Globe size={20} className="text-amber-500" /> Network Map
                  </Link>

                  <Link to="/operations" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 bg-white/5 rounded border border-white/10 active:bg-white/10">
                     <LayoutDashboard size={20} className="text-blue-400" /> Operations Hub
                  </Link>

                  <div className="h-px bg-white/10 my-4"></div>

                  <button onClick={() => { handleAuth(); setMobileOpen(false); }} className="w-full py-4 bg-amber-600 font-bold uppercase text-xs tracking-widest rounded shadow-lg active:scale-95 transition-transform">
                     {currentUser ? 'Logout System' : 'Portal Login'}
                  </button>
               </div>
            </div>
         )}
      </nav>
   );
};

export default Navbar;