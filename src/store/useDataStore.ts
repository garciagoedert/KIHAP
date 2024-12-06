import { create as createStore } from 'zustand';
import type { Unit, Student, Lead, User, OnlineContent, Task, SubUnit, KihapEvent, EventCheckin } from '../types';
import { initialUnits, initialLeads, initialUsers } from '../data';

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
  
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (unit: Unit) => void;
  deleteUnit: (unitId: string) => void;
  
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;
  
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
}

export const useDataStore = createStore<DataState>()((set) => ({
  units: initialUnits,
  students: [],
  leads: initialLeads,
  users: initialUsers,
  onlineContent: [],
  tasks: [],
  subunits: [],
  kihapEvents: [],
  eventCheckins: [],
  messages: [],

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

  addLead: (lead) =>
    set((state) => ({
      leads: [...state.leads, { ...lead, id: crypto.randomUUID() }],
    })),

  updateLead: (lead) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === lead.id ? lead : l)),
    })),

  deleteLead: (leadId) =>
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== leadId),
    })),

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
}));
