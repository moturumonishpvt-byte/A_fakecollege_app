import React from 'react';

export default function PortalHeader() {
  return (
    <header className="bg-white border-b border-gray-100 py-3 px-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]" id="portal-header">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Logo and College Wordmark */}
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          {/* Stylized Vignan Logo */}
          <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 via-indigo-600 to-violet-500 shadow-md flex items-center justify-center p-1" id="vignan-logo-container">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="3" fill="none" />
              {/* Outer Star Shapes */}
              <path d="M50 15 L56 38 L78 38 L60 52 L66 75 L50 61 L34 75 L40 52 L22 38 L44 38 Z" fill="white" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              {/* Core design elements */}
              <circle cx="50" cy="50" r="14" fill="#1e3a8a" />
              <path d="M50 36 L50 64 M36 50 L64 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="50" r="6" fill="white" />
            </svg>
          </div>

          {/* College Text */}
          <div className="text-left font-sans flex-1" id="college-text-banner">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-2xl md:text-3.5xl font-black tracking-tight text-[#c2185b] uppercase font-sans">
                Vignan's
              </span>
              <span className="text-sm md:text-md font-bold tracking-wider text-slate-800 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                (Autonomous)
              </span>
            </div>
            
            <h1 className="text-xs md:text-[14.5px] font-extrabold tracking-wide text-slate-900 leading-snug uppercase mt-0.5">
              Institute of Information Technology
            </h1>
            
            <p className="text-[10px] md:text-[11.5px] font-medium text-slate-600 mt-1 leading-tight">
              (Approved by AICTE-New Delhi &amp; Affiliated to JNTU-GV, Vizianagaram)
            </p>
            <p className="text-[9px] md:text-[10px] font-medium text-[#c2185b] tracking-tight mt-0.5">
              Beside VSEZ, Duvvada, Vadlapudi Post, Gajuwaka, Visakhapatnam - 530 049.
            </p>
          </div>
        </div>

        {/* Right Side: Accreditations (from screenshot, responsive wrap) */}
        <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-4 md:border-l lg:border-slate-200 lg:pl-6 py-1" id="accreditations-container">
          
          {/* Autonomous Shield */}
          <div className="flex flex-col items-center bg-rose-50 border border-rose-100 rounded-md p-1.5 w-[70px] text-center shadow-xs">
            <div className="w-7 h-7 flex-shrink-0 mb-0.5 text-rose-600">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.54-3.04 8.79-7 9.88-3.96-1.1-7-5.35-7-9.88v-4.7l7-3.12z" />
                <circle cx="12" cy="11" r="3" />
              </svg>
            </div>
            <span className="text-[8px] font-black text-rose-700 leading-none uppercase">Autonomous</span>
          </div>

          {/* NBA Badge */}
          <div className="flex flex-col items-center bg-sky-50 border border-sky-100 rounded-md p-1.5 w-[70px] text-center shadow-xs">
            <div className="w-7 h-7 flex-shrink-0 mb-0.5 text-sky-600 font-black text-[10px] leading-7 rounded-full border border-sky-400 flex items-center justify-center bg-white">
              NBA
            </div>
            <span className="text-[7.5px] font-bold text-sky-800 leading-tight uppercase">CSE | IT | ECE<br />EEE | MECH</span>
          </div>

          {/* NAAC Badge */}
          <div className="flex flex-col items-center bg-amber-50 border border-amber-100 rounded-md p-1.5 w-[75px] text-center shadow-xs">
            <div className="w-7 h-7 flex-shrink-0 mb-0.5 text-amber-600 flex items-center justify-center bg-white rounded-full border border-amber-300">
              <span className="text-[10px] font-black italic">A+</span>
            </div>
            <span className="text-[7.5px] font-black text-amber-700 leading-none uppercase">NAAC GRADE</span>
            <span className="text-[6.5px] font-medium text-amber-600 leading-none">(3.41/4.00)</span>
          </div>

          {/* NIRF Badge */}
          <div className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-md p-1.5 w-[70px] text-center shadow-xs">
            <div className="w-7 h-7 flex-shrink-0 mb-0.5 text-blue-700">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[7.5px] font-black text-blue-800 leading-none uppercase">NIRF 2024</span>
            <span className="text-[6.5px] font-medium text-blue-600 leading-none">201-300 RANK</span>
          </div>

          {/* Institutional Innovation Council */}
          <div className="flex flex-col items-center bg-violet-50 border border-violet-100 rounded-md p-1.5 w-[85px] text-center shadow-xs">
            <div className="w-7 h-7 flex items-center justify-center relative mb-0.5 text-violet-700">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <span className="text-[7.5px] font-black text-violet-800 leading-none uppercase">INNOVATION</span>
            <span className="text-[6.5px] font-serif text-violet-600 leading-none">COUNCIL</span>
          </div>

        </div>

      </div>
    </header>
  );
}
