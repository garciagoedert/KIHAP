export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  unitId?: string;
  password?: string;
  active?: boolean;
  photo?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  unitId: string;
  subUnitId?: string;
  cpf?: string;
  belt?: string;
  trainingDays?: string[];
  trainingSchedule?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  photo?: string;
  age?: number;
  registrationDate?: string;
  lastAttendance?: string;
  active?: boolean;
  instructorId?: string;
  storeId?: string;
  badges?: string[];
  physicalTests?: PhysicalTest[];
  contract?: string;
  favoriteContent?: string[];
  completedContent?: string[];
  userId?: string;
}

export interface Unit {
  id: string;
  name: string;
  address: string;
  phone: string;
  city?: string;
  state?: string;
  subunits?: SubUnit[];
  type?: 'physical' | 'online';
}

export interface SubUnit {
  id: string;
  name: string;
  unitId: string;
  address: string;
  parentUnitId?: string;
  phone?: string;
  email?: string;
}

export interface KihapEvent {
  id: string;
  name: string;
  description: string | null;
  date: string;
  location: string;
  unitId: string;
  active: boolean;
  status?: 'active' | 'cancelled' | 'completed';
  maxParticipants?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventCheckin {
  id: string;
  eventId: string;
  studentId: string;
  checkinTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCheckinWithDetails extends EventCheckin {
  studentName: string;
  studentBelt: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

export type LeadStatus = 'novo' | 'contato' | 'visitou' | 'matriculado' | 'desistente';

export interface LeadHistory {
  id: string;
  leadId: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  type: 'status_change' | 'note' | 'contact';
  oldStatus?: LeadStatus;
  newStatus?: LeadStatus;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  unitId: string;
  subUnitId?: string;
  notes?: string;
  value?: number;
  status: LeadStatus;
  createdAt: string;
  history?: LeadHistory[];
  priority?: 'baixa' | 'media' | 'alta';
  nextContactDate?: string;
  lastContactDate?: string;
  tags?: string[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'completed';
  assignedTo: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
  createdBy: number;
}

export interface OnlineContent {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'live' | 'image' | 'document';
  isPublished?: boolean;
  targetStudentIds?: string[];
  targetBelts?: string[];
  unitId?: string;
  thumbnailUrl?: string;
  createdAt: string;
  scheduledFor?: string;
  tags?: string[];
}

export interface PhysicalTest {
  id: string;
  studentId: string;
  date: string;
  type: string;
  result: number;
  notes?: string;
}

// Tipos para parâmetros de funções
export interface CreateEventParams {
  name: string;
  description?: string;
  date: string;
  location: string;
  unitId: string;
}

export interface CreateCheckinParams {
  eventId: string;
  studentId: string;
  checkinTime: string;
}

// Enums úteis
export enum UserRole {
  Student = 'student',
  Instructor = 'instructor',
  Admin = 'admin'
}

export enum BeltRank {
  White = 'white',
  Yellow = 'yellow',
  Green = 'green',
  Blue = 'blue',
  Red = 'red',
  Black = 'black'
}

// Tipos para badges
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
  category: string;
  type: string;
  beltLevel?: string;
  color: string;
  icon: string;
}

export interface StudentBadge {
  id: string;
  studentId: string;
  badgeId: string;
  awardedAt: string;
}

// Tipos para aulas ao vivo
export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  startTime: string;
  duration: number;
  maxParticipants: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledFor: string;
}

// Tipos para notificações
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

// Tipos para erros
export interface ApiError extends Error {
  code?: string;
  details?: string;
}

// Tipos para criação/atualização de leads
export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  source: string;
  unitId: string;
  subUnitId?: string;
  notes?: string;
  value?: number;
  status?: LeadStatus;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {
  id: string;
  history?: LeadHistory[];
  nextContactDate?: string;
  lastContactDate?: string;
  priority?: 'baixa' | 'media' | 'alta';
  tags?: string[];
}
