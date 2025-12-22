import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// --- 🔒 THE VIP GUEST LIST ---
// ADD YOUR EXACT GMAIL ADDRESSES HERE
const AUTHORIZED_EMAILS = [
  "prathmeshkadam0524@gmail.com", // REPLACE THIS
  "jyotikadam2207@gmail.com" // REPLACE THIS
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // 1. Open Google Popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      // 2. THE BOUNCER CHECK (Email Whitelist)
      if (AUTHORIZED_EMAILS.includes(email)) {
        // ✅ Success: Email is on the list
        toast.success(`Welcome back, ${user.displayName}`);
        navigate('/operations');
      } else {
        // 🛑 Blocked: Email is NOT on the list
        await signOut(auth); // Force logout immediately
        toast.error("Access Denied: Unauthorized Email Account.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-stone-900 border border-stone-800 p-10 rounded-sm shadow-2xl">
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-stone-600 hover:text-amber-500 transition"><ArrowLeft size={20}/></button>
        
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 mb-5 rounded-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]">
             <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase font-serif">Restricted Area</h2>
          <p className="text-stone-500 text-xs mt-3 uppercase tracking-wide">Luminary Internal Operations</p>
        </div>

        <div className="space-y-6">
           <div className="bg-black/30 p-4 rounded border border-white/5">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest text-center mb-2">Security Protocol</p>
              <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                 <ShieldCheck size={14} className="text-green-500"/>
                 <span>Google Secure Authentication</span>
              </div>
           </div>

           <button 
             onClick={handleGoogleLogin} 
             disabled={loading}
             className="w-full py-4 bg-white hover:bg-stone-200 text-stone-900 text-xs font-bold uppercase tracking-widest rounded-sm transition flex justify-center items-center gap-3 shadow-lg active:scale-[0.98]"
           >
             {loading ? (
               <Loader2 className="animate-spin" size={18}/> 
             ) : (
               <>
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
                 <span>Sign in with Google</span>
               </>
             )}
           </button>
        </div>

        <div className="mt-10 text-center border-t border-white/5 pt-6">
           <p className="text-[9px] text-stone-600 uppercase tracking-widest">System Status: <span className="text-green-500">Online</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;