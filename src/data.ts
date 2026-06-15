import { StudentProfile, EmployeeProfile, GradeRecord, AttendanceRecord, BookBorrowed, FeeStructure, Announcement, Message } from './types';

export const INITIAL_STUDENT: StudentProfile = {
  id: 'student_1',
  name: 'Aarav Reddy',
  rollNo: '21L31A0501',
  course: 'B.Tech',
  branch: 'Computer Science & Engineering',
  year: 3,
  semester: 2,
  email: 'aarav.reddy@vignan.edu.in',
  phone: '+91 98765 43210',
  guardianName: 'Venkateshwara Reddy',
  guardianPhone: '+91 94405 12345',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
};

export const INITIAL_EMPLOYEE: EmployeeProfile = {
  id: 'employee_1',
  name: 'Dr. Ramesh Prasad',
  employeeId: 'EMP-5524',
  designation: 'Associate Professor',
  department: 'Information Technology',
  email: 'r.prasad@vignan.edu.in',
  phone: '+91 90021 54321',
  subjectsTaught: [
    'Web Technologies (IT-321)',
    'Cloud Computing (IT-322)',
    'Database Management Systems (IT-223)'
  ],
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
};

export const INITIAL_GRADES: GradeRecord[] = [
  // Sem 5
  { subjectCode: 'IT-311', subjectName: 'Software Engineering', credits: 3, grade: 'A+', internalMarks: 27, externalMarks: 58, totalMarks: 85, semester: 5 },
  { subjectCode: 'IT-312', subjectName: 'Formal Languages & Automata', credits: 4, grade: 'A', internalMarks: 24, externalMarks: 54, totalMarks: 78, semester: 5 },
  { subjectCode: 'IT-313', subjectName: 'Design & Analysis of Algorithms', credits: 4, grade: 'O', internalMarks: 29, externalMarks: 63, totalMarks: 92, semester: 5 },
  { subjectCode: 'IT-314', subjectName: 'Microprocessors & Microcontrollers', credits: 3, grade: 'B+', internalMarks: 21, externalMarks: 48, totalMarks: 69, semester: 5 },
  { subjectCode: 'IT-315', subjectName: 'Professional Elective - I', credits: 3, grade: 'A', internalMarks: 25, externalMarks: 52, totalMarks: 77, semester: 5 },
  { subjectCode: 'IT-316', subjectName: 'Algorithms Lab', credits: 1.5, grade: 'O', internalMarks: 48, externalMarks: 47, totalMarks: 95, semester: 5 },
  // Sem 6 Current
  { subjectCode: 'IT-321', subjectName: 'Web Technologies', credits: 3, grade: 'A', internalMarks: 26, externalMarks: 53, totalMarks: 79, semester: 6 },
  { subjectCode: 'IT-322', subjectName: 'Cloud Computing', credits: 3, grade: 'O', internalMarks: 28, externalMarks: 61, totalMarks: 89, semester: 6 },
  { subjectCode: 'IT-323', subjectName: 'Artificial Intelligence', credits: 4, grade: 'A+', internalMarks: 25, externalMarks: 59, totalMarks: 84, semester: 6 },
  { subjectCode: 'IT-324', subjectName: 'Cryptography & Systems Security', credits: 3, grade: 'B+', internalMarks: 22, externalMarks: 46, totalMarks: 68, semester: 6 }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { date: '2026-06-10', subject: 'Web Technologies (IT-321)', status: 'Present', period: 1 },
  { date: '2026-06-10', subject: 'Cloud Computing (IT-322)', status: 'Present', period: 2 },
  { date: '2026-06-10', subject: 'Artificial Intelligence (IT-323)', status: 'Absent', period: 3 },
  { date: '2026-06-11', subject: 'Cryptography & Security (IT-324)', status: 'Present', period: 1 },
  { date: '2026-06-11', subject: 'Web Technologies (IT-321)', status: 'Present', period: 2 },
  { date: '2026-06-11', subject: 'Cloud Computing (IT-322)', status: 'Present', period: 3 },
  { date: '2026-06-12', subject: 'Artificial Intelligence (IT-323)', status: 'Present', period: 1 },
  { date: '2026-06-12', subject: 'Cryptography & Security (IT-324)', status: 'Present', period: 2 },
  { date: '2026-06-12', subject: 'Database Systems (IT-223)', status: 'Present', period: 3 },
  { date: '2026-06-15', subject: 'Web Technologies (IT-321)', status: 'Present', period: 1 },
  { date: '2026-06-15', subject: 'Cloud Computing (IT-322)', status: 'Present', period: 2 }
];

export const INITIAL_BOOKS: BookBorrowed[] = [
  { id: 'b1', title: 'Core Java - Volume I Fundamentals', author: 'Cay S. Horstmann', borrowedDate: '2026-05-20', dueDate: '2026-06-25', fineAmount: 0, status: 'Borrowed' },
  { id: 'b2', title: 'Web Technologies: Black Book', author: 'Kogent Learning Solutions', borrowedDate: '2026-06-01', dueDate: '2026-06-15', fineAmount: 10, status: 'Overdue' },
  { id: 'b3', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', borrowedDate: '2026-04-10', dueDate: '2026-04-25', fineAmount: 0, status: 'Returned' }
];

export const INITIAL_FEES: FeeStructure[] = [
  { category: 'Tuition Fee (Annual)', totalAmount: 95000, paidAmount: 95000, dueDate: '2026-03-31', status: 'Fully Paid' },
  { category: 'NBA & Autonomy Fee', totalAmount: 12000, paidAmount: 12000, dueDate: '2026-04-30', status: 'Fully Paid' },
  { category: 'Examination Fee (Sem 6)', totalAmount: 2500, paidAmount: 0, dueDate: '2026-06-20', status: 'Pending' },
  { category: 'Bus / Hostel Fee (Term II)', totalAmount: 38000, paidAmount: 20000, dueDate: '2026-06-30', status: 'Partially Paid' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a_1',
    title: 'Mid-II Examinations Schedule B.Tech III-II',
    content: 'The Mid-II examinations for III B.Tech II Semester students are scheduled to start from June 25th 2026. Hall tickets will be issued only if attendance criteria (>75%) are fulfilled and sem fee dues are cleared.',
    postedBy: 'Director of Evaluation',
    postedDate: '2026-06-12',
    targetAudience: 'All'
  },
  {
    id: 'a_2',
    title: 'NPTEL Registration Deadline Extension',
    content: 'All B.Tech students are hereby informed that the deadline for register-paying of SWAYAM NPTEL portal courses is extended up to June 20th. Submit receipt to your class coordinator.',
    postedBy: 'HOD CSE',
    postedDate: '2026-06-10',
    targetAudience: 'Student'
  },
  {
    id: 'a_3',
    title: 'Faculty Meeting regarding NBA Accreditations',
    content: 'An urgent staff meeting will be conducted on June 16th at 3:30 PM in the Boardroom. All teaching faculty are requested to attend with their respective course files.',
    postedBy: 'Principal',
    postedDate: '2026-06-14',
    targetAudience: 'Employee'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm_1',
    senderId: 'parent_1',
    senderName: 'Venkateshwara Reddy',
    senderRole: 'Parent',
    receiverId: 'employee_1',
    subject: 'Attendance Query: Aarav Reddy',
    content: 'Respected Sir, I received a notification regarding Aarav being absent on June 10th for AI class. Please let me know if his attendance is sufficient.',
    timestamp: '2026-06-11 10:15',
    read: false
  },
  {
    id: 'm_2',
    senderId: 'employee_1',
    senderName: 'Dr. Ramesh Prasad',
    senderRole: 'Employee',
    receiverId: 'parent_1',
    subject: 'RE: Attendance Query: Aarav Reddy',
    content: 'Dear Mr. Venkateshwara, Aarav has an overall attendance of 84.5% which is highly satisfactory. Missing one class was safe. However, please encourage him to be regular.',
    timestamp: '2026-06-11 15:40',
    read: true
  }
];

export const TIMETABLE_DAYS = [
  {
    day: 'Monday',
    periods: [
      { num: 1, time: '09:00 - 10:00', code: 'IT-321', name: 'Web Technologies', faculty: 'Dr. Ramesh Prasad' },
      { num: 2, time: '10:00 - 11:00', code: 'IT-322', name: 'Cloud Computing', faculty: 'S. K. Dev' },
      { num: 3, time: '11:10 - 12:10', code: 'IT-323', name: 'Artificial Intelligence', faculty: 'L. Varshini' },
      { num: 4, time: '12:10 - 01:00', code: 'IT-324', name: 'Cryptography & Sec', faculty: 'P. Hari Prasad' },
      { num: 5, time: '01:50 - 03:50', code: 'LAB', name: 'Web Tech Lab', faculty: 'Dr. Ramesh Prasad' }
    ]
  },
  {
    day: 'Tuesday',
    periods: [
      { num: 1, time: '09:00 - 10:00', code: 'IT-323', name: 'Artificial Intelligence', faculty: 'L. Varshini' },
      { num: 2, time: '10:00 - 11:00', code: 'IT-321', name: 'Web Technologies', faculty: 'Dr. Ramesh Prasad' },
      { num: 3, time: '11:10 - 12:10', code: 'IT-324', name: 'Cryptography & Sec', faculty: 'P. Hari Prasad' },
      { num: 4, time: '12:10 - 01:00', code: 'IT-322', name: 'Cloud Computing', faculty: 'S. K. Dev' },
      { num: 5, time: '01:50 - 03:50', code: 'LIBRARY', name: 'Library Hour', faculty: 'Librarian' }
    ]
  },
  {
    day: 'Wednesday',
    periods: [
      { num: 1, time: '09:00 - 10:00', code: 'IT-322', name: 'Cloud Computing', faculty: 'S. K. Dev' },
      { num: 2, time: '10:00 - 11:00', code: 'IT-324', name: 'Cryptography & Sec', faculty: 'P. Hari Prasad' },
      { num: 3, time: '11:10 - 12:10', code: 'IT-321', name: 'Web Technologies', faculty: 'Dr. Ramesh Prasad' },
      { num: 4, time: '12:10 - 01:00', code: 'IT-323', name: 'Artificial Intelligence', faculty: 'L. Varshini' },
      { num: 5, time: '01:50 - 03:50', code: 'SPORTS', name: 'Sports & Seminar', faculty: 'Physical Director' }
    ]
  },
  {
    day: 'Thursday',
    periods: [
      { num: 1, time: '09:00 - 10:00', code: 'IT-324', name: 'Cryptography & Sec', faculty: 'P. Hari Prasad' },
      { num: 2, time: '10:00 - 11:00', code: 'IT-323', name: 'Artificial Intelligence', faculty: 'L. Varshini' },
      { num: 3, time: '11:10 - 12:10', code: 'IT-322', name: 'Cloud Computing', faculty: 'S. K. Dev' },
      { num: 4, time: '12:10 - 01:00', code: 'IT-321', name: 'Web Technologies', faculty: 'Dr. Ramesh Prasad' },
      { num: 5, time: '01:50 - 03:50', code: 'LAB', name: 'AI / OS Lab', faculty: 'L. Varshini' }
    ]
  },
  {
    day: 'Friday',
    periods: [
      { num: 1, time: '09:00 - 10:00', code: 'IT-321', name: 'Web Technologies', faculty: 'Dr. Ramesh Prasad' },
      { num: 2, time: '10:00 - 11:00', code: 'IT-322', name: 'Cloud Computing', faculty: 'S. K. Dev' },
      { num: 3, time: '11:10 - 12:10', code: 'IT-323', name: 'Artificial Intelligence', faculty: 'L. Varshini' },
      { num: 4, time: '12:10 - 01:00', code: 'IT-324', name: 'Cryptography & Sec', faculty: 'P. Hari Prasad' },
      { num: 5, time: '01:50 - 03:50', code: 'INTERNSHIP', name: 'Project / Training', faculty: 'Internal Mentors' }
    ]
  }
];
