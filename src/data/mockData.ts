export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'it-department' | 'other';
  customRole?: string;
  avatar?: string;
  emailVerified?: boolean;
  verificationCode?: string;
  department?: string;
}

export interface MediaFile {
  url: string;
  type: 'image' | 'video';
  file?: File;   // ✅ əlavə et (upload üçün)
  name?: string; // ✅ əlavə et (fallback üçün)
}

export interface Problem {
  id: string;
  text: string;
  date: string;
  media: MediaFile[];
  status: 'unsolved' | 'in-progress' | 'solved' | 'impossible';
  tags: string[];
  taggedUsers: User[];
  solution?: {
    text: string;
    solverName: string;
    solverDate: string;
    media: MediaFile[];
  };
  authorId: string;
  authorName: string;
  visibility: 'public' | 'private';
  department?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const registeredUsers: User[] = [
  {
    id: '1',
    name: 'Gülşən Xəlilova',
    email: 'gulsen@karabakh.edu.az',
    password: 'password123',
    role: 'teacher',
    emailVerified: true,
    department: 'IT'
  },
  {
    id: '2',
    name: 'Rəşad Məmmədov',
    email: 'rasad@karabakh.edu.az',
    password: 'password123',
    role: 'student',
    emailVerified: true,
    department: 'Computer Science'
  },
  {
    id: '3',
    name: 'Nigar Əhmədova',
    email: 'nigar@karabakh.edu.az',
    password: 'password123',
    role: 'teacher',
    emailVerified: true,
    department: 'IT'
  },
  {
    id: '4',
    name: 'Aynur Həsənova',
    email: 'aynur@karabakh.edu.az',
    password: 'password123',
    role: 'student',
    emailVerified: true,
    department: 'Engineering'
  },
  {
    id: '5',
    name: 'Elvin Əliyev',
    email: 'elvin@karabakh.edu.az',
    password: 'password123',
    role: 'student',
    emailVerified: true,
    department: 'Computer Science'
  },
  {
    id: '6',
    name: 'Leyla Quliyeva',
    email: 'leyla@karabakh.edu.az',
    password: 'password123',
    role: 'other',
    emailVerified: true,
    department: 'IT'
  }
];

export const mockProblems: Problem[] = [
  {
    id: '1',
    text: 'Proyektor işləmir, əlaqə saxlamaq lazımdır @Nigar',
    date: '2025-10-28',
    media: [],
    status: 'solved',
    tags: ['@Nigar'],
    taggedUsers: [registeredUsers[2]],
    solution: {
      text: 'Problemi həll etdim, proyektoru yenidən qoşdum',
      solverName: 'Gülşən Xəlilova',
      solverDate: '2025-10-29',
      media: []
    },
    authorId: '2',
    authorName: 'Rəşad Məmmədov',
    visibility: 'public',
    department: 'IT',
    priority: 'medium'
  },
  {
    id: '2',
    text: 'Kompüterin monitorunda görüntü yoxdur, yoxlamaq lazımdır @Gülşən',
    date: '2025-10-28',
    media: [],
    status: 'in-progress',
    tags: ['@Gülşən'],
    taggedUsers: [registeredUsers[0]],
    authorId: '4',
    authorName: 'Aynur Həsənova',
    visibility: 'private',
    department: 'Engineering',
    priority: 'high'
  },
  {
    id: '3',
    text: 'Wi-Fi şəbəkəsinə qoşula bilmirəm, parol səhvdir',
    date: '2025-10-27',
    media: [],
    status: 'unsolved',
    tags: [],
    taggedUsers: [],
    authorId: '5',
    authorName: 'Elvin Əliyev',
    visibility: 'public',
    department: 'IT',
    priority: 'low'
  },
  {
    id: '4',
    text: 'Printer kağız sıxılması problemi yaşayır',
    date: '2025-10-26',
    media: [],
    status: 'impossible',
    tags: [],
    taggedUsers: [],
    authorId: '6',
    authorName: 'Leyla Quliyeva',
    visibility: 'public',
    department: 'IT',
    priority: 'critical'
  }
];

export const currentUser: User = {
  id: '1',
  name: 'Gülşən',
  email: 'gulsen@karabakh.edu.az',
  password: 'password123',
  role: 'teacher',
  emailVerified: true,
  department: 'IT'
};