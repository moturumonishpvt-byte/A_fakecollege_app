export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  course: string;
  branch: string;
  year: number;
  semester: number;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  avatar: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  subjectsTaught: string[];
  avatar: string;
}

export interface GradeRecord {
  subjectCode: string;
  subjectName: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  semester: number;
}

export interface AttendanceRecord {
  date: string;
  subject: string;
  status: 'Present' | 'Absent';
  period: number;
}

export interface BookBorrowed {
  id: string;
  title: string;
  author: string;
  borrowedDate: string;
  dueDate: string;
  fineAmount: number;
  status: 'Borrowed' | 'Overdue' | 'Returned';
}

export interface FeeStructure {
  category: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Fully Paid' | 'Partially Paid' | 'Pending';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Student' | 'Employee' | 'Parent';
  receiverId: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedDate: string;
  targetAudience: 'All' | 'Student' | 'Employee' | 'Parent';
}
