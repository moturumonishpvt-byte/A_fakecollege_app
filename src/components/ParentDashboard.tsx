import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Users, BookOpen, Clock, Activity, 
  CreditCard, Award, Bell, MessageSquare, Send, 
  AlertTriangle, CheckCircle, LogOut, ChevronRight
} from 'lucide-react';
import { StudentProfile, GradeRecord, AttendanceRecord, FeeStructure, Message, Announcement } from '../types';
import { INITIAL_STUDENT, INITIAL_GRADES, INITIAL_ATTENDANCE, INITIAL_FEES, INITIAL_ANNOUNCEMENTS, INITIAL_MESSAGES } from '../data';

interface ParentDashboardProps {
  onLogout: () => void;
}

type TabType = 'overview' | 'progress' | 'attendance' | 'fees' | 'consultation' | 'notices';

export default function ParentDashboard({ onLogout }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  
  // LocalStorage synchronizer
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Fee payment state
  const [payFeeItem, setPayFeeItem] = useState<FeeStructure | null>(null);
  const [paidStatus, setPaidStatus] = useState(false);
  const [upiId, setUpiId] = useState('');

  // Send message state
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  // Sync state from LocalStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('vignan_portal_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGrades(parsed.grades || INITIAL_GRADES);
        setAttendance(parsed.attendance || INITIAL_ATTENDANCE);
        setFees(parsed.fees || INITIAL_FEES);
        setMessages(parsed.messages || INITIAL_MESSAGES);
        setAnnouncements(parsed.announcements || INITIAL_ANNOUNCEMENTS);
      } catch (e) {
        syncDefaults();
      }
    } else {
      syncDefaults();
    }
  }, []);

  const syncDefaults = () => {
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setFees(INITIAL_FEES);
    setMessages(INITIAL_MESSAGES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
  };

  const saveToLocalStorage = (newFees?: FeeStructure[], newMessages?: Message[]) => {
    const savedState = localStorage.getItem('vignan_portal_state');
    let currentState: any = {};
    if (savedState) {
      try { currentState = JSON.parse(savedState); } catch(e) {}
    }

    const updatedState = {
      ...currentState,
      grades: grades.length ? grades : INITIAL_GRADES,
      attendance: attendance.length ? attendance : INITIAL_ATTENDANCE,
      books: currentState.books || [],
      fees: newFees || (fees.length ? fees : INITIAL_FEES),
      announcements: announcements.length ? announcements : INITIAL_ANNOUNCEMENTS,
      messages: newMessages || (messages.length ? messages : INITIAL_MESSAGES)
    };
    localStorage.setItem('vignan_portal_state', JSON.stringify(updatedState));
  };

  // Process fee payment
  const handlePayFee = () => {
    if (!payFeeItem) return;
    
    setPaidStatus(true);
    setTimeout(() => {
      const updatedFees = fees.map(f => {
        if (f.category === payFeeItem.category) {
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

      setTimeout(() => {
        setPayFeeItem(null);
        setPaidStatus(false);
        setUpiId('');
      }, 1500);
    }, 1500);
  };

  // Submit direct query to faculty (Dr Ramesh Employee)
  const handleSendQuery = () => {
    if (!msgSubject.trim() || !msgContent.trim()) return;

    const newMsg: Message = {
      id: `msg_cust_${Date.now()}`,
      senderId: 'parent_1',
      senderName: student.guardianName,
      senderRole: 'Parent',
      receiverId: 'employee_1', // Subject coord Dr. Ramesh Prasad
      subject: msgSubject,
      content: msgContent,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false
    };

    const updatedMessages = [newMsg, ...messages];
    setMessages(updatedMessages);
    saveToLocalStorage(undefined, updatedMessages);

    setMsgSubject('');
    setMsgContent('');
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
    }, 2000);
  };

  const overallAttendancePercentage = (() => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    return Math.round((presentCount / attendance.length) * 1000) / 10;
  })();

  const gpa = (() => {
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

  const menuItems = [
    { id: 'overview', name: 'Dashboard Overview', icon: Users },
    { id: 'progress', name: "Ward's Progress", icon: Award },
    { id: 'attendance', name: 'Live attendance tracker', icon: Activity },
    { id: 'fees', name: 'Fulfill Tuition Fees', icon: CreditCard },
    { id: 'consultation', name: 'Faculty Consultation Room', icon: MessageSquare, count: messages.filter(m => m.receiverId === 'parent_1' && !m.read).length },
    { id: 'notices', name: 'Circular bulletins', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="parent-portal-root">
      
      {/* Dynamic Parent Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-sky-900 shadow-md text-white" id="parent-meta-header">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-sky-600/30 border-2 border-sky-400 p-1 flex items-center justify-center font-black text-white text-lg font-mono">
                PR
              </div>
              <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-sky-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="text-left font-sans">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-sky-400 px-2.5 py-0.5 rounded bg-sky-950 border border-sky-950 inline-block mb-1">
                Parent Account
              </span>
              <h2 className="text-lg md:text-xl font-bold tracking-tight">{student.guardianName}</h2>
              <p className="text-[11px] md:text-xs text-sky-200 mt-0.5 flex items-center gap-1.5 leading-none">
                Ward Tracker Name: <strong className="text-white hover:underline cursor-pointer">{student.name} ({student.rollNo})</strong>
              </p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 transition-all duration-250 text-rose-200 hover:text-white px-4 py-2 rounded-md font-semibold text-xs shadow-sm"
            id="parent-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT PORTAL</span>
          </button>

        </div>
      </div>

      {/* Main navigation layouts */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6" id="parent-grid">
        
        {/* Navigation panel */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-1">Navigation Panel</h3>
            <nav className="flex flex-col gap-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-md font-semibold text-xs transition-all duration-200 text-left ${
                      isSelected 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-100' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.count ? (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        isSelected ? 'bg-white text-sky-700' : 'bg-rose-100 text-rose-700'
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

          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hidden lg:block text-left text-xs space-y-3">
            <h4 className="text-xs font-black text-slate-500 uppercase">My Ward Profile</h4>
            <div className="space-y-2 font-semibold text-slate-650">
              <p><span className="text-slate-450 font-normal">Roll Number:</span> {student.rollNo}</p>
              <p><span className="text-slate-450 font-normal">Branch:</span> {student.branch}</p>
              <p><span className="text-slate-450 font-normal">Year / Sem:</span> III Year - II Semester</p>
              <p><span className="text-slate-450 font-normal">Registered Phone:</span> {student.phone}</p>
            </div>
          </div>
        </div>

        {/* Workspace Canvas */}
        <div className="lg:col-span-3 min-h-[500px]">
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
                <div className="space-y-6" id="parent-overview">
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Parent Portal Workspace</h3>
                    <p className="text-xs text-slate-500 font-medium">Verify your ward's daily records and discharge online fee channels securely.</p>
                  </div>

                  {/* High level visual charts list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ring gauge overall */}
                    <div className="bg-slate-50 border rounded-lg p-4 flex justify-between items-center text-left">
                      <div className="space-y-1">
                        <span className="text-[9.5px] uppercase font-black text-slate-400 block font-bold leading-none">Class Attendance</span>
                        <h4 className="text-2xl font-bold tracking-tight text-slate-800">{overallAttendancePercentage}%</h4>
                        <span className="text-[10.5px] text-emerald-600 block font-semibold">✓ Meets College Criteria</span>
                      </div>
                      <div className="w-12 h-12 text-slate-350 bg-slate-200/50 rounded-full flex items-center justify-center font-bold text-[14px]">
                        {overallAttendancePercentage >= 75 ? '✓' : '⚠'}
                      </div>
                    </div>

                    <div className="bg-slate-50 border rounded-lg p-4 flex justify-between items-center text-left">
                      <div className="space-y-1">
                        <span className="text-[9.5px] uppercase font-black text-slate-400 block font-bold leading-none">Avg GPA Marks</span>
                        <h4 className="text-2xl font-bold tracking-tight text-slate-800">{gpa} / 10</h4>
                        <span className="text-[10.5px] text-indigo-600 block font-semibold">Grade Score O / A+</span>
                      </div>
                      <Award className="w-12 h-12 text-indigo-200 pointer-events-none" />
                    </div>

                    <div className="bg-slate-50 border rounded-lg p-4 flex justify-between items-center text-left">
                      {(() => {
                        const amount = fees.reduce((acc, f) => acc + (f.status !== 'Fully Paid' ? (f.totalAmount - f.paidAmount) : 0), 0);
                        return (
                          <div className="space-y-1">
                            <span className="text-[9.5px] uppercase font-black text-slate-400 block font-bold leading-none">Tuition &amp; Hall Dues</span>
                            <h4 className="text-2xl font-bold tracking-tight text-slate-800">₹{amount.toLocaleString()}</h4>
                            <span className="text-[10.5px] text-amber-600 block font-semibold">
                              {amount > 0 ? 'Dues Pending Discharge' : 'Cleared / No Dues'}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Bulletins notices board */}
                  <div className="p-4 border bg-rose-50/20 border-rose-100 rounded-lg text-left">
                    <h4 className="text-xs font-black text-rose-800 uppercase flex items-center gap-1.5 mb-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>IMPORTANT COLLEGE DIRECTIVE FOR PARENTS</span>
                    </h4>
                    <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                      Please note: The Hall Ticket release criteria for the final III-II semester terminal exams on June 25th requires clearing all tuition fee balances. Click on the tuition dues card to complete payment securely online.
                    </p>
                  </div>
                </div>
              )}

              {/* ------------ ACADEMIC PROGRESS TRACKER ------------ */}
              {activeTab === 'progress' && (
                <div className="space-y-6" id="parent-academic-progress">
                  <div className="flex justify-between items-center flex-wrap gap-2 text-left">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Academic Milestone Progress</h3>
                      <p className="text-xs text-slate-500 font-medium">Verify historical GPA scoring and active exam grade sheets.</p>
                    </div>
                    <div className="bg-slate-50 hover:bg-slate-100 border px-3 py-1.5 rounded text-xs font-bold font-mono">
                      Calculated Semester GPA: <span className="text-sky-600">{gpa}</span>
                    </div>
                  </div>

                  {/* Custom GPA Chart progression */}
                  <div className="p-4 border border-slate-205 rounded-lg bg-slate-50 text-left">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">GPA Trajectory (Previous Semesters)</h4>
                    <div className="flex items-end justify-between max-w-xl h-36 font-mono text-center">
                      {[
                        { sem: 'Sem 1', gpa: '8.10' },
                        { sem: 'Sem 2', gpa: '8.25' },
                        { sem: 'Sem 3', gpa: '8.34' },
                        { sem: 'Sem 4', gpa: '8.20' },
                        { sem: 'Sem 5', gpa: '8.38' },
                        { sem: 'Sem VI (Act)', gpa: gpa }
                      ].map((item, idx) => {
                        const heightPercent = `${(parseFloat(item.gpa) / 10) * 100}%`;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <span className="text-[10px] font-black opacity-0 group-hover:opacity-100 transition duration-150 text-sky-700 bg-sky-50 px-1 rounded">
                              {item.gpa}
                            </span>
                            <div 
                              className="w-8 md:w-11 bg-sky-500 rounded-t-sm hover:bg-sky-600 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom cursor-pointer shadow-xs" 
                              style={{ height: heightPercent }}
                            ></div>
                            <span className="text-[10px] font-sans font-bold text-slate-500">{item.sem}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* List of active subjects scorecard */}
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-650 font-bold uppercase">
                          <th className="p-3">Subject Code</th>
                          <th className="p-3">Syllabus Title</th>
                          <th className="p-3 text-center">Internals Marks</th>
                          <th className="p-3 text-center">Externals Marks</th>
                          <th className="p-3 text-center">Total Marks</th>
                          <th className="p-3 text-center">System Grade Conversion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-mono">
                        {grades.map((gr, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold font-mono text-slate-850">{gr.subjectCode}</td>
                            <td className="p-3 font-medium font-sans text-slate-700">{gr.subjectName}</td>
                            <td className="p-3 text-center">{gr.internalMarks}</td>
                            <td className="p-3 text-center">{gr.externalMarks}</td>
                            <td className="p-3 text-center font-bold">{gr.totalMarks}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded font-black bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10.5px]">
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

              {/* ------------ ATTENDANCE MONIOTR ------------ */}
              {activeTab === 'attendance' && (
                <div className="space-y-6" id="parent-attendance-monitor">
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Class Attendance Tracker</h3>
                    <p className="text-xs text-slate-500 font-medium">Daily status log representing daily presence ledger of your ward.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ring meter representation */}
                    <div className="p-5 border border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50 text-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">CONSOLIDATED METRICS</span>
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" stroke="#e2e8f0" strokeWidth="3" fill="none" />
                          <circle cx="18" cy="18" r="16" stroke="#0ea5e9" strokeWidth="3" strokeDasharray={`${overallAttendancePercentage}, 100`} strokeLinecap="round" fill="none" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                          <span className="text-xl font-bold text-slate-800">{overallAttendancePercentage}%</span>
                          <span className="text-[9px] font-black text-sky-600 uppercase">Passed Gate</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                        Class attendance is compiled and committed live by coordinate professors. minimum <strong>75%</strong> is required for exams.
                      </p>
                    </div>

                    {/* Historical log list */}
                    <div className="col-span-2 border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                      <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-705 border-b border-slate-200 text-left">
                        WARD LECLURE LEDGER LOG
                      </div>
                      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[300px]">
                        {attendance.map((rec, idx) => (
                          <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                            <div className="text-left font-sans">
                              <span className="font-bold text-slate-800 block">{rec.subject}</span>
                              <span className="text-[10px] font-mono text-slate-400">Date Limit: {rec.date} • Period Hour: {rec.period}</span>
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

              {/* ------------ PORTAL FEE SYSTEM ------------ */}
              {activeTab === 'fees' && (
                <div className="space-y-6" id="parent-fees">
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Tuition &amp; Library Fee Settlement</h3>
                    <p className="text-xs text-slate-500 font-medium font-sans">Disburse academic balances direct to bank ledger books.</p>
                  </div>

                  <div className="divide-y border border-slate-205 rounded-xl overflow-hidden shadow-xs">
                    {fees.map((fee, idx) => {
                      const due = fee.totalAmount - fee.paidAmount;
                      return (
                        <div key={idx} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition">
                          <div className="text-left font-sans space-y-1">
                            <span className={`inline-block px-2.2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              fee.status === 'Fully Paid' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {fee.status}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{fee.category}</h4>
                            <p className="text-[10px] text-slate-400 font-mono">Date Limit: {fee.dueDate}</p>
                          </div>

                          <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                            <div className="text-right font-mono text-xs text-slate-650">
                              <span className="block text-[10px] text-slate-450 font-sans">Total: ₹{fee.totalAmount.toLocaleString()}</span>
                              <span className="block font-bold text-slate-800">Paid: ₹{fee.paidAmount.toLocaleString()}</span>
                              {due > 0 && <span className="block font-black text-rose-600">Due: ₹{due.toLocaleString()}</span>}
                            </div>

                            {due > 0 ? (
                              <button
                                onClick={() => {
                                  setPayFeeItem(fee);
                                  setPaidStatus(false);
                                }}
                                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4.5 py-2.2 rounded transition shadow-sm cursor-pointer"
                              >
                                DISBURSE DUE
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded">
                                <CheckCircle className="w-4 h-4 animate-pulse" />
                                <span>PAID</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ------------ DIRECT CONSULTATION ------------ */}
              {activeTab === 'consultation' && (
                <div className="space-y-6" id="parent-consultation">
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Direct Faculty Consultation Room</h3>
                    <p className="text-xs text-slate-500 font-medium">Message core coordinate teacher (Dr. Ramesh Prasad) about student attendance, performance or leave.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* Send box */}
                    <div className="p-4 bg-slate-50 border rounded-lg space-y-4 text-xs font-semibold text-slate-600">
                      <h4 className="text-xs font-bold text-slate-505 uppercase">Draft Inquiry Memo</h4>
                      <div className="space-y-1">
                        <label className="text-slate-450 uppercase tracking-widest text-[9.5px]">Memo Subject</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Leave Application: Sick leave regarding Aarav" 
                          value={msgSubject}
                          onChange={(e) => setMsgSubject(e.target.value)}
                          className="w-full bg-white border border-slate-205 px-3 py-2 rounded-md font-medium text-slate-850 focus:border-sky-500" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-450 uppercase tracking-widest text-[9.5px]">Explanation Message</label>
                        <textarea 
                          rows={4}
                          placeholder="Provide details about sick dates or academic performance query..." 
                          value={msgContent}
                          onChange={(e) => setMsgContent(e.target.value)}
                          className="w-full bg-white border border-slate-205 px-3 py-2 rounded-md font-medium text-slate-850" 
                        />
                      </div>

                      <div>
                        {msgSent && (
                          <span className="text-[11px] text-emerald-600 font-bold block mb-2 bg-emerald-50 border border-emerald-250 p-2.5 rounded">
                            ✓ Message sent successfully to Dr. Ramesh Prasad!
                          </span>
                        )}
                        <button
                          onClick={handleSendQuery}
                          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-2.5 rounded-md cursor-pointer transition shadow-md shadow-sky-50"
                        >
                          TRANSMIT CONSULTATION MEMO
                        </button>
                      </div>
                    </div>

                    {/* Consulting historical threads */}
                    <div className="space-y-3 font-semibold text-xs text-slate-600 max-h-[380px] overflow-y-auto">
                      <h4 className="text-xs font-black text-slate-450 uppercase">Live Messenger Feed</h4>
                      {messages.map((msg, idx) => {
                        const isMeSender = msg.senderRole === 'Parent';
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 border rounded-lg ${
                              isMeSender ? 'bg-slate-50 border-slate-200' : 'bg-sky-50/20 border-sky-100 ml-6'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-slate-400">
                              <span className="font-sans font-bold text-sky-800">
                                {isMeSender ? 'Sent Memo' : 'Dr. Ramesh Prasad Response'}
                              </span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <h5 className="font-bold text-slate-900">{msg.subject}</h5>
                            <p className="text-slate-650 font-medium leading-relaxed font-sans mt-0.5">{msg.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------ BULLETIN POLICY TAB ------------ */}
              {activeTab === 'notices' && (
                <div className="space-y-6" id="parent-circulars">
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">University Circular Bulletins</h3>
                    <p className="text-xs text-slate-500 font-medium">Verify official regulatory guidelines published by the Dean office.</p>
                  </div>

                  <div className="space-y-4">
                    {announcements.filter(a => a.targetAudience === 'All' || a.targetAudience === 'Parent').map((ann, idx) => (
                      <div key={idx} className="p-4 border rounded-xl bg-slate-50 text-left">
                        <div className="flex justify-between font-mono text-xs mb-2">
                          <span className="px-2 py-0.5 bg-slate-200 rounded font-bold text-[10px] text-slate-700">
                            Posted By: {ann.postedBy}
                          </span>
                          <span className="text-slate-400 font-sans">{ann.postedDate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{ann.title}</h4>
                        <p className="text-xs text-slate-650 leading-relaxed font-medium mt-1.5 font-sans">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ------------ FEES OUTLET DRAWER ------------ */}
      <AnimatePresence>
        {payFeeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-w-sm w-full font-semibold text-xs"
            >
              <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-5 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[10px] font-black tracking-widest block text-sky-200">PORTAL DISCHARGE TERMINAL</span>
                  <p className="text-md font-bold tracking-tight">Fulfill tuition fees online</p>
                </div>
                <button onClick={() => setPayFeeItem(null)} className="text-white hover:text-sky-200 text-sm font-black p-1">✕</button>
              </div>

              <div className="p-6 space-y-4">
                {paidStatus ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                    <span className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow">✓</span>
                    <h5 className="text-md font-bold text-slate-800">Fee discharge completed!</h5>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">₹{(payFeeItem.totalAmount - payFeeItem.paidAmount).toLocaleString()} recorded instantly in college register books.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50 border p-3.5 rounded-lg text-left">
                      <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase mb-1">Dues Amount to Charge:</span>
                      <p className="text-xl font-mono font-bold text-slate-850">₹{(payFeeItem.totalAmount - payFeeItem.paidAmount).toLocaleString()}</p>
                      <span className="text-[11px] text-sky-700 block font-semibold mt-1">Item: {payFeeItem.category}</span>
                    </div>

                    <div className="text-left space-y-1">
                      <label className="text-slate-500 uppercase tracking-widest text-[9.5px]">Disburse via BHIM UPI ID</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="vignanparent@okaxis" 
                        className="w-full text-sm font-mono border border-slate-205 px-3 py-2 rounded-lg bg-slate-52 font-medium focus:border-sky-505" 
                      />
                    </div>

                    <button
                      onClick={handlePayFee}
                      className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm py-2.5 rounded-lg cursor-pointer shadow-md shadow-sky-50"
                    >
                      SECURE AUTHORIZE FEE
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
