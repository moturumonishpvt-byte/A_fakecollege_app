import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, User, Info, Smartphone, Eye, EyeOff } from 'lucide-react';

import PortalHeader from './components/PortalHeader';
import PortalFooter from './components/PortalFooter';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import ParentDashboard from './components/ParentDashboard';

import { INITIAL_STUDENT, INITIAL_EMPLOYEE, INITIAL_GRADES, INITIAL_ATTENDANCE, INITIAL_BOOKS, INITIAL_FEES, INITIAL_ANNOUNCEMENTS, INITIAL_MESSAGES } from './data';

type RoleType = 'Employee' | 'Student' | 'Parent' | null;

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleType>(null);
  
  // Login input fields for the 3 distinct cards
  const [employeeUser, setEmployeeUser] = useState('');
  const [employeePass, setEmployeePass] = useState('');
  
  const [studentUser, setStudentUser] = useState('');
  const [studentPass, setStudentPass] = useState('');
  
  const [parentUser, setParentUser] = useState('');
  const [parentPass, setParentPass] = useState('');
  
  // Visual indicators
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    Employee: false,
    Student: false,
    Parent: false
  });
  
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize unified LocalStorage system on boot
  useEffect(() => {
    const savedState = localStorage.getItem('vignan_portal_state');
    if (!savedState) {
      const state = {
        student: INITIAL_STUDENT,
        employee: INITIAL_EMPLOYEE,
        grades: INITIAL_GRADES,
        attendance: INITIAL_ATTENDANCE,
        books: INITIAL_BOOKS,
        fees: INITIAL_FEES,
        announcements: INITIAL_ANNOUNCEMENTS,
        messages: INITIAL_MESSAGES
      };
      localStorage.setItem('vignan_portal_state', JSON.stringify(state));
    }
  }, []);

  // Secure portal authentication
  const handlePortalLogin = (role: 'Employee' | 'Student' | 'Parent') => {
    setLoginError(null);
    let username = '';
    let password = '';
    
    if (role === 'Employee') {
      username = employeeUser.trim().toLowerCase();
      password = employeePass;
    } else if (role === 'Student') {
      username = studentUser.trim().toLowerCase();
      password = studentPass;
    } else if (role === 'Parent') {
      username = parentUser.trim().toLowerCase();
      password = parentPass;
    }

    // Auth verification
    if (!username || !password) {
      setLoginError(`Please enter both a User Name and Password for ${role} Login.`);
      return;
    }

    // Role specifics check (flexible to accept either standard or demo credentials)
    if (role === 'Employee') {
      if ((username === 'faculty' || username === 'emp-5524' || username === 'emp101') && password === 'password') {
        setCurrentRole('Employee');
      } else if (username === '12027' && password === '12027') {
        setCurrentRole('Employee');
      } else {
        setLoginError('Invalid Employee credentials. Hint: use "12027" as both User Name and Password');
      }
    } else if (role === 'Student') {
      if ((username === 'student' || username === '21l31a0501' || username === 'aarav') && password === 'password') {
        setCurrentRole('Student');
      } else {
        setLoginError('Invalid Student credentials. Hint: use "student" & "password"');
      }
    } else if (role === 'Parent') {
      if ((username === 'parent' || username === 'guardian' || username === 'parent101') && password === 'password') {
        setCurrentRole('Parent');
      } else {
        setLoginError('Invalid Parent credentials. Hint: use "parent" & "password"');
      }
    }
  };

  // Helper to prefill login parameters
  const prefillDemoDetails = (role: 'Employee' | 'Student' | 'Parent') => {
    setLoginError(null);
    if (role === 'Employee') {
      setEmployeeUser('12027');
      setEmployeePass('12027');
    } else if (role === 'Student') {
      setStudentUser('student');
      setStudentPass('password');
    } else if (role === 'Parent') {
      setParentUser('parent');
      setParentPass('password');
    }
  };

  const handleLogout = () => {
    setCurrentRole(null);
    // clear local input fields
    setEmployeeUser('');
    setEmployeePass('');
    setStudentUser('');
    setStudentPass('');
    setParentUser('');
    setParentPass('');
    setLoginError(null);
  };

  return (
    <div className="bg-[#f0f4f8] min-h-screen flex flex-col justify-between select-none" id="vignan-app-root">
      
      {/* Dynamic Header */}
      <PortalHeader />

      {/* Main Interactive Screen Content */}
      <main className="flex-1 flex flex-col justify-center items-center py-4" id="vignan-main-container">
        
        <AnimatePresence mode="wait">
          {!currentRole ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-7xl mx-auto px-4 space-y-6 flex flex-col items-center"
              id="landing-portal-wrapper"
            >
              
              {/* College Campus Library & Study Image Banner */}
              <div 
                className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center relative select-none" 
                id="college-billboard-banner"
              >
                <img 
                  src="/src/assets/images/college_banner_1781514186426.jpg" 
                  alt="Vignan Library and Study Class Arena" 
                  className="w-full h-auto object-cover max-h-[300px] pointer-events-none md:block"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual caption layering for design depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent hidden md:flex flex-col justify-end p-6 text-left text-white">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight leading-none text-sky-100">
                    Nurturing Information Builders of Tomorrow
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 font-sans tracking-wide mt-1.5 opacity-90 max-w-2xl font-medium">
                    Integrated digital portals linking faculty, parent associations, and scholars under a united interactive autonomous campus network.
                  </p>
                </div>
              </div>

              {/* Login Errors notice */}
              {loginError && (
                <div className="w-full max-w-5xl bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-800 text-xs text-center font-bold font-sans shadow-sm flex items-center justify-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Core Login Modules GRID (3 Cards matching the screenshot) */}
              <div 
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-center items-stretch py-2" 
                id="portal-login-cards-grid"
              >
                
                {/* CARD 1: Employee Login - Purple header */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden relative group hover:border-[#7b1fa2] transition-colors duration-300">
                  <div className="bg-gradient-to-r from-[#8e24aa] to-[#7b1fa2] text-white py-4 text-center font-bold tracking-wider text-sm uppercase">
                    Employee Login
                  </div>

                  {/* Form fields with exact orange-red labels style described in screenshot */}
                  <div className="p-5 md:p-6 space-y-4 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      {/* Username input */}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-[#f4511e] w-24 flex-shrink-0 font-sans">
                          User Name :
                        </span>
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={employeeUser}
                            onChange={(e) => setEmployeeUser(e.target.value)}
                            className="w-full bg-[#374151] text-white border border-slate-650 px-2.5 py-1.5 text-xs font-mono focus:border-[#7b1fa2] focus:outline-none rounded" 
                          />
                        </div>
                      </div>

                      {/* Password input */}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-[#f4511e] w-24 flex-shrink-0 font-sans">
                          Password :
                        </span>
                        <div className="relative flex-1 flex items-center">
                          <input 
                            type={showPassword.Employee ? 'text' : 'password'} 
                            value={employeePass}
                            onChange={(e) => setEmployeePass(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePortalLogin('Employee')}
                            className="w-full bg-[#374151] text-white border border-slate-650 px-2.5 py-1.5 pr-8 text-xs font-sans focus:border-[#7b1fa2] focus:outline-none rounded" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(p => ({ ...p, Employee: !p.Employee }))}
                            className="absolute right-2 text-slate-400 hover:text-white"
                          >
                            {showPassword.Employee ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom module layout with Avatar on left, gradient LOGIN pill on right */}
                    <div className="flex items-end justify-between mt-6 pt-4 border-t border-slate-100">
                      {/* Beautiful Employee badge ID lanyard vector avatar */}
                      <div className="w-16 h-16 rounded-full bg-sky-100 border-2 border-indigo-500 shadow-sm flex items-center justify-center relative p-1.5 cursor-pointer hover:scale-105 transition" title="Pre-fill Employee Demo" onClick={() => prefillDemoDetails('Employee')}>
                        <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-700" fill="currentColor">
                          {/* Face and hair representing professional educator with lanyard ID card */}
                          <path d="M50 15c-15 0-22 10-22 20 0 10 5 15 22 15s22-5 22-15c0-10-7-20-22-20z" />
                          <path d="M50 54c-18 0-32 10-34 24h68c-2-14-16-24-34-24z" fill="#0d47a1" />
                          {/* Lanyard string and white card emblem badge */}
                          <path d="M38 54 l12 25 l12 -25" stroke="#ffeb3b" strokeWidth="3" fill="none" />
                          <rect x="42" y="72" width="16" height="12" rx="2" fill="white" stroke="#333" strokeWidth="1" />
                          <circle cx="50" cy="76" r="2" fill="#d32f2f" />
                        </svg>
                      </div>

                      {/* LOGIN pill-shaped matching button */}
                      <button
                        onClick={() => handlePortalLogin('Employee')}
                        className="bg-gradient-to-r from-[#8e24aa] to-[#d81b60] hover:from-[#7b1fa2] hover:to-[#c2185b] text-white font-extrabold text-[11px] tracking-widest px-6 py-2.2 rounded-full cursor-pointer shadow-md transition-all uppercase"
                      >
                        LOGIN
                      </button>
                    </div>

                  </div>
                </div>

                {/* CARD 2: Student Login - Orange header */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden relative group hover:border-[#e65100] transition-colors duration-300">
                  <div className="bg-gradient-to-r from-[#e65100] to-[#f57c00] text-white py-4 text-center font-bold tracking-wider text-sm uppercase">
                    Student Login
                  </div>

                  {/* Form fields with exact orange-red labels style described in screenshot */}
                  <div className="p-5 md:p-6 space-y-4 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      {/* Username input */}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-[#f4511e] w-24 flex-shrink-0 font-sans">
                          User Name :
                        </span>
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={studentUser}
                            onChange={(e) => setStudentUser(e.target.value)}
                            className="w-full bg-[#374151] text-white border border-slate-650 px-2.5 py-1.5 text-xs font-mono focus:border-[#e65100] focus:outline-none rounded" 
                          />
                        </div>
                      </div>

                      {/* Password input */}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-[#f4511e] w-24 flex-shrink-0 font-sans">
                          Password :
                        </span>
                        <div className="relative flex-1 flex items-center">
                          <input 
                            type={showPassword.Student ? 'text' : 'password'} 
                            value={studentPass}
                            onChange={(e) => setStudentPass(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePortalLogin('Student')}
                            className="w-full bg-[#374151] text-white border border-slate-650 px-2.5 py-1.5 pr-8 text-xs font-sans focus:border-[#e65100] focus:outline-none rounded" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(p => ({ ...p, Student: !p.Student }))}
                            className="absolute right-2 text-slate-400 hover:text-white"
                          >
                            {showPassword.Student ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom module layout with Avatar on left, gradient LOGIN pill on right */}
                    <div className="flex items-end justify-between mt-6 pt-4 border-t border-slate-100">
                      {/* Beautiful Student avatar vector wearing green details and graduation mortarboard cap */}
                      <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 shadow-sm flex items-center justify-center relative p-1.5 cursor-pointer hover:scale-105 transition" title="Pre-fill Student Demo" onClick={() => prefillDemoDetails('Student')}>
                        <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-700" fill="currentColor">
                          <circle cx="50" cy="50" r="48" fill="#e8f5e9" stroke="#4caf50" strokeWidth="1" />
                          {/* Green profile body representation from screenshot avatar */}
                          <path d="M50 25c-10 0-16 6-16 14 0 8 4 12 16 12s16-4 16-12c0-8-6-14-16-14z" />
                          <path d="M50 54c-14 0-26 8-28 20h56c-2-12-14-20-28-20z" fill="#4caf50" />
                          {/* Graduation Cap overlapping */}
                          <path d="M22 24 l28 -12 l28 12 l-28 12 z" fill="#1b5e20" />
                          <rect x="47" y="24" width="6" height="12" fill="#1b5e20" />
                          <path d="M78 24 l4 14 l-3 1" fill="#ffeb3b" />
                        </svg>
                      </div>

                      {/* LOGIN pill-shaped matching button */}
                      <button
                        onClick={() => handlePortalLogin('Student')}
                        className="bg-gradient-to-r from-[#e65100] to-[#f57c00] hover:from-[#d84315] hover:to-[#ef6c00] text-white font-extrabold text-[11px] tracking-widest px-6 py-2.2 rounded-full cursor-pointer shadow-md transition-all uppercase"
                      >
                        LOGIN
                      </button>
                    </div>

                  </div>
                </div>

                {/* CARD 3: Parent Login - Blue header */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden relative group hover:border-[#0288d1] transition-colors duration-300">
                  <div className="bg-gradient-to-r from-[#0288d1] to-[#03a9f4] text-white py-4 text-center font-bold tracking-wider text-sm uppercase">
                    Parent Login
                  </div>

                  {/* Form fields with exact orange-red labels style described in screenshot */}
                  <div className="p-5 md:p-6 space-y-4 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      {/* Username input */}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-[#f4511e] w-24 flex-shrink-0 font-sans">
                          User Name :
                        </span>
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={parentUser}
                            onChange={(e) => setParentUser(e.target.value)}
                            className="w-full bg-[#374151] text-white border border-slate-650 px-2.5 py-1.5 text-xs font-mono focus:border-[#0288d1] focus:outline-none rounded" 
                          />
                        </div>
                      </div>

                      {/* Password input */}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-[#f4511e] w-24 flex-shrink-0 font-sans">
                          Password :
                        </span>
                        <div className="relative flex-1 flex items-center">
                          <input 
                            type={showPassword.Parent ? 'text' : 'password'} 
                            value={parentPass}
                            onChange={(e) => setParentPass(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePortalLogin('Parent')}
                            className="w-full bg-[#374151] text-white border border-slate-650 px-2.5 py-1.5 pr-8 text-xs font-sans focus:border-[#0288d1] focus:outline-none rounded" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(p => ({ ...p, Parent: !p.Parent }))}
                            className="absolute right-2 text-slate-400 hover:text-white"
                          >
                            {showPassword.Parent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom module layout with Avatar on left, gradient LOGIN pill on right */}
                    <div className="flex items-end justify-between mt-6 pt-4 border-t border-slate-100">
                      {/* Beautiful Parent couple dual avatar representation from screenshot */}
                      <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-sky-400 shadow-sm flex items-center justify-center relative p-1.5 cursor-pointer hover:scale-105 transition" title="Pre-fill Parent Demo" onClick={() => prefillDemoDetails('Parent')}>
                        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" fill="currentColor">
                          <circle cx="50" cy="50" r="48" fill="#e1f5fe" stroke="#0288d1" strokeWidth="1" />
                          {/* Father representation */}
                          <path d="M36 28c-8 0-12 5-12 11 0 6 3 9 12 9s12-3 12-9c0-6-4-11-12-11z" fill="#0277bd" />
                          <path d="M36 50c-11 0-21 7-23 17h46c-2-10-12-17-23-17z" fill="#01579b" />
                          {/* Mother representation */}
                          <path d="M64 32c-7 0-11 5-11 10 0 6 3 9 11 9s11-3 11-9c0-5-4-10-11-10z" fill="#d81b60" />
                          <path d="M64 53c-10 0-19 6-21 15h42c-2-9-11-15-21-15z" fill="#ad1457" />
                        </svg>
                      </div>

                      {/* LOGIN pill-shaped matching button */}
                      <button
                        onClick={() => handlePortalLogin('Parent')}
                        className="bg-gradient-to-r from-[#0288d1] to-[#03a9f4] hover:from-[#01579b] hover:to-[#0288d1] text-white font-extrabold text-[11px] tracking-widest px-6 py-2.2 rounded-full cursor-pointer shadow-md transition-all uppercase"
                      >
                        LOGIN
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Informational quick-access instruction board */}
              <div 
                className="w-full max-w-4xl bg-indigo-50/50 border border-indigo-200 rounded-xl p-5 text-left text-xs font-medium text-indigo-900 shadow-sm leading-relaxed" 
                id="portal-guidance-desk"
              >
                <div className="flex items-center gap-2.5 mb-2 font-bold text-sm text-indigo-950">
                  <Smartphone className="w-4.5 h-4.5 text-indigo-700" />
                  <span>College Digital Portal - Demo Access Credentials</span>
                </div>
                <p className="font-sans text-slate-700">
                  To easily test-drive and verify the distinct interconnected dashboards, you can click on the blue, green, or yellow avatars inside any card to pre-fill standard credentials, or read below:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 font-mono text-[11px] text-slate-800">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-indigo-950 uppercase text-[10px] tracking-wider mb-1">1. Employee Dash</p>
                    <p>User Name: <strong className="text-indigo-700">faculty</strong></p>
                    <p>Password: <strong>password</strong></p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-indigo-950 uppercase text-[10px] tracking-wider mb-1">2. Student Dash</p>
                    <p>User Name: <strong className="text-emerald-700">student</strong></p>
                    <p>Password: <strong>password</strong></p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-indigo-950 uppercase text-[10px] tracking-wider mb-1">3. Parent Dash</p>
                    <p>User Name: <strong className="text-sky-700">parent</strong></p>
                    <p>Password: <strong>password</strong></p>
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="portal-dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full min-h-screen flex flex-col justify-between"
              id="dashboard-router-view"
            >
              {currentRole === 'Student' && <StudentDashboard onLogout={handleLogout} />}
              {currentRole === 'Employee' && <FacultyDashboard onLogout={handleLogout} is12027={employeeUser.trim() === '12027'} />}
              {currentRole === 'Parent' && <ParentDashboard onLogout={handleLogout} />}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Structured Footer */}
      <PortalFooter />

    </div>
  );
}
