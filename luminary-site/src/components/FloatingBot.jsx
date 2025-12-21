import React from 'react';
import { MessageCircle, User } from 'lucide-react';

const FloatingBot = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2 group cursor-pointer">
      <button className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-orange-600 hover:scale-110 transition-all duration-300">
        <MessageCircle size={24} />
      </button>
      
      {/* Small User Icon Overlay */}
      <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center border-2 border-white -mt-4 z-10 shadow-sm">
        <User size={14} className="text-stone-600" />
      </div>
    </div>
  );
};

export default FloatingBot;