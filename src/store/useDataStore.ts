import { create as createStore } from 'zustand';
import type { 
  Unit, 
  Student, 
  Lead, 
  User, 
  OnlineContent, 
  Task, 
  SubUnit, 
  KihapEvent, 
  EventCheckin,
  Badge,
  StudentBadge,
  LiveClass,
  Notification,
  PhysicalTest,
  CreateLeadInput,
  UpdateLeadInput
} from '../types';
import { initialUnits, initialUsers, beltBadges, initialOnlineContent, initialLiveClasses, initialStudents } from '../data';
import { trpc } from '../lib/trpc';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface DataState {
  units: Unit[];
  students: Student[];
  leads: Lead[];
  users: User[];
  onlineContent: OnlineContent[];
  tasks: Task[];
  subunits: SubUnit[];
  kihapEvents: KihapEvent[];
  eventCheckins: EventCheckin[];
  messages: Message[];
  badges: Badge[];
  studentBadges: StudentBadge[];
  liveClasses: LiveClass[];
  notifications: Notification[];
  physicalTests: PhysicalTest[];

  addPhysicalTest: (test: Omit<PhysicalTest, 'id'>) => void;
  updatePhysicalTest: (test: PhysicalTest) => void;
  deletePhysicalTest: (testId: string) => void;
  
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (unit: Unit) => void;
  deleteUnit: (unitId: string) => void;
  
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  
  addLead: (lead: CreateLeadInput) => Promise<void>;
  updateLead: (lead: UpdateLeadInput) => Promise<void>;
  deleteLead: (leadId: string) => void;
  fetchLeads: () => Promise<void>;
  
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;

  addContent: (content: Omit<OnlineContent, 'id'>) => void;
  updateContent: (content: OnlineContent) => void;
  deleteContent: (contentId: number) => void;

  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  completeTask: (taskId: number) => void;

  addSubUnit: (subunit: Omit<SubUnit, 'id'>) => void;
  updateSubUnit: (subunit: SubUnit) => void;
  deleteSubUnit: (subunitId: string) => void;

  sendMessage: (message: Omit<Message, 'id'>) => void;
  markMessageAsRead: (messageId: string) => void;

  addBadge: (badge: Omit<Badge, 'id'>) => void;
  updateBadge: (badge: Badge) => void;
  deleteBadge: (badgeId: string) => void;

  awardBadge: (studentBadge: Omit<StudentBadge, 'id'>) => void;
  removeBadge: (studentBadgeId: string) => void;
}

// Extrair todas as subunidades das unidades iniciais
const initialSubunits = initialUnits.reduce((acc: SubUnit[], unit) => {
  if (unit.subunits) {
    return [...acc, ...unit.subunits.map(subunit => ({
      ...subunit,
      unitId: unit.id
    }))];
  }
  return acc;
}, []);

// Log para debug
console.log('Initial Units:', JSON.stringify(initialUnits, null, 2));
console.log('Initial Subunits:', JSON.stringify(initialSubunits, null, 2));

export const useDataStore = createStore<DataState>()((set) => ({
  units: initialUnits,
  students: initialStudents || [],
  leads: [], // Inicializa vazio, será preenchido pelo fetchLeads
  users: initialUsers || [],
  onlineContent: initialOnlineContent,
  tasks: [],
  subunits: initialSubunits,
  kihapEvents: [],
  eventCheckins: [],
  messages: [],
  badges: beltBadges,
  studentBadges: [],
  liveClasses: initialLiveClasses,
  notifications: [],
  physicalTests: [],

  addPhysicalTest: (test) =>
    set((state) => ({
      physicalTests: [...state.physicalTests, { ...test, id: crypto.randomUUID() }],
    })),

  updatePhysicalTest: (test) =>
    set((state) => ({
      physicalTests: state.physicalTests.map((t) => (t.id === test.id ? test : t)),
    })),

  deletePhysicalTest: (testId) =>
    set((state) => ({
      physicalTests: state.physicalTests.filter((t) => t.id !== testId),
    })),

  addUnit: (unit) =>
    set((state) => ({
      units: [...state.units, { ...unit, id: crypto.randomUUID() }],
    })),

  updateUnit: (unit) =>
    set((state) => ({
      units: state.units.map((u) => (u.id === unit.id ? unit : u)),
    })),

  deleteUnit: (unitId) =>
    set((state) => ({
      units: state.units.filter((u) => u.id !== unitId),
    })),

  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, { ...student, id: crypto.randomUUID() }],
    })),

  updateStudent: (student) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === student.id ? student : s)),
    })),

  deleteStudent: (studentId) =>
    set((state) => ({
      students: state.students.filter((s) => s.id !== studentId),
    })),

  addLead: async (lead) => {
    const newLead: Lead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      history: [],
      status: lead.status || 'novo'
    };
    
    set((state) => {
      const newLeads = [newLead, ...state.leads];
      // Salva no localStorage
      localStorage.setItem('kihap_leads', JSON.stringify(newLeads));
      return { leads: newLeads };
    });
  },

  updateLead: async (lead) => {
    set((state) => {
      const currentLead = state.leads.find(l => l.id === lead.id);
      if (!currentLead) return state;

      const updatedLead: Lead = {
        ...currentLead,
        ...lead,
        history: lead.history || currentLead.history
      };

      const updatedLeads = state.leads.map((l) => l.id === lead.id ? updatedLead : l);
      // Salva no localStorage
      localStorage.setItem('kihap_leads', JSON.stringify(updatedLeads));
      return { leads: updatedLeads };
    });
  },

  deleteLead: (leadId) =>
    set((state) => {
      const filteredLeads = state.leads.filter((l) => l.id !== leadId);
      // Salva no localStorage
      localStorage.setItem('kihap_leads', JSON.stringify(filteredLeads));
      return { leads: filteredLeads };
    }),

  fetchLeads: async () => {
    // Carrega do localStorage
    const savedLeads = localStorage.getItem('kihap_leads');
    if (savedLeads) {
      set({ leads: JSON.parse(savedLeads) });
    }
  },

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, { ...user, id: crypto.randomUUID() }],
    })),

  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
    })),

  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  addContent: (content) =>
    set((state) => ({
      onlineContent: [...state.onlineContent, { ...content, id: state.onlineContent.length + 1 }],
    })),

  updateContent: (content) =>
    set((state) => ({
      onlineContent: state.onlineContent.map((c) =>
        c.id === content.id ? { ...c, ...content } : c
      ),
    })),

  deleteContent: (contentId) =>
    set((state) => ({
      onlineContent: state.onlineContent.filter((c) => c.id !== contentId),
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: state.tasks.length + 1 }],
    })),

  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),

  completeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'completed', completedAt: new Date().toISOString() } : t
      ),
    })),

  addSubUnit: (subunit) =>
    set((state) => ({
      subunits: [...state.subunits, { ...subunit, id: crypto.randomUUID() }],
    })),

  updateSubUnit: (subunit) =>
    set((state) => ({
      subunits: state.subunits.map((s) => (s.id === subunit.id ? subunit : s)),
    })),

  deleteSubUnit: (subunitId) =>
    set((state) => ({
      subunits: state.subunits.filter((s) => s.id !== subunitId),
    })),

  sendMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: crypto.randomUUID() }],
    })),

  markMessageAsRead: (messageId) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, read: true } : m
      ),
    })),

  addBadge: (badge) =>
    set((state) => ({
      badges: [...state.badges, { ...badge, id: crypto.randomUUID() }],
    })),

  updateBadge: (badge) =>
    set((state) => ({
      badges: state.badges.map((b) => (b.id === badge.id ? badge : b)),
    })),

  deleteBadge: (badgeId) =>
    set((state) => ({
      badges: state.badges.filter((b) => b.id !== badgeId),
    })),

  awardBadge: (studentBadge) =>
    set((state) => ({
      studentBadges: [...state.studentBadges, { ...studentBadge, id: crypto.randomUUID() }],
    })),

  removeBadge: (studentBadgeId) =>
    set((state) => ({
      studentBadges: state.studentBadges.filter((sb) => sb.id !== studentBadgeId),
    })),
}));
