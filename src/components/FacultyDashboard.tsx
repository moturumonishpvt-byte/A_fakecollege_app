import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, CheckSquare, ListTodo, PlusCircle, 
  MessageSquare, BookOpen, Clock, Calendar, 
  UserCheck, ClipboardList, Send, LogOut, Check, ChevronRight,
  Search, Shield, Trophy
} from 'lucide-react';
import { EmployeeProfile, GradeRecord, AttendanceRecord, Announcement, Message } from '../types';
import { INITIAL_STUDENT, INITIAL_EMPLOYEE, INITIAL_GRADES, INITIAL_ATTENDANCE, INITIAL_BOOKS, INITIAL_FEES, INITIAL_ANNOUNCEMENTS, INITIAL_MESSAGES } from '../data';

interface FacultyDashboardProps {
  onLogout: () => void;
  is12027?: boolean;
}

type TabType = 'dashboard' | 'academics' | 'examinations' | 'correspondence' | 'admin';

const ACADEMICS_SIDEBAR = [
  { id: 'academic_register', label: 'ACADEMIC REGISTER', arrows: false },
  { id: 'assignments', label: 'ASSIGNMENTS', arrows: true },
  { id: 'attendance_reports', label: 'ATTENDANCE REPORTS', arrows: true },
  { id: 'circular_entry', label: 'CIRCULAR ENTRY', arrows: false },
  { id: 'counseling', label: 'COUNSELING', arrows: true },
  { id: 'current_time_table', label: 'CURRENT TIME TABLE', arrows: false },
  { id: 'disciplinary_action', label: 'DISCIPLINARY ACTION', arrows: true },
  { id: 'faculty', label: 'FACULTY', arrows: true },
  { id: 'internal_marks', label: 'INTERNAL MARKS', arrows: true },
  { id: 'leaves', label: 'LEAVES', arrows: true },
  { id: 'lesson_plan', label: 'LESSON PLAN', arrows: true },
  { id: 'student', label: 'STUDENT', arrows: true },
  { id: 'student_profile', label: 'STUDENT PROFILE', arrows: false },
  { id: 'teaching_plan', label: 'TEACHING PLAN', arrows: false },
  { id: 'teaching_plan_verify', label: 'TEACHING PLAN VERIFY', arrows: false },
  { id: 'teaching_schedule', label: 'TEACHING SCHEDULE', arrows: false },
  { id: 'attendance', label: 'ATTENDANCE', arrows: false },
  { id: 'circulars', label: 'CIRCULARS', arrows: false },
  { id: 'library_books', label: 'LIBRARY BOOKS', arrows: false },
  { id: 'leave_history', label: 'LEAVE HISTORY', arrows: false },
  { id: 'payslip', label: 'PAYSLIP', arrows: false },
];

const MOCK_ACADEMIC_REPORTS = {
  'DEVC': [
    { date: '02/06/2026', period: 'Period 1', topic: 'Digital Electronics Fundamentals & Quantization', present: 54, total: 60, percentage: '90.0%', status: 'Audited' },
    { date: '04/06/2026', period: 'Period 2', topic: 'Logic Circuit Building Blocks & Multiplexing', present: 52, total: 60, percentage: '86.6%', status: 'Audited' },
    { date: '08/06/2026', period: 'Period 1', topic: 'Sequential Gates Design & Flip-Flop Loops', present: 56, total: 60, percentage: '93.3%', status: 'Audited' },
    { date: '11/06/2026', period: 'Period 3', topic: 'Asynchronous Counters & Registers Architecture', present: 53, total: 60, percentage: '88.3%', status: 'Audited' },
    { date: '15/06/2026', period: 'Period 4', topic: 'Digital-to-Analog Conversions and Real-world Application', present: 55, total: 60, percentage: '91.6%', status: 'Locked' },
  ],
  'PCBD': [
    { date: '01/06/2026', period: 'Period 1', topic: 'Overview of PCB Designing Workflows', present: 58, total: 60, percentage: '96.6%', status: 'Audited' },
    { date: '05/06/2026', period: 'Period 3', topic: 'Schematic Capture Tools and Rules Checkers', present: 55, total: 60, percentage: '91.6%', status: 'Audited' },
    { date: '09/06/2026', period: 'Period 2', topic: 'Routing and Placement of Passive Elements', present: 56, total: 60, percentage: '93.3%', status: 'Audited' },
    { date: '12/06/2026', period: 'Period 4', topic: 'Copper Pours and Gerber Files Exporting', present: 51, total: 60, percentage: '85.0%', status: 'Locked' },
  ],
  'MCL': [
    { date: '03/06/2026', period: 'Period 2', topic: '8051 Microcontroller PIN Architecture', present: 57, total: 60, percentage: '95.0%', status: 'Audited' },
    { date: '07/06/2026', period: 'Period 4', topic: 'Assembly Language instruction sets', present: 55, total: 60, percentage: '91.6%', status: 'Audited' },
    { date: '10/06/2026', period: 'Period 1', topic: 'Timers and Counters Configuration Register', present: 54, total: 60, percentage: '90.0%', status: 'Locked' },
  ],
  'IC': [
    { date: '02/06/2026', period: 'Period 3', topic: 'Operational Amplifier Basic Configurations', present: 53, total: 60, percentage: '88.3%', status: 'Audited' },
    { date: '06/06/2026', period: 'Period 1', topic: 'Feedback loops, Gain stability & Slew Rate', present: 56, total: 60, percentage: '93.3%', status: 'Audited' },
    { date: '13/06/2026', period: 'Period 2', topic: '555 Timer Monostable Multivibrator circuit', present: 50, total: 60, percentage: '83.3%', status: 'Locked' },
  ]
};

const DEMO_STUDENT_LIST = [
  { id: 'student_1', name: 'Aarav Reddy', rollNo: '21L31A0501' },
  { id: 'student_2', name: 'Rahul Sharma', rollNo: '21L31A0502' },
  { id: 'student_3', name: 'Divya Sri', rollNo: '21L31A0503' },
  { id: 'student_4', name: 'Senthil Kumar', rollNo: '21L31A0504' },
  { id: 'student_5', name: 'Meera Nair', rollNo: '21L31A0505' }
];

const FACULTY_SUBMENU_OPTIONS = [
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'attendance', label: 'ATTENDANCE' },
  { id: 'conferences', label: 'CONFERENCES' },
  { id: 'day_class_work', label: 'DAY CLASS WORK' },
  { id: 'research_papers', label: 'RESEARCH PAPERS' },
  { id: 'set_paper', label: 'SET PAPER' },
  { id: 'workshops', label: 'WORKSHOPS' }
];

const FACULTY_ATTENDANCE_STUDENTS = [
  { rollNo: '23L31A4401', name: 'ADITYA VARMA G.' },
  { rollNo: '23L31A4402', name: 'AKHILA CHINTA' },
  { rollNo: '23L31A4403', name: 'ANIL KUMAR MUPPIDI' },
  { rollNo: '23L31A4404', name: 'ARCHANA KUNDRAPU' },
  { rollNo: '23L31A4405', name: 'BHANU PRASAD NEELI' },
  { rollNo: '23L31A4406', name: 'BHAVANA SREE MEDISETTI' },
  { rollNo: '23L31A4407', name: 'CHANDU NAIDU YELAMANCHILI' },
  { rollNo: '23L31A4408', name: 'DEVI PRASAD KOTHARA' },
  { rollNo: '23L31A4409', name: 'DILEEP KUMAR SEEPANA' },
  { rollNo: '23L31A4410', name: 'DIVYA TEJA SAKETI' },
  { rollNo: '23L31A4411', name: 'DURGA PRASAD PENTAPATI' },
  { rollNo: '23L31A4412', name: 'GANESH NAIDU GORLE' },
  { rollNo: '23L31A4413', name: 'HARISH LALAM' },
  { rollNo: '23L31A4414', name: 'HARITHA TUMMALA' },
  { rollNo: '23L31A4415', name: 'HEMANTH KUMAR CHEEPURUPALLI' },
  { rollNo: '23L31A4416', name: 'JAHNAVI KANAKALA' },
  { rollNo: '23L31A4417', name: 'KARTHIK SOMA' },
  { rollNo: '23L31A4418', name: 'KAVYA SRI DONTI' },
  { rollNo: '23L31A4419', name: 'KIRAN KUMAR KOTLA' },
  { rollNo: '23L31A4420', name: 'LAKSHMI NARAYANA PONDARA' },
  { rollNo: '23L31A4421', name: 'LAKSHMI PRIYANKA RAMA' },
  { rollNo: '23L31A4422', name: 'LAVANYA GIDUTURI' },
  { rollNo: '23L31A4423', name: 'LOKESH DARA' },
  { rollNo: '23L31A4424', name: 'MADHAVI BODEPUDI' },
  { rollNo: '23L31A4425', name: 'MANOHAR JAMI' },
  { rollNo: '23L31A4426', name: 'MANOJ KUMAR REDDI' },
  { rollNo: '23L31A4427', name: 'MOHAN RAO YALLA' },
  { rollNo: '23L31A4428', name: 'NAGA RAJU THOTA' },
  { rollNo: '23L31A4429', name: 'NAVEEN NALLA' },
  { rollNo: '23L31A4430', name: 'NIKHIL DEV MADHU' },
  { rollNo: '23L31A4431', name: 'PAVANI KORADA' },
  { rollNo: '23L31A4432', name: 'PRASANNA GUDIVADA' },
  { rollNo: '23L31A4433', name: 'RAKESH BONU' },
  { rollNo: '23L31A4434', name: 'RAMA RAO TETALI' },
  { rollNo: '23L31A4435', name: 'ROHITH KUMAR GUDALA' },
  { rollNo: '23L31A4436', name: 'SAI CHARAN PAMPANA' },
  { rollNo: '23L31A4437', name: 'SAI KIRAN VARDHANAPU' },
  { rollNo: '23L31A4438', name: 'SAI PRASAD NEKKANTI' },
  { rollNo: '23L31A4439', name: 'SAI RAM MYLA' },
  { rollNo: '23L31A4440', name: 'SAI SWAROOP KOPANATHI' },
  { rollNo: '23L31A4441', name: 'SANDEEP VYSYARAJU' },
  { rollNo: '23L31A4442', name: 'SATISH DEVARAPU' },
  { rollNo: '23L31A4443', name: 'SIVANAND BALI' },
  { rollNo: '23L31A4444', name: 'SIVA GOPI GUMMIDI' },
  { rollNo: '23L31A4445', name: 'SNEHA BANDARU' },
  { rollNo: '23L31A4446', name: 'SNEHA LATHA VADDADI' },
  { rollNo: '23L31A4447', name: 'SRAVAN KUMAR PEDDADA' },
  { rollNo: '23L31A4448', name: 'SRAVANI KANDREGULA' },
  { rollNo: '23L31A4449', name: 'SRIKANTH YELLAPU' },
  { rollNo: '23L31A4450', name: 'SURESH ALLU' },
  { rollNo: '23L31A4451', name: 'SWATHI AKULA' },
  { rollNo: '23L31A4452', name: 'TARUN REDDY BOTHSA' },
  { rollNo: '23L31A4453', name: 'TARUN SEELA' },
  { rollNo: '23L31A4454', name: 'TEJASWINI REDDI' },
  { rollNo: '23L31A4455', name: 'VARSHINI METLA' },
  { rollNo: '23L31A4456', name: 'VENKATESH SEEPANA' },
  { rollNo: '23L31A4457', name: 'VIJAY KRISHNA THOTA' },
  { rollNo: '23L31A4458', name: 'VINEETH MADEM' },
  { rollNo: '23L31A4459', name: 'YASWANTH YERRA' },
  { rollNo: '23L31A4460', name: 'BHANU SREE METISE' }
];

export default function FacultyDashboard({ onLogout, is12027 }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Custom or standard employee profile state
  const [faculty, setFaculty] = useState<EmployeeProfile>(() => {
    if (is12027) {
      return {
        id: 'employee_12027',
        name: 'PATHALA VENKATA SAI CHARISHMA',
        employeeId: '12027',
        designation: 'Assistant Professor',
        department: 'Electronics & Communication Engineering',
        email: 'charishma.pvs@viit.edu.in',
        phone: '+91 94905 12027',
        subjectsTaught: [
          'PCB: 3 ECE-A',
          'PCB: 3 ECE-C',
          'PCB: 3 ECE-B'
        ],
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
      };
    }
    return INITIAL_EMPLOYEE;
  });

  // Real LocalStorage Sync for other tabs helper
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Attendance Register states (Academics Tab)
  const [activeSubject, setActiveSubject] = useState(faculty.subjectsTaught[0]);
  const [activeSection, setActiveSection] = useState('III-B.tech CSE-A');
  const [lecturePeriod, setLecturePeriod] = useState(1);
  const [attendanceRegister, setAttendanceRegister] = useState<Record<string, 'Present' | 'Absent'>>({
    'student_1': 'Present',
    'student_2': 'Present',
    'student_3': 'Absent',
    'student_4': 'Present',
    'student_5': 'Present'
  });
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  // Academics new custom states matching screenshot
  const [selectedSubTab, setSelectedSubTab] = useState('academic_register');
  const [courseInp, setCourseInp] = useState('B.Tech');
  const [semesterInp, setSemesterInp] = useState('II Semester');
  const [branchInp, setBranchInp] = useState('Civil Engineering');
  const [sectionInp, setSectionInp] = useState('Section-A');
  const [wiseType, setWiseType] = useState<'subject' | 'student'>('subject');
  const [subjectInp, setSubjectInp] = useState('DEVC');
  const [startDateInp, setStartDateInp] = useState('01/06/2026');
  const [endDateInp, setEndDateInp] = useState('15/06/2026');
  const [showReport, setShowReport] = useState(false);

  // States for Faculty Submenu & Class Attendance View
  const [showFacultyMenu, setShowFacultyMenu] = useState(false);
  const [facultySubSelected, setFacultySubSelected] = useState<'achievements' | 'attendance' | 'conferences' | 'day_class_work' | 'research_papers' | 'set_paper' | 'workshops'>('attendance');
  const [facultyShowAttendanceList, setFacultyShowAttendanceList] = useState(false);
  const [facultyAttendanceType, setFacultyAttendanceType] = useState<'Regular' | 'Substitute'>('Regular');
  const [facultyAttendanceDate, setFacultyAttendanceDate] = useState('15/06/2026');
  const [facultyCourse, setFacultyCourse] = useState('B.Tech');
  const [facultySemester, setFacultySemester] = useState('I Semester');
  const [facultyBranch, setFacultyBranch] = useState('Civil Engineering');
  const [facultySection, setFacultySection] = useState('Section-A');
  const [studentAttendanceState, setStudentAttendanceState] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [facultyAttendanceSubmittedReport, setFacultyAttendanceSubmittedReport] = useState<boolean>(false);

  // Marks sheets state (Examinations Tab)
  const [selectedStudent, setSelectedStudent] = useState('student_1');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('IT-321');
  const [internalInp, setInternalInp] = useState('26');
  const [externalInp, setExternalInp] = useState('53');
  const [marksSubmitted, setMarksSubmitted] = useState(false);

  // New bulletin state (Correspondence Tab)
  const [bulletinTitle, setBulletinTitle] = useState('');
  const [bulletinContent, setBulletinContent] = useState('');
  const [bulletinAudience, setBulletinAudience] = useState<'All' | 'Student' | 'Parent'>('All');
  const [bulletinSubmitted, setBulletinSubmitted] = useState(false);

  // Message compose response state (Admin / Parent consultation Tab)
  const [replyActiveId, setReplyActiveId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Local Storage loaders
  useEffect(() => {
    const savedState = localStorage.getItem('vignan_portal_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGrades(parsed.grades || INITIAL_GRADES);
        setAttendance(parsed.attendance || INITIAL_ATTENDANCE);
        setAnnouncements(parsed.announcements || INITIAL_ANNOUNCEMENTS);
        setMessages(parsed.messages || INITIAL_MESSAGES);
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
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setMessages(INITIAL_MESSAGES);
  };

  const saveToLocalStorage = (newGrades?: GradeRecord[], newAttendance?: AttendanceRecord[], newAnnouncements?: Announcement[], newMessages?: Message[]) => {
    const savedState = localStorage.getItem('vignan_portal_state');
    let currentState: any = {};
    if (savedState) {
      try { currentState = JSON.parse(savedState); } catch(e) {}
    }
    
    const updatedState = {
      ...currentState,
      grades: newGrades || (grades.length ? grades : INITIAL_GRADES),
      attendance: newAttendance || (attendance.length ? attendance : INITIAL_ATTENDANCE),
      announcements: newAnnouncements || (announcements.length ? announcements : INITIAL_ANNOUNCEMENTS),
      messages: newMessages || (messages.length ? messages : INITIAL_MESSAGES)
    };
    localStorage.setItem('vignan_portal_state', JSON.stringify(updatedState));
  };

  const handleFileAttendance = () => {
    const dateFormatted = new Date().toISOString().split('T')[0];
    const newRecords: AttendanceRecord[] = [];

    Object.entries(attendanceRegister).forEach(([stId, status]) => {
      const stDetails = DEMO_STUDENT_LIST.find(s => s.id === stId);
      if (stDetails) {
        newRecords.push({
          date: dateFormatted,
          subject: activeSubject,
          status: status as 'Present' | 'Absent',
          period: lecturePeriod
        });
      }
    });

    const updatedAttendance = [...newRecords, ...attendance];
    setAttendance(updatedAttendance);
    saveToLocalStorage(undefined, updatedAttendance);

    setAttendanceSubmitted(true);
    setTimeout(() => {
      setAttendanceSubmitted(false);
    }, 2000);
  };

  const handleUpdateMarks = () => {
    const intVal = parseInt(internalInp) || 0;
    const extVal = parseInt(externalInp) || 0;
    const totVal = intVal + extVal;
    
    let gradeCal: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' = 'C';
    if (totVal >= 90) gradeCal = 'O';
    else if (totVal >= 80) gradeCal = 'A+';
    else if (totVal >= 70) gradeCal = 'A';
    else if (totVal >= 60) gradeCal = 'B+';
    else if (totVal >= 50) gradeCal = 'B';
    else if (totVal < 40) gradeCal = 'F';

    const updatedGrades = grades.map(gr => {
      if (gr.subjectCode === selectedSubjectCode) {
        return {
          ...gr,
          internalMarks: intVal,
          externalMarks: extVal,
          totalMarks: totVal,
          grade: gradeCal
        };
      }
      return gr;
    });

    setGrades(updatedGrades);
    saveToLocalStorage(updatedGrades);

    setMarksSubmitted(true);
    setTimeout(() => {
      setMarksSubmitted(false);
    }, 2000);
  };

  const handlePostBulletin = () => {
    if (!bulletinTitle.trim() || !bulletinContent.trim()) return;

    const newAnn: Announcement = {
      id: `ann_cust_${Date.now()}`,
      title: bulletinTitle,
      content: bulletinContent,
      postedBy: faculty.designation + ' ' + faculty.name,
      postedDate: new Date().toISOString().split('T')[0],
      targetAudience: bulletinAudience as any
    };

    const updatedAnn = [newAnn, ...announcements];
    setAnnouncements(updatedAnn);
    saveToLocalStorage(undefined, undefined, updatedAnn);

    setBulletinTitle('');
    setBulletinContent('');
    setBulletinSubmitted(true);
    setTimeout(() => {
      setBulletinSubmitted(false);
    }, 2000);
  };

  const handleSendMessageReply = (originalMsg: Message) => {
    if (!replyText.trim()) return;

    const newReply: Message = {
      id: `msg_cust_${Date.now()}`,
      senderId: faculty.id,
      senderName: faculty.name,
      senderRole: 'Employee',
      receiverId: originalMsg.senderId,
      subject: `RE: ${originalMsg.subject}`,
      content: replyText,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: true
    };

    const updatedMessages = messages.map(m => {
      if (m.id === originalMsg.id) return { ...m, read: true };
      return m;
    });

    const finalMessages = [newReply, ...updatedMessages];
    setMessages(finalMessages);
    saveToLocalStorage(undefined, undefined, undefined, finalMessages);

    setReplyText('');
    setReplyActiveId(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none" id="vignan-faculty-portal-root">
      
      {/* 1. College Header Banner (Matches screenshot branding and accreditation badges) */}
      <header className="bg-white border-b border-gray-200 py-4 px-6" id="college-master-header">
        <div className="max-w-[1250px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Logo and Name Block */}
          <div className="flex items-center gap-4 text-left">
            {/* VIGNAN'S circular segmented wheel logo vector */}
            <div className="w-18 h-18 flex-shrink-0 relative">
              <svg className="w-full h-full text-[#1565c0]" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#1565c0" strokeWidth="3" />
                <circle cx="50" cy="50" r="39" fill="none" stroke="#1a237e" strokeWidth="1.5" />
                <g stroke="#1565c0" strokeWidth="2" fill="none">
                  <line x1="15" y1="50" x2="85" y2="50" />
                  <line x1="50" y1="15" x2="50" y2="85" />
                  <line x1="25" y1="25" x2="75" y2="75" />
                  <line x1="25" y1="75" x2="75" y2="25" />
                </g>
                <circle cx="50" cy="50" r="15" fill="#1565c0" />
                <polygon points="50,38 53,47 62,50 53,53 50,62 47,53 38,50 47,47" fill="white" />
              </svg>
            </div>
            
            {/* Elegant multi-tier institution names in typography */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-3xl font-black text-red-600 tracking-tight leading-none">VIGNAN'S</h1>
                <div className="text-[12px] font-extrabold text-slate-800 uppercase tracking-tight">
                  INSTITUTE OF INFORMATION TECHNOLOGY
                  <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 leading-none">(AUTONOMOUS)</span>
                </div>
              </div>
              <p className="text-[10px] text-emerald-700 font-extrabold leading-tight">
                (Approved by AICTE-New Delhi &amp; Affiliated to JNTU-GV, Vizianagaram)
              </p>
              <p className="text-[9.5px] text-slate-600 font-bold font-sans">
                Beside VSEZ, Duvvada, Vadlapudi Post, Gajuwaka, Visakhapatnam - 530 049.
              </p>
            </div>
          </div>

          {/* Right side accrediting boards badges */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center lg:justify-end">
            {/* Autonomous badge */}
            <div className="flex flex-col items-center border border-gray-200 bg-slate-50 p-1.5 rounded shadow-2xs text-center min-w-[55px]">
              <Shield className="w-5 h-5 text-red-650" />
              <span className="text-[6.5px] font-black text-slate-700 mt-0.5 uppercase leading-none">Autonomous</span>
            </div>

            {/* NBA badge */}
            <div className="flex flex-col items-center border border-gray-200 bg-slate-50 p-1.5 rounded shadow-2xs text-center min-w-[55px]">
              <div className="w-5 h-5 bg-[#00acc1] text-white rounded-full flex items-center justify-center font-black text-[8px]">NBA</div>
              <span className="text-[6.5px] font-black text-slate-700 mt-0.5 uppercase leading-none">Accredited</span>
            </div>

            {/* NAAC A+ seal */}
            <div className="flex flex-col items-center border border-yellow-250 bg-[#fffde7] p-1.5 rounded shadow-2xs text-center min-w-[65px]">
              <div className="w-5 h-5 bg-[#fbc02d] text-slate-900 rounded-full flex items-center justify-center font-black text-[9px] shadow-sm">A+</div>
              <span className="text-[6.5px] font-black text-slate-800 mt-0.5 uppercase leading-none">NAAC A+</span>
            </div>

            {/* NIRF */}
            <div className="flex flex-col items-center border border-gray-200 bg-slate-50 p-1 rounded text-center min-w-[55px]">
              <span className="text-[9px] font-extrabold text-blue-900 leading-none">nirf</span>
              <span className="text-[7px] font-black text-slate-600 leading-none mt-0.5">Rank 201-300</span>
            </div>

            {/* Institution Innovation Council */}
            <div className="flex items-center gap-1 border border-orange-200 bg-orange-50 p-1 rounded max-w-[100px] text-left">
              <Trophy className="w-4 h-4 text-orange-600" />
              <div className="leading-none">
                <span className="text-[6px] font-bold text-orange-850 block uppercase leading-none">Institution's</span>
                <span className="text-[6px] font-black text-slate-800 block uppercase leading-none mt-0.5">Innovation Council</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Menu Navigation Bar (Matches screenshot layout, sets active ERP Tabs) */}
      <div className="bg-white border-b border-gray-200" id="college-master-nav">
        <div className="max-w-[1250px] mx-auto py-2 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[11px] font-black uppercase text-blue-800">
          
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`flex items-center gap-1.5 cursor-pointer transition hover:text-[#f4511e] ${activeTab === 'admin' ? 'text-[#f4511e]' : 'text-blue-800'}`}
          >
            <span className="text-[8px] text-[#f4511e]">▶</span> ADMIN
          </button>

          <button 
            onClick={() => setActiveTab('examinations')} 
            className={`flex items-center gap-1.5 cursor-pointer transition hover:text-[#f4511e] ${activeTab === 'examinations' ? 'text-[#f4511e]' : 'text-blue-800'}`}
          >
            <span className="text-[8px] text-[#f4511e]">▶</span> EXAMINATIONS
          </button>

          <button 
            onClick={() => setActiveTab('academics')} 
            className={`flex items-center gap-1.5 cursor-pointer transition hover:text-[#f4511e] ${activeTab === 'academics' ? 'text-[#f4511e]' : 'text-blue-800'}`}
          >
            <span className="text-[8px] text-[#f4511e]">▶</span> ACADEMICS
          </button>

          <button 
            onClick={() => setActiveTab('correspondence')} 
            className={`flex items-center gap-1.5 cursor-pointer transition hover:text-[#f4511e] ${activeTab === 'correspondence' ? 'text-[#f4511e]' : 'text-blue-800'}`}
          >
            <span className="text-[8px] text-[#f4511e]">▶</span> CORRESPONDENCE
          </button>

          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-1.5 cursor-pointer transition hover:text-[#f4511e] ${activeTab === 'dashboard' ? 'text-[#f4511e]' : 'text-blue-800'}`}
          >
            <span className="text-[8px] text-[#f4511e]">▶</span> Dashboard
          </button>

        </div>
      </div>

      {/* 3. Welcome / Search light-blue bar row */}
      <div className="bg-[#abd5f7] border-b border-gray-300 py-1.5 px-6" id="user-toolbar-row">
        <div className="max-w-[1250px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-bold text-blue-950">
          
          <div className="uppercase tracking-wide font-extrabold flex items-center gap-1.5">
            <span>Welcome</span>
            <span className="text-blue-900 font-black">{faculty.name}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Search Box */}
            <div className="flex items-center gap-1">
              <div className="bg-[#1e2722] border border-gray-500 rounded px-1.5 py-0.5 flex items-center">
                <input 
                  type="text" 
                  className="bg-transparent text-white text-[10px] outline-none w-32 h-5 font-mono px-1"
                  placeholder=""
                />
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase h-6 px-3 rounded shadow-xs flex items-center transition">
                Search
              </button>
            </div>

            <button className="text-blue-800 hover:text-red-700 hover:underline cursor-pointer">
              Change Password
            </button>

            <button 
              onClick={onLogout} 
              className="text-blue-800 hover:text-red-700 hover:underline cursor-pointer font-black"
            >
              Log Out
            </button>
          </div>

        </div>
      </div>

      {/* 4. Main Body Workspace */}
      <main className="flex-1 max-w-[1250px] w-full mx-auto px-6 py-4" id="main-content-layout">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            
            {/* ================================== TAB A: DASHBOARD VIEW (SCREENSHOT) ================================== */}
            {activeTab === 'dashboard' && (
              <div className="text-left space-y-6" id="dashboard-view-panel">
                
                {/* Heading dashboard with line */}
                <div>
                  <h2 className="text-lg font-black text-blue-900 font-sans tracking-wide">DASHBOARD</h2>
                  <div className="border-b border-dashed border-gray-300 mt-2"></div>
                </div>

                {/* Grid row 1 of cards (Below 75% attendance, Absentees, Leave History) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: Below 75% attendance students */}
                  <div className="border border-gray-250 rounded-md bg-white p-4 shadow-3xs flex flex-col justify-between min-h-[260px]">
                    <h3 className="text-[11.5px] font-black text-center text-slate-800 mb-3 uppercase tracking-wide">
                      Below 75% attendance students
                    </h3>
                    
                    <div className="flex items-center justify-around flex-1">
                      {/* High fidelity SVG pie chart */}
                      <div className="relative">
                        <svg className="w-32 h-32 drop-shadow-2xs" viewBox="0 0 100 100">
                          {/* Segment 71: Blue (Right side) - angle ~ 120deg */}
                          <path d="M 50 50 L 50 10 A 40 40 0 0 1 84.6 70 Z" fill="#1565c0" stroke="white" strokeWidth="1" />
                          
                          {/* Segment 70: Red (Bottom) - angle ~ 120deg */}
                          <path d="M 50 50 L 84.6 70 A 40 40 0 0 1 15.4 70 Z" fill="#d32f2f" stroke="white" strokeWidth="1" />
                          
                          {/* Segment 72: Orange/Yellow (Left) - angle ~ 120deg */}
                          <path d="M 50 50 L 15.4 70 A 40 40 0 0 1 50 10 Z" fill="#ff8f00" stroke="white" strokeWidth="1" />
                          
                          {/* Numerical labels inside circles */}
                          <text x="68" y="38" fill="white" fontSize="7" fontWeight="black" textAnchor="middle">71</text>
                          <text x="50" y="74" fill="white" fontSize="7" fontWeight="black" textAnchor="middle">70</text>
                          <text x="32" y="38" fill="white" fontSize="7" fontWeight="black" textAnchor="middle">72</text>
                        </svg>
                      </div>

                      {/* Legends */}
                      <div className="text-[9.5px] font-black text-slate-700 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1565c0] inline-block"></span>
                          <span>PCB: 3 ECE-A</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#d32f2f] inline-block"></span>
                          <span>PCB: 3 ECE-C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff8f00] inline-block"></span>
                          <span>PCB: 3 ECE-B</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Absentees on 14/06/2026 */}
                  <div className="border border-gray-250 rounded-md bg-white p-4 shadow-3xs flex flex-col min-h-[260px]">
                    <h3 className="text-[11.5px] font-black text-center text-slate-800 mb-2 uppercase tracking-wide">
                      Absentees on 14/06/2026
                    </h3>
                    <div className="flex-1 flex items-center justify-center border border-dashed border-gray-100 rounded bg-slate-50">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No Absentees Logged</p>
                    </div>
                  </div>

                  {/* Card 3: Leave History */}
                  <div className="border border-gray-250 rounded-md bg-white p-4 shadow-3xs flex flex-col justify-between min-h-[260px]">
                    <h3 className="text-[11.5px] font-black text-center text-slate-800 mb-2 uppercase tracking-wide">
                      Leave History
                    </h3>
                    
                    {/* SVG Bar Chart for Leaves */}
                    <div className="flex-1 flex flex-col justify-between mt-2">
                      <div className="h-32 w-full flex items-end relative border-b border-l border-gray-300">
                        
                        {/* Horizontal background grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                          <div className="border-t border-gray-400 w-full"></div>
                          <div className="border-t border-gray-400 w-full"></div>
                          <div className="border-t border-gray-400 w-full"></div>
                          <div className="border-t border-gray-400 w-full"></div>
                          <div className="border-t border-gray-400 w-full"></div>
                        </div>

                        {/* y-axis helper values labels */}
                        <div className="absolute -left-7 inset-y-0 flex flex-col justify-between text-[7px] font-bold text-slate-500 select-none text-right pr-1">
                          <span>20.0</span>
                          <span>15.0</span>
                          <span>10.0</span>
                          <span>5.0</span>
                          <span>0.0</span>
                        </div>

                        {/* Bars for CL (Opening = 10, Used = 0) and ML (Opening = 8, Used = 0) */}
                        <div className="w-full h-full flex justify-around items-end px-2 z-10">
                          {/* SCL */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>
                          
                          {/* CL: 10 Opening leaves */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-[#1565c0] rounded-t-xs" style={{ height: '50%' }} title="CL Opening: 10"></div>
                          </div>
                          
                          {/* ML: 8 Opening leaves */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-[#1565c0] rounded-t-xs" style={{ height: '40%' }} title="ML Opening: 8"></div>
                          </div>

                          {/* AL */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>

                          {/* PL */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>

                          {/* OT */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>

                          {/* EL */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>

                          {/* SV */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>

                          {/* Mat */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>

                          {/* OD */}
                          <div className="flex flex-col items-center justify-end w-1/10 h-full">
                            <div className="w-2.5 bg-gray-200" style={{ height: '0%' }}></div>
                          </div>
                        </div>

                      </div>

                      {/* x-axis categories */}
                      <div className="flex justify-around text-[7.5px] font-black text-slate-700 px-2 mt-1 select-none">
                        <span className="w-1/10 text-center">SCL</span>
                        <span className="w-1/10 text-center text-blue-700">CL</span>
                        <span className="w-1/10 text-center text-blue-700">ML</span>
                        <span className="w-1/10 text-center">AL</span>
                        <span className="w-1/10 text-center">PL</span>
                        <span className="w-1/10 text-center">OT</span>
                        <span className="w-1/10 text-center">EL</span>
                        <span className="w-1/10 text-center">SV</span>
                        <span className="w-1/10 text-center">Mat</span>
                        <span className="w-1/10 text-center">OD</span>
                      </div>

                      {/* Legend below */}
                      <div className="flex justify-center items-center gap-4 text-[8.5px] font-black text-slate-800 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-2 bg-[#1565c0] inline-block"></span>
                          <span>Opening Leaves</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-2 bg-[#d32f2f] inline-block"></span>
                          <span>Used Leaves</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Grid row 2 of cards (Lesson Plan Status, Pink placeholder highlight card) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                  
                  {/* Lesson Plan Status Horizontal Card (Spans 2 columns) */}
                  <div className="lg:col-span-2 border border-gray-250 rounded-md bg-white p-4 shadow-3xs flex flex-col justify-between min-h-[240px]">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2 px-1">
                      <h3 className="text-[11.5px] font-black text-slate-800 uppercase tracking-wide">
                        Lesson Plan Status
                      </h3>
                      
                      {/* Status Legends */}
                      <div className="flex items-center gap-3 text-[9px] font-black">
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 bg-[#1565c0] inline-block"></span>
                          <span>On Time</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 bg-[#d32f2f] inline-block"></span>
                          <span>Leading</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 bg-[#ffa000] inline-block"></span>
                          <span>Lagging</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 flex flex-col justify-between mt-1">
                      <div className="h-36 w-full flex items-end relative border-b border-l border-gray-300">
                        {/* Horizontal background grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                          <div className="border-t border-gray-405 w-full"></div>
                          <div className="border-t border-gray-405 w-full"></div>
                          <div className="border-t border-gray-405 w-full"></div>
                          <div className="border-t border-gray-405 w-full"></div>
                          <div className="border-t border-gray-405 w-full"></div>
                        </div>

                        {/* y-axis indicators */}
                        <div className="absolute -left-5 inset-y-0 flex flex-col justify-between text-[7px] font-bold text-slate-500 select-none text-right pr-1">
                          <span>70</span>
                          <span>50</span>
                          <span>30</span>
                          <span>10</span>
                          <span>0</span>
                        </div>

                        {/* Three Triple-Bar categories */}
                        <div className="w-full h-full flex justify-around items-end px-4 z-10">
                          
                          {/* Category A: PCB: 3 ECE-A */}
                          <div className="flex items-end justify-center gap-1.5 w-1/3 h-full pb-0.5">
                            <div className="w-3.5 bg-[#1565c0] rounded-t-xs" style={{ height: '65%' }} title="A - On Time: 45"></div>
                            <div className="w-3.5 bg-[#d32f2f] rounded-t-xs" style={{ height: '20%' }} title="A - Leading: 14"></div>
                            <div className="w-3.5 bg-[#ffa000] rounded-t-xs" style={{ height: '15%' }} title="A - Lagging: 10"></div>
                          </div>

                          {/* Category B: PCB: 3 ECE-C */}
                          <div className="flex items-end justify-center gap-1.5 w-1/3 h-full pb-0.5">
                            <div className="w-3.5 bg-[#1565c0] rounded-t-xs" style={{ height: '70%' }} title="C - On Time: 50"></div>
                            <div className="w-3.5 bg-[#d32f2f] rounded-t-xs" style={{ height: '15%' }} title="C - Leading: 10"></div>
                            <div className="w-3.5 bg-[#ffa000] rounded-t-xs" style={{ height: '15%' }} title="C - Lagging: 10"></div>
                          </div>

                          {/* Category C: PCB: 3 ECE-B */}
                          <div className="flex items-end justify-center gap-1.5 w-1/3 h-full pb-0.5">
                            <div className="w-3.5 bg-[#1565c0] rounded-t-xs" style={{ height: '55%' }} title="B - On Time: 38"></div>
                            <div className="w-3.5 bg-[#d32f2f] rounded-t-xs" style={{ height: '25%' }} title="B - Leading: 18"></div>
                            <div className="w-3.5 bg-[#ffa000] rounded-t-xs" style={{ height: '20%' }} title="B - Lagging: 14"></div>
                          </div>

                        </div>
                      </div>

                      {/* x-axis classes labels */}
                      <div className="flex justify-around text-[8.5px] font-black text-slate-700 mt-1 px-4">
                        <span className="w-1/3 text-center">PCB: 3 ECE-A</span>
                        <span className="w-1/3 text-center">PCB: 3 ECE-C</span>
                        <span className="w-1/3 text-center">PCB: 3 ECE-B</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Adjacent colored placeholder card (Right side of row 2) */}
                  <div className="border border-gray-250 bg-[#ffebee] p-4 shadow-3xs flex flex-col justify-center items-center min-h-[240px] rounded-md">
                    <p className="text-[10px] text-red-800 font-bold uppercase tracking-wider text-center px-4 leading-relaxed">
                      Notice: Course files for Semester VI subjects must be locked in for Central Assessment Audit by the HOD.
                    </p>
                  </div>

                </div>

                {/* 5. Vision and Mission texts matching screenshot bottom layout */}
                <div className="space-y-6 pt-6 border-t border-gray-200 text-slate-800">
                  
                  {/* Vision section */}
                  <div className="space-y-1.5">
                    <h4 className="text-[12.5px] font-black uppercase text-blue-900 border-b-2 border-red-600 inline-block tracking-wider font-sans leading-none">
                      VISION
                    </h4>
                    <p className="text-[11px] leading-relaxed text-slate-700 font-medium font-sans">
                      We envision to be a recognized leader in technical education and shall aim at national excellence by creating competent and socially conscious technical man power for the current and future industrial requirements and development of the nation.
                    </p>
                  </div>

                  {/* Mission section */}
                  <div className="space-y-2">
                    <h4 className="text-[12.5px] font-black uppercase text-blue-900 border-b-2 border-red-600 inline-block tracking-wider font-sans leading-none">
                      MISSION
                    </h4>
                    <ul className="list-disc pl-5 text-[11px] font-medium text-slate-700 space-y-1.5 leading-tight font-sans">
                      <li>Introducing innovative practices of teaching and learning.</li>
                      <li>Undertaking research and development in thrust areas.</li>
                      <li>Continuously collaborating with industry.</li>
                      <li>Promoting strong set of ethical values.</li>
                      <li>Serving the surrounding region and the nation at large.</li>
                    </ul>
                  </div>

                </div>

              </div>
            )}


            {/* ================================== TAB B: ACADEMICS VIEW (DUAL-PANE LAYOUT MATCHING SCREENSHOT) ================================== */}
            {activeTab === 'academics' && (
              <div className="flex flex-col lg:flex-row gap-6 text-left" id="academics-view-main">
                
                {/* Left Sidebar Segment (Lists all academic subheadings) */}
                <div className="w-full lg:w-[250px] border border-[#a2c3eb] rounded bg-white flex-shrink-0 self-start" id="academics-sidebar">
                  {/* Sidebar Header "ACADEMICS" */}
                  <div className="bg-[#428bca] text-white font-black text-[12px] py-2 px-3 text-center uppercase tracking-wider">
                    ACADEMICS
                  </div>
                  
                  {/* List of sub-tabs */}
                  <div className="flex flex-col text-[11px] font-bold divide-y divide-gray-150" id="academics-sidebar-navigation">
                    {ACADEMICS_SIDEBAR.map((item) => (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => {
                            setSelectedSubTab(item.id);
                            if (item.id === 'faculty') {
                              setShowFacultyMenu(prev => !prev);
                            } else {
                              setShowFacultyMenu(false);
                            }
                          }}
                          className={`w-full flex items-center justify-between py-2 px-3 hover:bg-[#e6f2fd] transition cursor-pointer text-left select-none text-[11px] font-black ${
                            selectedSubTab === item.id 
                              ? 'bg-[#e6f2fd] text-blue-900 border-l-4 border-blue-600 font-extrabold' 
                              : 'text-blue-805'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {/* Miniature grid icon box representing the bullet */}
                            <div className="w-4 h-4 border border-[#a2c3eb] bg-[#eef6fe] flex items-center justify-center rounded-xs flex-shrink-0">
                              <div className="w-1.5 h-1.5 bg-[#428bca] rounded-xs"></div>
                            </div>
                            <span className="uppercase text-[11px] leading-tight font-sans text-blue-800">{item.label}</span>
                          </div>
                          {item.arrows && (
                            <span className="text-orange-550 font-black text-[10px] tracking-tighter text-[#f4511e]">≫</span>
                          )}
                        </button>

                        {/* Floating submenu dropdown aligned neatly to the right representing the Vignan portal popup */}
                        {item.id === 'faculty' && showFacultyMenu && (
                          <div 
                            className="absolute left-[98%] top-0 z-50 w-48 bg-white border border-[#a2c3eb] shadow-lg flex flex-col text-[10.5px] font-bold divide-y divide-gray-150 text-left"
                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                          >
                            {FACULTY_SUBMENU_OPTIONS.map((subOpt) => (
                              <button
                                key={subOpt.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFacultySubSelected(subOpt.id as any);
                                  setSelectedSubTab('faculty');
                                  setShowFacultyMenu(false);
                                  if (subOpt.id === 'attendance') {
                                    setFacultyShowAttendanceList(false);
                                    setFacultyAttendanceSubmittedReport(false);
                                  }
                                }}
                                className={`w-full flex items-center gap-2.5 py-2 px-3 hover:bg-[#33b5e5] hover:text-white text-[10.2px] text-blue-800 transition text-left cursor-pointer font-black border-l-2 ${
                                  facultySubSelected === subOpt.id && selectedSubTab === 'faculty'
                                    ? 'bg-[#e6f2fd] text-blue-900 border-blue-500'
                                    : 'border-transparent'
                                }`}
                              >
                                <div className="w-3.5 h-3.5 border border-[#a2c3eb] bg-[#eef6fe] flex items-center justify-center rounded-xs flex-shrink-0">
                                  <div className="w-1.5 h-1.5 bg-[#428bca] rounded-xs"></div>
                                </div>
                                <span className="uppercase font-sans tracking-wide">{subOpt.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Interactive Panels */}
                <div className="flex-1 bg-white min-h-[500px]" id="academics-right-workspace">
                  
                  {selectedSubTab === 'academic_register' ? (
                    <div className="space-y-6" id="academic-register-container">
                      {/* Header with dashed border */}
                      <div>
                        <h2 className="text-[13.5px] font-black text-blue-900 font-sans tracking-wide uppercase">
                          ACADEMIC REGISTER
                        </h2>
                        <div className="border-b border-dashed border-gray-300 mt-2 mb-6"></div>
                      </div>

                      {/* Dropdown variables form matching layout exactly */}
                      <div className="max-w-[700px] space-y-4 text-[11.5px] text-slate-800 font-bold">
                        
                        {/* 1. Course selection line */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-right text-slate-700 font-sans pr-2">Course:</label>
                          <select 
                            value={courseInp}
                            onChange={(e) => setCourseInp(e.target.value)}
                            className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-48 h-8 font-sans font-bold"
                          >
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="MBA">MBA</option>
                            <option value="MCA">MCA</option>
                          </select>
                        </div>

                        {/* 2. Semester selection line */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-right text-slate-700 font-sans pr-2">Semester:</label>
                          <select 
                            value={semesterInp}
                            onChange={(e) => setSemesterInp(e.target.value)}
                            className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-48 h-8 font-sans font-bold"
                          >
                            <option value="II Semester">II Semester</option>
                            <option value="I Semester">I Semester</option>
                            <option value="III Semester">III Semester</option>
                            <option value="IV Semester">IV Semester</option>
                            <option value="V Semester">V Semester</option>
                            <option value="VI Semester">VI Semester</option>
                            <option value="VII Semester">VII Semester</option>
                            <option value="VIII Semester">VIII Semester</option>
                          </select>
                        </div>

                        {/* 3. Branch selection line */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-right text-slate-700 font-sans pr-2">Branch:</label>
                          <select 
                            value={branchInp}
                            onChange={(e) => setBranchInp(e.target.value)}
                            className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-72 h-8 font-sans font-bold"
                          >
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                            <option value="Computer Science Engineering">Computer Science Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                          </select>
                        </div>

                        {/* 4. Section selection line */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-right text-slate-700 font-sans pr-2">Section:</label>
                          <select 
                            value={sectionInp}
                            onChange={(e) => setSectionInp(e.target.value)}
                            className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-40 h-8 font-sans font-bold"
                          >
                            <option value="Section-A">Section-A</option>
                            <option value="Section-B">Section-B</option>
                            <option value="Section-C">Section-C</option>
                          </select>
                        </div>

                        {/* 5. Radio Buttons for Wise choices */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <div></div>
                          <div className="flex items-center gap-6 text-[11.5px]">
                            <label className="flex items-center gap-2 cursor-pointer font-sans select-none">
                              <input 
                                type="radio" 
                                name="viewWiseType" 
                                checked={wiseType === 'subject'}
                                onChange={() => setWiseType('subject')}
                                className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" 
                              />
                              <span>Subject Wise</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-sans select-none">
                              <input 
                                type="radio" 
                                name="viewWiseType"
                                checked={wiseType === 'student'}
                                onChange={() => setWiseType('student')} 
                                className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" 
                              />
                              <span>Student Wise</span>
                            </label>
                          </div>
                        </div>

                        {/* 6. Subject selection line */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-right text-slate-700 font-sans pr-2">Subject:</label>
                          <select 
                            value={subjectInp}
                            onChange={(e) => setSubjectInp(e.target.value)}
                            className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-48 h-8 font-sans font-bold"
                          >
                            <option value="DEVC">DEVC</option>
                            <option value="PCBD">PCBD</option>
                            <option value="MCL">MCL</option>
                            <option value="IC">IC</option>
                          </select>
                        </div>

                        {/* 7. Date Range selector fields with black boxes and terracotta calendar buttons */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-right text-slate-700 font-sans pr-2">Date Range:</label>
                          <div className="flex items-center gap-2 flex-wrap">
                            
                            {/* Start date box */}
                            <div className="flex items-center">
                              <input 
                                type="text"
                                value={startDateInp}
                                onChange={(e) => setStartDateInp(e.target.value)}
                                className="bg-[#010101] text-white hover:bg-slate-900 transition font-mono text-[11.5px] px-2 py-1 text-center font-bold tracking-wide outline-none w-28 h-7 rounded-l"
                              />
                              <button className="bg-[#f4511e] hover:bg-[#e64a19] text-white w-7 h-7 flex items-center justify-center rounded-r border-l border-orange-700 transition cursor-pointer" title="Select Date">
                                <span className="text-[10px]">📅</span>
                              </button>
                            </div>

                            <span className="text-slate-650 font-bold px-1 text-[11px] font-sans">To</span>

                            {/* End date box */}
                            <div className="flex items-center">
                              <input 
                                type="text"
                                value={endDateInp}
                                onChange={(e) => setEndDateInp(e.target.value)}
                                className="bg-[#010101] text-white hover:bg-slate-900 transition font-mono text-[11.5px] px-2 py-1 text-center font-bold tracking-wide outline-none w-28 h-7 rounded-l"
                              />
                              <button className="bg-[#f4511e] hover:bg-[#e64a19] text-white w-7 h-7 flex items-center justify-center rounded-r border-l border-orange-700 transition cursor-pointer" title="Select Date">
                                <span className="text-[10px]">📅</span>
                              </button>
                            </div>

                          </div>
                        </div>

                        {/* 8. Action button line */}
                        <div className="grid grid-cols-[140px_1fr] gap-4 pt-2">
                          <div></div>
                          <div>
                            <button
                              onClick={() => {
                                setShowReport(true);
                              }}
                              className="bg-[#33b5e5] hover:bg-[#0099cc] text-white font-extrabold text-[12px] px-5 py-2 hover:shadow transition uppercase cursor-pointer rounded-xs"
                            >
                              Show
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Dynamic Academic Details Table (Shown when showReport is true) */}
                      <AnimatePresence>
                        {showReport && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="pt-8 border-t border-gray-150 text-[11px] font-bold text-slate-700 font-sans"
                            id="report-table-section"
                          >
                            <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
                              <h3 className="text-blue-900 uppercase font-bold text-[12px]">
                                Roll Register Report Ledgers ({subjectInp})
                              </h3>
                              <p className="text-[10px] text-slate-500 font-normal">
                                Range: <span className="font-mono font-bold text-slate-700">{startDateInp}</span> to <span className="font-mono font-bold text-slate-700">{endDateInp}</span>
                              </p>
                            </div>

                            <div className="border border-gray-200 rounded overflow-hidden shadow-2xs">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-[#eef6fe] text-blue-950 text-[11.5px] font-bold border-b border-gray-200">
                                    <th className="py-2.5 px-3 border-r border-gray-200">S.No</th>
                                    <th className="py-2.5 px-3 border-r border-gray-200">Date</th>
                                    <th className="py-2.5 px-3 border-r border-gray-200 text-center">Period</th>
                                    <th className="py-2.5 px-4 border-r border-gray-200">Topic Handled / Chapter</th>
                                    <th className="py-2.5 px-3 border-r border-gray-200 text-center">Strength (Present / Total)</th>
                                    <th className="py-2.5 px-3 border-r border-gray-200 text-center">Ratio %</th>
                                    <th className="py-2.5 px-3 text-center">Audit Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150">
                                  {MOCK_ACADEMIC_REPORTS[subjectInp as keyof typeof MOCK_ACADEMIC_REPORTS]?.map((rep, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition">
                                      <td className="py-2 px-3 border-r border-gray-200 font-mono text-[10px]">{idx + 1}</td>
                                      <td className="py-2 px-3 border-r border-gray-200 font-mono text-[10.5px]">{rep.date}</td>
                                      <td className="py-2 px-3 border-r border-gray-200 font-mono text-[10.5px] text-center">{rep.period}</td>
                                      <td className="py-2 px-4 border-r border-gray-200 text-slate-800 font-medium text-[11px]">{rep.topic}</td>
                                      <td className="py-2 px-3 border-r border-gray-200 text-center font-mono">{rep.present} / {rep.total}</td>
                                      <td className="py-2 px-3 border-r border-gray-200 text-center font-mono text-emerald-700 font-bold">{rep.percentage}</td>
                                      <td className="py-2 px-3 text-center">
                                        <span className="bg-emerald-50 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded border border-emerald-200 uppercase font-black tracking-wider shadow-3xs">
                                          {rep.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  ) : selectedSubTab === 'faculty' ? (
                    facultySubSelected === 'attendance' ? (
                      <div className="space-y-6" id="faculty-class-attendance-container">
                        {/* Title of class attendance */}
                        <div>
                          <h2 className="text-[13.5px] font-black text-blue-900 font-sans tracking-wide uppercase">
                            CLASS ATTENDANCE {facultyAttendanceSubmittedReport ? "(SUBMITTED REPORT)" : ""}
                          </h2>
                          <div className="border-b border-dashed border-gray-300 mt-2 mb-6"></div>
                        </div>

                        {facultyAttendanceSubmittedReport ? (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 text-[11px] font-bold font-sans text-slate-700"
                          >
                            {/* Success message banner matching Vignan design system */}
                            <div className="bg-[#eafaf1] border-l-4 border-emerald-600 p-4 rounded-r shadow-xs text-emerald-950">
                              <div className="flex items-start gap-3">
                                <span className="text-[18px]">✔</span>
                                <div>
                                  <h3 className="font-extrabold text-emerald-900 uppercase text-[12px] tracking-wide">
                                    CLASS ATTENDANCE ROSTER SHEET SUBMITTED SUCCESSFULLY!
                                  </h3>
                                  <p className="text-[10.5px] text-emerald-850 font-bold mt-1">
                                    The session roll call has been securely recorded in the Vignan Academic Master database ledger for {facultyCourse} (Branch: {facultyBranch}, Section: {facultySection}, Date: {facultyAttendanceDate}).
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Summary Metadata & Quick Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
                              <div className="border border-[#a2c3eb] bg-[#f8fbfe] p-3 rounded shadow-3xs flex flex-col justify-between">
                                <span className="text-blue-800 text-[10px] tracking-wider uppercase font-black">Class Session</span>
                                <div className="mt-1.5 text-[11.5px] text-slate-800 font-extrabold font-sans">
                                  {facultyCourse} {facultySemester} ({facultySection})
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5">{facultyBranch}</span>
                              </div>
                              <div className="border border-gray-200 bg-slate-50 p-3 rounded shadow-3xs flex flex-col justify-between">
                                <span className="text-slate-500 text-[10px] tracking-wider uppercase font-black">Total Roll Strength</span>
                                <div className="mt-1.5 text-[20px] font-black text-slate-900 leading-none">
                                  {FACULTY_ATTENDANCE_STUDENTS.length}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5">Assigned Section List</span>
                              </div>
                              <div className="border border-emerald-250 bg-[#f4fcf7] p-3 rounded shadow-3xs flex flex-col justify-between">
                                <span className="text-emerald-700 text-[10px] tracking-wider uppercase font-black">Present Count</span>
                                <div className="mt-1.5 text-[20px] font-black text-emerald-700 leading-none">
                                  {FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] === 'Present').length} / {FACULTY_ATTENDANCE_STUDENTS.length}
                                </div>
                                <span className="text-[10px] text-emerald-500 mt-0.5 font-bold">
                                  {((FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] === 'Present').length / FACULTY_ATTENDANCE_STUDENTS.length) * 100).toFixed(1)}% Present Rate
                                </span>
                              </div>
                              <div className="border border-rose-250 bg-rose-50 p-3 rounded shadow-3xs flex flex-col justify-between">
                                <span className="text-rose-700 text-[10px] tracking-wider uppercase font-black">Absent Count</span>
                                <div className="mt-1.5 text-[20px] font-black text-rose-700 leading-none">
                                  {FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] !== 'Present').length} / {FACULTY_ATTENDANCE_STUDENTS.length}
                                </div>
                                <span className="text-[10px] text-rose-550 mt-0.5 font-bold">
                                  {((FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] !== 'Present').length / FACULTY_ATTENDANCE_STUDENTS.length) * 100).toFixed(1)}% Absent Rate
                                </span>
                              </div>
                            </div>

                            {/* Export Bar with Dynamic CSV Generation click action */}
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded border border-gray-200">
                              <div className="space-y-0.5">
                                <h4 className="font-extrabold text-[12px] text-slate-800 uppercase">Export Certified Roster Records</h4>
                                <p className="text-[10px] text-slate-500 font-medium font-sans">Compile, download and audit digital logs compatible with excel worksheets.</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    const headers = ['S.No', 'Roll Number', 'Name', 'Status'];
                                    const rows = FACULTY_ATTENDANCE_STUDENTS.map((student, idx) => {
                                      const status = studentAttendanceState[student.rollNo] === 'Present' ? 'Present' : 'Absent';
                                      return [idx + 1, student.rollNo, student.name, status];
                                    });
                                    const csvContent = [
                                      headers.join(','),
                                      ...rows.map(r => r.map(val => `"${val}"`).join(','))
                                    ].join('\n');
                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.setAttribute('href', url);
                                    link.setAttribute('download', `Vignan_Attendance_${facultyBranch.replace(/\s+/g, '_')}_${facultySection}_${facultyAttendanceDate.replace(/\//g, '-')}.csv`);
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-5 py-2.5 uppercase rounded tracking-wider transition shadow hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                                >
                                  📥 DOWNLOAD EXPORT CSV
                                </button>
                                <button
                                  onClick={() => setFacultyAttendanceSubmittedReport(false)}
                                  className="bg-white border border-gray-350 hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] px-4 py-2.5 uppercase rounded transition cursor-pointer"
                                >
                                  Go Back / Edit List
                                </button>
                              </div>
                            </div>

                            {/* Detailed Side-by-Side Present vs Absent Roster columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[10.5px]">
                              
                              {/* Left column: Present Students */}
                              <div className="border border-emerald-300 rounded shadow-2xs bg-white overflow-hidden">
                                <div className="bg-emerald-600 text-white font-black px-4 py-2.5 flex items-center justify-between uppercase">
                                  <span>PRESENT STUDENTS ({FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] === 'Present').length})</span>
                                  <span className="text-[10px] bg-emerald-700 font-mono px-2 py-0.5 rounded">Checked In</span>
                                </div>
                                <div className="p-3 divide-y divide-emerald-50 max-h-[400px] overflow-y-auto">
                                  {FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] === 'Present').map((student, idx) => (
                                    <div key={student.rollNo} className="py-2.5 px-2 hover:bg-[#f4fcf7] flex items-center justify-between transition gap-2 font-bold text-slate-800">
                                      <div className="flex items-center gap-3">
                                        <span className="text-slate-400 font-mono w-5 text-center">{idx + 1}</span>
                                        <span className="text-blue-900 font-mono w-24 tracking-wide">{student.rollNo}</span>
                                        <span className="uppercase text-slate-700 font-sans">{student.name}</span>
                                      </div>
                                      <span className="text-emerald-750 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[9px] uppercase font-black">
                                        ✓ Present
                                      </span>
                                    </div>
                                  ))}
                                  {FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] === 'Present').length === 0 && (
                                    <div className="p-8 text-center text-slate-400 uppercase font-black tracking-wider">
                                      No students marked Present.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right column: Absent/Unmarked Students */}
                              <div className="border border-rose-300 rounded shadow-2xs bg-white overflow-hidden">
                                <div className="bg-rose-650 text-white font-black px-4 py-2.5 flex items-center justify-between uppercase">
                                  <span>ABSENT STUDENTS ({FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] !== 'Present').length})</span>
                                  <span className="text-[10px] bg-rose-700 font-mono px-2 py-0.5 rounded">Absentees</span>
                                </div>
                                <div className="p-3 divide-y divide-rose-50 max-h-[400px] overflow-y-auto">
                                  {FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] !== 'Present').map((student, idx) => (
                                    <div key={student.rollNo} className="py-2.5 px-2 hover:bg-[#fff9fa] flex items-center justify-between transition gap-2 font-bold text-slate-800">
                                      <div className="flex items-center gap-3">
                                        <span className="text-slate-400 font-mono w-5 text-center">{idx + 1}</span>
                                        <span className="text-rose-900 font-mono w-24 tracking-wide">{student.rollNo}</span>
                                        <span className="uppercase text-slate-700 font-sans">{student.name}</span>
                                      </div>
                                      <span className="text-rose-750 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[9px] uppercase font-black">
                                        ✗ Absent
                                      </span>
                                    </div>
                                  ))}
                                  {FACULTY_ATTENDANCE_STUDENTS.filter(st => studentAttendanceState[st.rollNo] !== 'Present').length === 0 && (
                                    <div className="p-8 text-center text-slate-400 uppercase font-black tracking-wider">
                                      No students marked Absent.
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>

                            {/* bottom Return Trigger */}
                            <div className="flex justify-center pt-4">
                              <button
                                onClick={() => setFacultyAttendanceSubmittedReport(false)}
                                className="bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] px-8 py-3 rounded uppercase tracking-wider transition cursor-pointer flex items-center gap-2 "
                              >
                                <span>←</span> Return to Roll Call Entry Form
                              </button>
                            </div>

                          </motion.div>
                        ) : (
                          <>
                            {/* Dropdown form fields matching layout exactly */}
                            <div className="max-w-[700px] space-y-4 text-[11.5px] text-slate-800 font-bold">
                              
                              {/* 1. Attendance Type row */}
                              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-right text-slate-700 font-sans pr-2">Attendance Type:</label>
                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input 
                                      type="radio" 
                                      name="facultyAttendanceTypeChoice"
                                      checked={facultyAttendanceType === 'Regular'}
                                      onChange={() => setFacultyAttendanceType('Regular')}
                                      className="unaccented w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="font-sans font-bold">Regular</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input 
                                      type="radio" 
                                      name="facultyAttendanceTypeChoice"
                                      checked={facultyAttendanceType === 'Substitute'}
                                      onChange={() => setFacultyAttendanceType('Substitute')}
                                      className="unaccented w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="font-sans font-bold">Substitute</span>
                                  </label>
                                </div>
                              </div>

                              {/* 2. Date with calendar */}
                              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-right text-slate-700 font-sans pr-2">Date:</label>
                                <div className="flex items-center">
                                  <input 
                                    type="text"
                                    value={facultyAttendanceDate}
                                    onChange={(e) => setFacultyAttendanceDate(e.target.value)}
                                    className="bg-[#010101] text-white hover:bg-slate-900 transition font-mono text-[11.5px] px-2 py-1 text-center font-bold tracking-wide outline-none w-28 h-7 rounded-l"
                                  />
                                  <button className="bg-[#f4511e] hover:bg-[#e64a19] text-white w-7 h-7 flex items-center justify-center rounded-r border-l border-orange-700 transition cursor-pointer" title="Select Date">
                                    <span className="text-[10px]">📅</span>
                                  </button>
                                </div>
                              </div>

                              {/* 3. Course */}
                              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-right text-slate-700 font-sans pr-2">Course:</label>
                                <select 
                                  value={facultyCourse}
                                  onChange={(e) => setFacultyCourse(e.target.value)}
                                  className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-48 h-8 font-sans font-bold"
                                >
                                  <option value="B.Tech">B.Tech</option>
                                  <option value="M.Tech">M.Tech</option>
                                  <option value="MBA">MBA</option>
                                  <option value="MCA">MCA</option>
                                </select>
                              </div>

                              {/* 4. Semester */}
                              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-right text-slate-700 font-sans pr-2">Semester:</label>
                                <select 
                                  value={facultySemester}
                                  onChange={(e) => setFacultySemester(e.target.value)}
                                  className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-48 h-8 font-sans font-bold"
                                >
                                  <option value="I Semester">I Semester</option>
                                  <option value="II Semester">II Semester</option>
                                  <option value="III Semester">III Semester</option>
                                  <option value="IV Semester">IV Semester</option>
                                  <option value="V Semester">V Semester</option>
                                  <option value="VI Semester">VI Semester</option>
                                  <option value="VII Semester">VII Semester</option>
                                  <option value="VIII Semester">VIII Semester</option>
                                </select>
                              </div>

                              {/* 5. Branch */}
                              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-right text-slate-700 font-sans pr-2">Branch:</label>
                                <select 
                                  value={facultyBranch}
                                  onChange={(e) => setFacultyBranch(e.target.value)}
                                  className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-72 h-8 font-sans font-bold"
                                >
                                  <option value="Civil Engineering">Civil Engineering</option>
                                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                                  <option value="Computer Science Engineering">Computer Science Engineering</option>
                                  <option value="Information Technology">Information Technology</option>
                                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                                </select>
                              </div>

                              {/* 6. Section */}
                              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-right text-slate-700 font-sans pr-2">Section:</label>
                                <select 
                                  value={facultySection}
                                  onChange={(e) => setFacultySection(e.target.value)}
                                  className="bg-white border border-gray-300 px-2 py-1.5 rounded text-[11.5px] text-slate-800 focus:outline-none w-40 h-8 font-sans font-bold"
                                >
                                  <option value="Section-A">Section-A</option>
                                  <option value="Section-B">Section-B</option>
                                  <option value="Section-C">Section-C</option>
                                </select>
                              </div>

                              {/* 7. Action Show Button */}
                              <div className="grid grid-cols-[140px_1fr] gap-4 pt-2">
                                <div></div>
                                <div>
                                  <button
                                    onClick={() => {
                                      setFacultyShowAttendanceList(true);
                                      setFacultyAttendanceSubmittedReport(false);
                                    }}
                                    className="bg-[#33b5e5] hover:bg-[#209ac9] text-white font-extrabold text-[12px] px-5 py-2 hover:shadow transition uppercase cursor-pointer rounded-xs animate-pulse"
                                  >
                                    Show
                                  </button>
                                </div>
                              </div>

                            </div>

                            {/* List of 60 students shown below */}
                            <AnimatePresence>
                              {facultyShowAttendanceList && (
                                <motion.div
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="pt-6 border-t border-gray-150 text-[11px] font-bold text-slate-700 font-sans"
                                >
                                  {/* Bulk actions and summary header */}
                                  <div className="flex items-center justify-between mb-4 bg-slate-50 border border-gray-200 p-3 rounded flex-wrap gap-2 text-slate-700">
                                    <div className="space-y-1">
                                      <h3 className="font-black text-blue-900 uppercase text-[11.5px]">
                                        Class Attendance Roster Sheet
                                      </h3>
                                      <p className="text-[10px] text-slate-500 font-medium font-sans">
                                        Course: <span className="text-slate-800">{facultyCourse}</span> | Sem: <span className="text-slate-800">{facultySemester}</span> | Sec: <span className="text-slate-800">{facultySection}</span> | Branch: <span className="text-slate-800">{facultyBranch}</span>
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => {
                                          const bulk: Record<string, 'Present' | 'Absent'> = {};
                                          FACULTY_ATTENDANCE_STUDENTS.forEach(st => {
                                            bulk[st.rollNo] = 'Present';
                                          });
                                          setStudentAttendanceState(bulk);
                                        }}
                                        className="bg-[#eafaf1] border border-emerald-350 hover:bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-[10px] uppercase font-black cursor-pointer transition"
                                      >
                                        Mark All Present
                                      </button>
                                      <button
                                        onClick={() => {
                                          const bulk: Record<string, 'Present' | 'Absent'> = {};
                                          FACULTY_ATTENDANCE_STUDENTS.forEach(st => {
                                            bulk[st.rollNo] = 'Absent';
                                          });
                                          setStudentAttendanceState(bulk);
                                        }}
                                        className="bg-rose-50 border border-rose-350 hover:bg-rose-100 text-rose-800 px-3 py-1 rounded text-[10px] uppercase font-black cursor-pointer transition"
                                      >
                                        Mark All Absent
                                      </button>
                                    </div>
                                  </div>

                                  {/* Student Attendance Table */}
                                  <div className="border border-gray-200 rounded overflow-hidden shadow-2xs">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="bg-[#eef6fe] text-blue-950 text-[11.5px] font-bold border-b border-gray-200">
                                          <th className="py-2 px-3 border-r border-gray-200 w-16 text-center">S.No</th>
                                          <th className="py-2 px-4 border-r border-gray-200 w-40">Roll number</th>
                                          <th className="py-2 px-4 border-r border-gray-200">Name</th>
                                          <th className="py-2 px-4 border-r border-[#a2c3eb] text-center w-28">Present</th>
                                          <th className="py-2 px-4 text-center w-28">Absent</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-150">
                                        {FACULTY_ATTENDANCE_STUDENTS.map((student, idx) => {
                                          const isPresent = studentAttendanceState[student.rollNo] === 'Present';
                                          const isAbsent = studentAttendanceState[student.rollNo] === 'Absent';
                                          return (
                                            <tr key={student.rollNo} className="hover:bg-slate-50 transition border-b border-gray-100">
                                              <td className="py-1.5 px-3 border-r border-gray-200 font-mono text-center text-slate-500">{idx + 1}</td>
                                              <td className="py-1.5 px-4 border-r border-gray-200 font-mono text-slate-800 tracking-wide">{student.rollNo}</td>
                                              <td className="py-1.5 px-4 border-r border-gray-200 font-sans text-slate-800 font-bold uppercase">{student.name}</td>
                                              <td className="py-1.5 px-4 border-r border-gray-200 text-center">
                                                <button
                                                  onClick={() => setStudentAttendanceState(prev => ({ ...prev, [student.rollNo]: 'Present' }))}
                                                  className={`w-5 h-5 mx-auto rounded-full border flex items-center justify-center transition cursor-pointer ${
                                                    isPresent 
                                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-bold text-[9px]' 
                                                      : 'bg-white border-gray-300 hover:border-emerald-500 text-transparent'
                                                  }`}
                                                  title="Mark Present"
                                                >
                                                  ✓
                                                </button>
                                              </td>
                                              <td className="py-1.5 px-4 text-center">
                                                <button
                                                  onClick={() => setStudentAttendanceState(prev => ({ ...prev, [student.rollNo]: 'Absent' }))}
                                                  className={`w-5 h-5 mx-auto rounded-full border flex items-center justify-center transition cursor-pointer ${
                                                    isAbsent 
                                                      ? 'bg-rose-650 border-rose-650 text-white shadow-xs font-bold text-[9px]' 
                                                      : 'bg-white border-gray-300 hover:border-rose-400 text-transparent'
                                                  }`}
                                                  title="Mark Absent"
                                                >
                                                  ✗
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Attendance Submission Block */}
                                  <div className="mt-6 flex justify-end gap-3 items-center">
                                    <button
                                      onClick={() => {
                                        setFacultyAttendanceSubmittedReport(true);
                                      }}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11.5px] px-6 py-2.5 rounded shadow hover:shadow-md transition uppercase cursor-pointer"
                                    >
                                      Submit Class Attendance Sheet
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}

                      </div>
                    ) : (
                      /* Placeholder for other faculty subtopics */
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-12 text-center h-full min-h-[400px]" id="faculty-other-subtopic-placeholder">
                        <div className="w-14 h-14 bg-blue-50 text-blue-650 rounded-full flex items-center justify-center mb-4">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                          {FACULTY_SUBMENU_OPTIONS.find(i => i.id === facultySubSelected)?.label || 'FACULTY OPTION'}
                        </h3>
                        <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider mt-2 max-w-sm">
                          This module lists faculty files, academic papers and credentials securely fetched from the Vignan Dean Office database.
                        </p>
                        <button 
                          onClick={() => {
                            setFacultySubSelected('attendance');
                            setSelectedSubTab('faculty');
                          }}
                          className="mt-6 border border-blue-500 text-blue-750 hover:bg-blue-50 font-bold text-[10px] uppercase py-1.5 px-4 rounded transition cursor-pointer"
                        >
                          View Class Attendance
                        </button>
                      </div>
                    )
                  ) : (
                    /* Fallback beautifully styled placeholder panel for other subheadings */
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-12 text-center h-full min-h-[400px]" id="selected-module-fallback">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <ClipboardList className="w-7 h-7" />
                      </div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                        {ACADEMICS_SIDEBAR.find(i => i.id === selectedSubTab)?.label || 'MODULE'}
                      </h3>
                      <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider mt-2 max-w-sm">
                        This sub-module registers live reports from Vignan ERP Server databases. Set Academic Register view to browse current classroom files.
                      </p>
                      <button 
                        onClick={() => setSelectedSubTab('academic_register')}
                        className="mt-6 border border-blue-500 text-blue-700 hover:bg-blue-50 font-bold text-[10px] uppercase py-1.5 px-4 rounded transition cursor-pointer"
                      >
                        Return to Academic Register
                      </button>
                    </div>
                  )}

                </div>

              </div>
            )}


            {/* ================================== TAB C: EXAMINATIONS VIEW (GRADES) ================================== */}
            {activeTab === 'examinations' && (
              <div className="space-y-6 text-left" id="examinations-grades-widget">
                <div>
                  <h2 className="text-lg font-black text-blue-900 font-sans tracking-wide">EXAMINATIONS - INTERNAL EVALUATION</h2>
                  <div className="border-b border-dashed border-gray-300 mt-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Ledger Form entry column */}
                  <div className="bg-slate-50 border rounded-md p-4 space-y-4 text-xs font-bold text-slate-600">
                    <h3 className="text-sm font-black text-blue-900 uppercase">Save Assessment Marks</h3>
                    
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px]">Select Student Name</label>
                      <select 
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded text-slate-800"
                      >
                        {DEMO_STUDENT_LIST.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px]">Select Assessment Subject</label>
                      <select 
                        value={selectedSubjectCode}
                        onChange={(e) => setSelectedSubjectCode(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded text-slate-800"
                      >
                        <option value="IT-321">Printed Circuit Board Design (IT-321)</option>
                        <option value="IT-322">Microcontrollers Lab (IT-322)</option>
                        <option value="IT-323">Integrated Circuits (IT-323)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-500 uppercase tracking-wider text-[9px]">Internals (Max 30)</label>
                        <input 
                          type="number" 
                          max={30}
                          value={internalInp}
                          onChange={(e) => setInternalInp(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded font-mono font-medium text-slate-800" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 uppercase tracking-wider text-[9px]">Externals (Max 70)</label>
                        <input 
                          type="number" 
                          max={70}
                          value={externalInp}
                          onChange={(e) => setExternalInp(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded font-mono font-medium text-slate-800" 
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      {marksSubmitted && (
                        <span className="text-[11px] text-emerald-600 font-bold block mb-2 bg-emerald-50 border border-emerald-200 p-2 rounded">
                          ✓ Internal assessment grades locked in system ledger!
                        </span>
                      )}
                      <button
                        onClick={handleUpdateMarks}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] uppercase py-2.5 rounded shadow-xs tracking-wider cursor-pointer"
                      >
                        COMMIT LEFTOVER MARKS
                      </button>
                    </div>
                  </div>

                  {/* lookup visual board */}
                  <div className="border border-gray-200 rounded-md p-4 bg-white space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase">Pre-existing System Marks Ledger Lookup</h4>
                    <div className="space-y-2 text-xs">
                      {grades.slice(0, 4).map(gr => (
                        <div key={gr.subjectCode} className="flex justify-between border-b pb-2 border-gray-100 font-mono">
                          <div className="text-left font-sans">
                            <span className="font-bold text-blue-700 block text-[11px]">{gr.subjectCode}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{gr.subjectName}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 text-[10px]">Int: {gr.internalMarks} | Ext: {gr.externalMarks}</span>
                            <span className="font-extrabold text-red-650 block text-[11.5px]">Total: {gr.totalMarks} ({gr.grade})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}


            {/* ================================== TAB D: CORRESPONDENCE VIEW (CIRCULARS) ================================== */}
            {activeTab === 'correspondence' && (
              <div className="space-y-6 text-left" id="correspondence-circulars-widget">
                <div>
                  <h2 className="text-lg font-black text-blue-900 font-sans tracking-wide">CORRESPONDENCE - NOTICE BOARD DISPATCH</h2>
                  <div className="border-b border-dashed border-gray-300 mt-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Entry module */}
                  <div className="space-y-3.5 text-xs font-bold text-slate-600 bg-slate-50 border p-4 rounded-md">
                    <h3 className="text-sm font-black text-blue-900 uppercase">Broadcast New Bulletin</h3>
                    
                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px]">Announcement Title Header</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Mid-II Schedule Circular B.Tech III Year" 
                        value={bulletinTitle}
                        onChange={(e) => setBulletinTitle(e.target.value)}
                        className="w-full bg-white border border-gray-250 px-3 py-2 rounded font-medium text-slate-800 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px]">Syllabus / Circular Body Content</label>
                      <textarea 
                        rows={4}
                        placeholder="Write formal directives or college calendar dates here..." 
                        value={bulletinContent}
                        onChange={(e) => setBulletinContent(e.target.value)}
                        className="w-full bg-white border border-gray-250 px-3 py-2 rounded font-medium text-slate-800 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[9px]">Target Audience Pipeline</label>
                      <select 
                        value={bulletinAudience}
                        onChange={(e) => setBulletinAudience(e.target.value as any)}
                        className="w-full bg-white border border-gray-250 px-3 py-2 rounded text-slate-800"
                      >
                        <option value="All">All Audiences (Colleagues, Students &amp; Parents)</option>
                        <option value="Student">Students Only</option>
                        <option value="Parent">Parents Only</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      {bulletinSubmitted && (
                        <span className="text-[11px] text-emerald-600 font-bold block mb-2 bg-emerald-50 border border-emerald-200 p-2 rounded">
                          ✓ Circular bulletin broadcasted on notice board pipelines!
                        </span>
                      )}
                      <button
                        onClick={handlePostBulletin}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-[11px] uppercase py-2.5 rounded tracking-wider shadow-sm transition cursor-pointer"
                      >
                        BROADCAST BULLETIN NOW
                      </button>
                    </div>
                  </div>

                  {/* Published live feed */}
                  <div className="border border-gray-200 rounded-md p-4 bg-white space-y-3 max-h-[380px] overflow-y-auto">
                    <h4 className="text-xs font-black text-slate-500 uppercase">Interactive notice board live feed</h4>
                    {announcements.map((ann, idx) => (
                      <div key={idx} className="bg-slate-50 border border-gray-150 rounded p-3 text-xs leading-normal">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-black uppercase">
                            To: {ann.targetAudience}
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-mono font-bold">{ann.postedDate}</span>
                        </div>
                        <h5 className="font-extrabold text-slate-900">{ann.title}</h5>
                        <p className="text-slate-650 mt-1 text-[11.5px] leading-relaxed font-sans">{ann.content}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}


            {/* ================================== TAB E: ADMIN VIEW (MESSAGES / CONSULTATIONS) ================================== */}
            {activeTab === 'admin' && (
              <div className="space-y-6 text-left" id="admin-messages-widget">
                <div>
                  <h2 className="text-lg font-black text-blue-900 font-sans tracking-wide">ADMIN - PARENT CONSULTATIONS</h2>
                  <div className="border-b border-dashed border-gray-300 mt-2"></div>
                </div>

                <div className="space-y-4">
                  {messages.filter(m => m.receiverId === faculty.id || m.senderId === faculty.id).map((msg) => {
                    const isSenderMe = msg.senderId === faculty.id;
                    return (
                      <div 
                        key={msg.id} 
                        className={`p-4 border rounded-md text-left transition ${
                          isSenderMe 
                            ? 'border-blue-100 bg-blue-50/20 ml-8' 
                            : msg.read 
                            ? 'border-gray-200 bg-slate-50' 
                            : 'border-emerald-200 bg-emerald-55/10 border-l-4 border-l-emerald-600'
                        }`}
                      >
                        <div className="flex justify-between items-center font-mono text-[9.5px] text-slate-400 font-bold mb-2">
                          <span className={`px-2 py-0.5 rounded uppercase font-bold font-sans ${
                            isSenderMe ? 'bg-blue-100 text-blue-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          }`}>
                            {isSenderMe ? 'Your Sent Response' : `From Parent: ${msg.senderName}`}
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <h4 className="text-xs font-black text-slate-900 leading-snug">{msg.subject}</h4>
                        <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">{msg.content}</p>

                        {!isSenderMe && replyActiveId !== msg.id && (
                          <button
                            onClick={() => {
                              setReplyActiveId(msg.id);
                              setReplyText('');
                            }}
                            className="mt-3.5 text-[10px] font-black tracking-wider text-red-650 uppercase hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Respond to Parent Query</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {replyActiveId === msg.id && (
                          <div className="mt-4 p-3 bg-white border border-gray-200 rounded space-y-3">
                            <textarea
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Type professional reply to Parent ${msg.senderName} here...`}
                              className="w-full bg-slate-50 text-xs border border-gray-200 px-3 py-2 rounded font-sans focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex justify-end gap-2 text-xs font-bold">
                              <button
                                onClick={() => setReplyActiveId(null)}
                                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSendMessageReply(msg)}
                                className="px-4 py-1.5 bg-blue-700 text-white rounded hover:bg-blue-800 flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send Mail Reply</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 6. Footer (Matches bottom blue bar in screenshot with WebPros logo) */}
      <footer className="bg-[#1565c0] border-t-2 border-[#0d47a1] text-white py-3.5 px-6 mt-12 shadow-sm" id="college-master-footer">
        <div className="max-w-[1250px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center text-xs font-bold">
          
          {/* WS logo circle */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1565c0] font-black font-sans text-xs border-2 border-blue-900 shadow-sm select-none">
              WS
            </div>
            <div className="text-left leading-none">
              <p className="text-[10px] text-blue-100 uppercase tracking-wide">Copyright © All rights reserved</p>
              <p className="text-[11.5px] text-white font-black uppercase mt-0.5 tracking-tight">
                Powered by Webpros Solutions Pvt Ltd., Visakhapatnam
              </p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
