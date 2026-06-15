import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, BookOpen, Calendar, CreditCard, Award, 
  Bell, FileText, CheckCircle, AlertTriangle, Clock, 
  ArrowRight, Landmark, BookMarked, LogOut, ChevronRight
} from 'lucide-react';
import { StudentProfile, GradeRecord, AttendanceRecord, BookBorrowed, FeeStructure, Announcement } from '../types';
import { INITIAL_STUDENT, INITIAL_GRADES, INITIAL_ATTENDANCE, INITIAL_BOOKS, INITIAL_FEES, INITIAL_ANNOUNCEMENTS } from '../data';

interface StudentDashboardProps {
  onLogout: () => void;
}

type TabType = 'overview' | 'grades' | 'attendance' | 'timetable' | 'fees' | 'library' | 'announcements';

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  
  // Interconnected LocalStorage State Engine
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [books, setBooks] = useState<BookBorrowed[]>([]);
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  
  // Fee transaction modal state
  const [payModal, setPayModal] = useState<{ isOpen: boolean; fee: FeeStructure | null }>({ isOpen: false, fee: null });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNo, setCardNo] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const savedState = localStorage.getItem('vignan_portal_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGrades(parsed.grades || INITIAL_GRADES);
        setAttendance(parsed.attendance || INITIAL_ATTENDANCE);
        setBooks(parsed.books || INITIAL_BOOKS);
        setFees(parsed.fees || INITIAL_FEES);
        setAnnouncements(parsed.announcements || INITIAL_ANNOUNCEMENTS);
      } catch (e) {
        setGrades(INITIAL_GRADES);
        setAttendance(INITIAL_ATTENDANCE);
        setBooks(INITIAL_BOOKS);
        setFees(INITIAL_FEES);
        setAnnouncements(INITIAL_ANNOUNCEMENTS);
      }
    } else {
      setGrades(INITIAL_GRADES);
      setAttendance(INITIAL_ATTENDANCE);
      setBooks(INITIAL_BOOKS);
      setFees(INITIAL_FEES);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
    }
  }, []);

  // Save changes to LocalStorage
  const saveToLocalStorage = (newFees?: FeeStructure[], newBooks?: BookBorrowed[]) => {
    const savedState = localStorage.getItem('vignan_portal_state');
    let currentState: any = {};
    if (savedState) {
      try { currentState = JSON.parse(savedState); } catch(e) {}
    }
    
    const updatedState = {
      ...currentState,
      grades: grades.length ? grades : INITIAL_GRADES,
      attendance: attendance.length ? attendance : INITIAL_ATTENDANCE,
      books: newBooks || (books.length ? books : INITIAL_BOOKS),
      fees: newFees || (fees.length ? fees : INITIAL_FEES),
      announcements: announcements.length ? announcements : INITIAL_ANNOUNCEMENTS,
    };
    localStorage.setItem('vignan_portal_state', JSON.stringify(updatedState));
  };

  // Calculate stats
  const overallAttendancePercentage = (() => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    return Math.round((presentCount / attendance.length) * 1000) / 10;
  })();

  const gpa = (() => {
    // Standard grade calculation
    const gradePoints: Record<string, number> = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 };
    let totalCredits = 0;
    let earnedPoints = 0;
    
    grades.forEach(g => {
      const gPoint = gradePoints[g.grade] || 0;
      totalCredits += g.credits;
      earnedPoints += gPoint * g.credits;
    });
    
    return totalCredits > 0 ? (earnedPoints / totalCredits).toFixed(2) : '8.45';
  })();

  const handlePayFee = () => {
    if (!payModal.fee) return;
    const paymentAmount = payModal.fee.totalAmount - payModal.fee.paidAmount;
    
    // Simulate payment transaction
    setPaymentSuccess(true);
    setTimeout(() => {
      const updatedFees = fees.map(f => {
        if (f.category === payModal.fee?.category) {
          return {
            ...f,
            paidAmount: f.totalAmount,
            status: 'Fully Paid' as const
          };
        }
        return f;
      });
      setFees(updatedFees);
      saveToLocalStorage(updatedFees, undefined);
      
      // Reset payment dialogs
      setTimeout(() => {
        setPayModal({ isOpen: false, fee: null });
        setPaymentSuccess(false);
        setCardNo('');
        setCvv('');
        setUpiId('');
      }, 1500);
    }, 1500);
  };

  const handleReturnBook = (id: string) => {
    const updatedBooks = books.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'Returned' as const,
          fineAmount: 0
        };
      }
      return b;
    });
    setBooks(updatedBooks);
    saveToLocalStorage(undefined, updatedBooks);
  };

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'grades', name: 'Academic Grades', icon: Award },
    { id: 'attendance', name: 'Attendance Meter', icon: CheckCircle },
    { id: 'timetable', name: 'Class Timetable', icon: Calendar },
    { id: 'fees', name: 'Fee Dues & Payment', icon: CreditCard },
    { id: 'library', name: 'Library Desk', icon: BookMarked },
    { id: 'announcements', name: 'Announcements', icon: Bell, count: announcements.filter(a => a.targetAudience === 'All' || a.targetAudience === 'Student').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="student-portal-root">
      
      {/* Mini Profile Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900 shadow-lg text-white" id="dashboard-meta-header">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-indigo-400 p-0.5" 
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="text-left">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-sky-400 px-2.5 py-0.5 rounded bg-sky-950 border border-sky-900 inline-block mb-1">
                Student Account
              </span>
              <h2 className="text-lg md:text-xl font-bold tracking-tight">{student.name}</h2>
              <p className="text-[11px] md:text-xs text-slate-300 flex items-center gap-2 mt-0.5 font-mono">
                <span>Roll: <strong className="text-white">{student.rollNo}</strong></span>
                <span>•</span>
                <span>{student.course} {student.branch}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block p-2 bg-white/5 rounded border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-black">Academic Progress</p>
              <p className="text-lg font-mono font-bold text-sky-400">CGPA {gpa} <span className="text-xs text-white">/ 10</span></p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 transition-all duration-250 text-rose-200 hover:text-white px-4 py-2 rounded-md font-semibold text-xs shadow-sm"
              id="student-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT PORTAL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6" id="dashboard-content-layout">
        
        {/* Responsive Side Navigation */}
        <div className="lg:col-span-1 flex flex-col gap-2" id="sidebar-nav">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-1">Navigation Menu</h3>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-md font-semibold text-xs transition-all duration-200 text-left ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.count ? (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        isSelected ? 'bg-white text-indigo-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.count}
                      </span>
                    ) : (
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Quick Stats Summary Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hidden lg:block">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">My Overview</h4>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-sans">Sem:</span>
                <span className="font-bold text-slate-800">III Year - II Sem</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-sans">Attendance:</span>
                <span className={`font-bold ${overallAttendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {overallAttendancePercentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Library Dues:</span>
                <span className="font-bold text-slate-800">₹{books.reduce((acc, b) => acc + b.fineAmount, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Canvas Area */}
        <div className="lg:col-span-3 min-h-[500px]" id="dashboard-tab-canvas">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm min-h-full"
            >
              
              {/* ------------ OVERVIEW TAB ------------ */}
              {activeTab === 'overview' && (
                <div className="space-y-6" id="student-overview-tab">
                  {/* Header summary text */}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Academic Overview</h3>
                    <p className="text-xs text-slate-500">Welcome back, Aarav. Here is a snapshot of your current semester analytics.</p>
                  </div>

                  {/* Primary Grid: 3 Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Attendance Ring Meter */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-1">Attendance Meter</span>
                        <h4 className="text-2xl font-bold tracking-tight">{overallAttendancePercentage}%</h4>
                        <p className="text-[11px] text-indigo-600 mt-1">{overallAttendancePercentage >= 75 ? '✓ Safe Attendance' : '⚠ Deficit Attendance'}</p>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-indigo-200/50" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-indigo-600" strokeWidth="4" strokeDasharray={`${overallAttendancePercentage}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-800">
                          {overallAttendancePercentage}%
                        </div>
                      </div>
                    </div>

                    {/* CGPA */}
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100 rounded-lg p-4 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest block mb-1">Active CGPA</span>
                        <h4 className="text-2xl font-bold tracking-tight">{gpa} / 10</h4>
                        <p className="text-[11px] text-teal-600 mt-1">Excellent performance</p>
                      </div>
                      <Award className="w-12 h-12 text-teal-600 pointer-events-none opacity-80" />
                    </div>

                    {/* Pending Dues */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100 rounded-lg p-4 flex items-center justify-between">
                      {(() => {
                        const unpaidAmount = fees.reduce((acc, f) => acc + (f.status !== 'Fully Paid' ? (f.totalAmount - f.paidAmount) : 0), 0);
                        return (
                          <>
                            <div className="text-left">
                              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block mb-1">Pending Fees</span>
                              <h4 className="text-2xl font-bold tracking-tight">₹{unpaidAmount.toLocaleString()}</h4>
                              <p className="text-[11px] text-amber-600 mt-1">{unpaidAmount > 0 ? 'Payment Dues Exist' : 'All Clear'}</p>
                            </div>
                            <CreditCard className="w-12 h-12 text-amber-600 pointer-events-none opacity-80" />
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Section: Shared Announcement notice-board for Students */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Bell className="w-4.5 h-4.5 text-indigo-600" />
                      <span>Notice Board Highlights</span>
                    </h4>
                    <div className="space-y-3">
                      {announcements.slice(0, 2).map(ann => (
                        <div key={ann.id} className="bg-white border border-slate-100 rounded p-3 text-left">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {ann.postedBy}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{ann.postedDate}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-850">{ann.title}</h5>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActiveTab('announcements')}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 mt-2 hover:underline"
                      >
                        <span>View all announcements</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Class Coordination details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Coordinator Details</h4>
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
                          alt="L. Varshini" 
                          className="w-10 h-10 rounded-full object-cover border"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left text-xs">
                          <p className="font-bold text-slate-800">Ms. L. Varshini</p>
                          <p className="text-slate-500">Assistant Coordinator, Dept of CSE</p>
                          <p className="text-[#c2185b] font-medium font-mono text-[11px] mt-0.5">varshini.l@vignan.edu.in</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Portal Self Service</h4>
                        <p className="text-[11px] text-slate-500">Register feedback, print syllabus, apply for online credits transfer.</p>
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <span className="text-[9.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition">
                          Syllabus Book (R21)
                        </span>
                        <span className="text-[9.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition">
                          Academic Calendar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------ ACADEMIC GRADES TAB ------------ */}
              {activeTab === 'grades' && (
                <div className="space-y-6" id="student-grades-tab">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Academic Marksheets</h3>
                      <p className="text-xs text-slate-500">Secure record of marks, credits, and formal grade conversions.</p>
                    </div>
                    <div className="bg-slate-100 px-3 py-1.5 rounded-md text-xs font-bold flex gap-4 text-slate-700 border border-slate-200">
                      <span>SGPA: <strong className="text-indigo-700">8.38</strong></span>
                      <span>CGPA: <strong className="text-emerald-700">{gpa}</strong></span>
                    </div>
                  </div>

                  {/* Performance chart */}
                  <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 text-left">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Grades Performance Breakdown (Sem V &amp; Sem VI)</h4>
                    <div className="space-y-2 max-w-2xl">
                      {grades.map(gr => {
                        const gradeToPercent: Record<string, string> = { 'O': '95%', 'A+': '85%', 'A': '78%', 'B+': '68%', 'B': '60%' };
                        const percent = gradeToPercent[gr.grade] || '60%';
                        const barColor: Record<string, string> = { 'O': 'bg-emerald-500', 'A+': 'bg-sky-500', 'A': 'bg-indigo-500', 'B+': 'bg-amber-500' };
                        const color = barColor[gr.grade] || 'bg-slate-500';
                        return (
                          <div key={gr.subjectCode} className="grid grid-cols-4 items-center gap-2 text-xs">
                            <span className="font-bold text-slate-700 truncate">{gr.subjectName}</span>
                            <div className="col-span-2 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <div className={`h-full ${color}`} style={{ width: percent }}></div>
                            </div>
                            <div className="text-right font-mono text-slate-650 flex justify-end gap-3">
                              <span>Marks: <strong className="text-slate-800">{gr.totalMarks}</strong></span>
                              <span className="font-extrabold text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 w-8 text-center">{gr.grade}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Marksheet table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold">
                          <th className="p-3">Code</th>
                          <th className="p-3">Subject Name</th>
                          <th className="p-3">Credits</th>
                          <th className="p-3 text-center">Int Marks</th>
                          <th className="p-3 text-center">Ext Marks</th>
                          <th className="p-3 text-center">Total</th>
                          <th className="p-3 text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-mono">
                        {grades.map(gr => (
                          <tr key={gr.subjectCode} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{gr.subjectCode}</td>
                            <td className="p-3 font-sans text-slate-700 font-medium">{gr.subjectName}</td>
                            <td className="p-3">{gr.credits}</td>
                            <td className="p-3 text-center">{gr.internalMarks}</td>
                            <td className="p-3 text-center">{gr.externalMarks}</td>
                            <td className="p-3 text-center font-bold">{gr.totalMarks}</td>
                            <td className="p-3 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded font-black text-[10px] ${
                                gr.grade === 'O' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                  : gr.grade === 'A+' 
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              }`}>
                                {gr.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ------------ ATTENDANCE TAB ------------ */}
              {activeTab === 'attendance' && (
                <div className="space-y-6" id="student-attendance-tab">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Attendance Meter</h3>
                    <p className="text-xs text-slate-500">Live attendance ledger tracked class-wise dynamically.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ring gauge representation */}
                    <div className="p-5 border border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50 text-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Overall Attendance</span>
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" stroke="#e2e8f0" strokeWidth="3" fill="none" />
                          <circle cx="18" cy="18" r="16" stroke="#4f46e5" strokeWidth="3" strokeDasharray={`${overallAttendancePercentage}, 100`} strokeLinecap="round" fill="none" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                          <span className="text-xl font-bold text-slate-800">{overallAttendancePercentage}%</span>
                          <span className="text-[9px] font-black text-emerald-600 uppercase">Passed Gate</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                        College regulation mandates a minimum of <strong>75%</strong> for sitting the end semester examination.
                      </p>
                    </div>

                    {/* Historical Logs List */}
                    <div className="col-span-2 border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                      <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 border-b border-slate-200 text-left">
                        Daily Attendance Ledger
                      </div>
                      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[300px]">
                        {attendance.map((rec, idx) => (
                          <div key={idx} className="p-3 flex justify-between items-center text-xs">
                            <div className="text-left">
                              <span className="font-bold text-slate-800 font-sans block">{rec.subject}</span>
                              <span className="text-[10px] font-mono text-slate-400">Date: {rec.date} • Session: {rec.period}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] font-mono ${
                              rec.status === 'Present' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {rec.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------ TIMETABLE TAB ------------ */}
              {activeTab === 'timetable' && (
                <div className="space-y-6" id="student-timetable-tab">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Structured Class Timetable</h3>
                    <p className="text-xs text-slate-500">Day-wise hours schedule for B.Tech III Year II Semester B-Section.</p>
                  </div>

                  {/* Quick timetable representation */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg text-left">
                      <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-3">Daily Grid Planner</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 text-xs">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                          <div key={day} className="border border-slate-200 rounded-lg p-3 bg-white hover:border-indigo-400 transition cursor-pointer">
                            <span className="font-black text-slate-900 block border-b border-slate-105 pb-1 mb-2 text-center bg-slate-50 py-0.5 rounded font-sans uppercase text-[10px] tracking-wider">{day}</span>
                            <div className="space-y-2 text-[10px] font-mono text-slate-650">
                              <div className="flex justify-between">
                                <span className="font-semibold text-indigo-600">WT (9 AM)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-sky-600">CC (10 AM)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-rose-600 font-bold">AI (11:10 AM)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-teal-600">SEC (12:10 PM)</span>
                              </div>
                              <div className="border-t border-slate-100 pt-1 mt-1 font-bold text-center text-slate-400 font-sans">
                                After Lunch Lab
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------ FEES DUETS & PAYMENT ------------ */}
              {activeTab === 'fees' && (
                <div className="space-y-6" id="student-fees-tab">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Tuition &amp; Semester Dues</h3>
                    <p className="text-xs text-slate-500 font-medium">Verify pending dues ledger and discharge payments instantly.</p>
                  </div>

                  {/* Fees Ledger Grid */}
                  <div className="divide-y divide-slate-150 border border-slate-200 rounded-lg overflow-hidden">
                    {fees.map((fee, idx) => (
                      <div key={idx} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition">
                        <div className="text-left space-y-0.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase mb-1 ${
                            fee.status === 'Fully Paid' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : fee.status === 'Partially Paid' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {fee.status}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{fee.category}</h4>
                          <p className="text-[11px] font-mono text-slate-400">Term / Session Date Limit: {fee.dueDate}</p>
                        </div>

                        <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-2.5 md:pt-0">
                          <div className="text-right font-mono text-xs">
                            <span className="text-slate-500 font-sans block text-[10px]">Total: ₹{fee.totalAmount.toLocaleString()}</span>
                            <span className="font-extrabold text-slate-800 block">Paid: ₹{fee.paidAmount.toLocaleString()}</span>
                            {fee.totalAmount - fee.paidAmount > 0 && (
                              <span className="text-rose-600 font-black block text-[11px]">Due: ₹{(fee.totalAmount - fee.paidAmount).toLocaleString()}</span>
                            )}
                          </div>

                          {fee.totalAmount - fee.paidAmount > 0 ? (
                            <button
                              onClick={() => setPayModal({ isOpen: true, fee })}
                              className="bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 text-white font-bold text-xs px-4.5 py-2.2 rounded transition shadow-sm"
                            >
                              PAY NOW
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded">
                              <CheckCircle className="w-4 h-4" />
                              <span>CLEARED</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ------------ LIBRARY DESK ------------ */}
              {activeTab === 'library' && (
                <div className="space-y-6" id="student-library-tab">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Active Book Borrowings</h3>
                    <p className="text-xs text-slate-500">Check current index of titles in hand, issue limits, and overdue warnings.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {books.map(b => (
                      <div key={b.id} className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between hover:border-indigo-300 transition">
                        <div className="text-left space-y-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black ${
                              b.status === 'Borrowed' 
                                ? 'bg-sky-100 text-sky-800' 
                                : b.status === 'Overdue' 
                                ? 'bg-rose-100 text-rose-800 animate-pulse' 
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {b.status}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">ID: {b.id}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-850 leading-snug">{b.title}</h4>
                          <p className="text-[11px] text-slate-500">{b.author}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center font-mono text-[11px]">
                          <div>
                            <span className="text-slate-450 block text-[9.5px]">DUE LIMIT:</span>
                            <span className="font-bold text-slate-700">{b.dueDate}</span>
                          </div>
                          {b.fineAmount > 0 && (
                            <div className="text-right">
                              <span className="text-rose-500 block text-[9.5px] font-black flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> FINE ACCRUED
                              </span>
                              <span className="font-black text-rose-700">₹{b.fineAmount}</span>
                            </div>
                          )}
                          {b.status !== 'Returned' && (
                            <button
                              onClick={() => handleReturnBook(b.id)}
                              className="text-[10px] font-black bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 px-3 py-1.5 rounded transition uppercase"
                            >
                              RETURN BOOK
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fine policy notice */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs flex gap-2 text-left bg-orange-50/50">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <strong>Library Policy Notice:</strong> Delaying book returns past the stated limit accrues critical service fines at ₹2 per day. Ensure prompt disposal or re-issue.
                    </div>
                  </div>
                </div>
              )}

              {/* ------------ ANNOUNCEMENTS TAB ------------ */}
              {activeTab === 'announcements' && (
                <div className="space-y-6" id="student-announcements-tab">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">College Notice Board</h3>
                    <p className="text-xs text-slate-500">Official directives and schedules emitted by the central administration.</p>
                  </div>

                  <div className="space-y-4">
                    {announcements.filter(a => a.targetAudience === 'All' || a.targetAudience === 'Student').map(ann => (
                      <div key={ann.id} className="p-4 border border-slate-200 rounded-lg text-left bg-slate-50 hover:bg-slate-100/50 transition">
                        <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10px] uppercase">
                            Posted By: {ann.postedBy}
                          </span>
                          <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                            {ann.postedDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight mb-2">{ann.title}</h4>
                        <p className="text-xs text-slate-650 leading-relaxed font-sans">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ------------ FEES TRANSACTION DRAWER / MODAL ------------ */}
      <AnimatePresence>
        {payModal.isOpen && payModal.fee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="fee-receipt-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-w-md w-full"
            >
              {/* Receipt Header styling */}
              <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-5 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[9px] font-black tracking-widest block text-sky-200">PAYMENT RECEIPT CHANNELS</span>
                  <p className="text-md font-bold tracking-tight">University Fee Payment</p>
                </div>
                <button 
                  onClick={() => setPayModal({ isOpen: false, fee: null })}
                  className="text-white hover:text-sky-200 font-black text-sm p-1"
                >
                  ✕
                </button>
              </div>

              {/* Transaction contents */}
              <div className="p-6 space-y-4">
                {paymentSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                    <span className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg border border-emerald-200">
                      ✓
                    </span>
                    <h5 className="text-md font-bold text-slate-800">Transaction Successful!</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">₹{(payModal.fee.totalAmount - payModal.fee.paidAmount).toLocaleString()} updated instantly in educational portal books.</p>
                  </div>
                ) : (
                  <>
                    {/* Amount Block */}
                    <div className="bg-slate-50 border p-3.5 rounded-lg font-sans">
                      <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase mb-1">Dues Amount to Charge:</span>
                      <p className="text-xl font-mono font-bold text-slate-800">₹{(payModal.fee.totalAmount - payModal.fee.paidAmount).toLocaleString()}</p>
                      <span className="text-[11px] text-indigo-700 leading-none block font-semibold mt-1">Item: {payModal.fee.category}</span>
                    </div>

                    {/* Method Selecting */}
                    <div className="flex gap-2 font-semibold text-xs border-b border-slate-100 pb-3 justify-center">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`px-3 py-1.5 rounded-md ${paymentMethod === 'card' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}
                      >
                        Credit Card / Debit
                      </button>
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`px-3 py-1.5 rounded-md ${paymentMethod === 'upi' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}
                      >
                        BHIM UPI ID
                      </button>
                    </div>

                    {/* Input specifics */}
                    <div className="space-y-3 font-semibold text-xs text-slate-550">
                      {paymentMethod === 'card' ? (
                        <>
                          <div className="text-left space-y-1">
                            <label className="text-slate-500 font-sans uppercase text-[10px]">Card Number</label>
                            <input 
                              type="text" 
                              maxLength={19}
                              value={cardNo}
                              onChange={(e) => setCardNo(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                              placeholder="4125 5652 1412 5556" 
                              className="w-full text-sm font-mono border border-slate-205 px-3 py-2 rounded-lg bg-slate-50 font-medium"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-left">
                            <div className="space-y-1">
                              <label className="text-slate-500 font-sans uppercase text-[10px]">Expiry (MM/YY)</label>
                              <input type="text" placeholder="12/29" className="w-full text-sm font-mono border border-slate-205 px-3 py-2 rounded-lg bg-slate-50 font-medium text-center" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-500 font-sans uppercase text-[10px]">CVV Security</label>
                              <input 
                                type="password" 
                                maxLength={3}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                placeholder="***" 
                                className="w-full text-sm font-mono border border-slate-205 px-3 py-2 rounded-lg bg-slate-50 font-medium text-center" 
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-left space-y-1">
                          <label className="text-slate-500 font-sans uppercase text-[10px]">Unified Payments Interface (UPI ID)</label>
                          <input 
                            type="text" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="vignanportal@ybl" 
                            className="w-full text-sm font-mono border border-slate-205 px-3 py-2 rounded-lg bg-slate-50 font-medium" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePayFee}
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm py-2.5 rounded-lg cursor-pointer shadow-md shadow-indigo-100 tracking-wide"
                    >
                      SECURE AUTHORIZE PAY
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
