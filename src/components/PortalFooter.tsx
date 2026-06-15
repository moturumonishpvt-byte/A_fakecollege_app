import React from 'react';

export default function PortalFooter() {
  return (
    <footer className="relative bg-gradient-to-r from-sky-600 to-indigo-700 text-white py-4 px-6 border-t-2 border-sky-400 mt-auto" id="portal-footer">
      {/* Subtle overlay patterning representing the grid/stripes seen in the screenshot */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10 text-xs md:text-sm font-sans">
        
        {/* Left/Center Text */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center md:text-left">
          <span className="font-medium tracking-wide">
            Copyright &copy; {new Date().getFullYear()} All rights reserved.
          </span>
          <span className="hidden md:inline text-sky-300">|</span>
          <span className="text-sky-100 italic">
            Vignan's Institute of Information Technology (Autonomous)
          </span>
        </div>

        {/* Right Partner Credit */}
        <div className="flex items-center gap-2 bg-black/15 px-3 py-1 rounded-full border border-white/10 shadow-inner">
          {/* Webpros Circular Logo placeholder */}
          <div className="w-6 h-6 rounded-full bg-white text-indigo-700 font-serif font-black text-[11px] flex items-center justify-center shadow-xs">
            WS
          </div>
          <span className="text-[11px] font-semibold text-sky-50 uppercase tracking-widest">
            Powered by <span className="text-white font-extrabold hover:underline">Webpros Solutions Pvt Ltd.</span>, Visakhapatnam
          </span>
        </div>

      </div>
    </footer>
  );
}
