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
  user_id?: string;
}

export interface Unit {
  id: string;
  name: string;
  address: string;
  phone: string;
  city?: string;
  state?: string;
  subunits?: SubUnit[];
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
  title?: string;
  description: string | null;
  date: string;
  location: string;
  unit_id: string;
  unitId?: string;
  active: boolean;
  status?: 'active' | 'cancelled' | 'completed';
  maxParticipants?: number;
  created_at: string;
  updated_at: string;
}

export interface EventCheckin {
  id: string;
  event_id: string;
  eventId?: string;
  student_id: string;
  checkin_time: string;
  checkinTime?: string;
  created_at: string;
  updated_at: string;
}

export interface EventCheckinWithDetails extends EventCheckin {
  student_name: string;
  student_belt: string;
  event_name: string;
  event_date: string;
  event_location: string;
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
  notes?: string;
  value?: number;
  status: LeadStatus;
  createdAt: string;
  history?: LeadHistory[];
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  source: string;
  unitId: string;
  notes?: string;
  value?: number;
}

export interface UpdateLeadInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  unitId?: string;
  notes?: string;
  value?: number;
  status?: LeadStatus;
  history?: LeadHistory[];
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

// Tipos para as respostas da API
export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Tipos para os parâmetros das funções
export interface CreateEventParams {
  name: string;
  description?: string;
  date: string;
  location: string;
  unit_id: string;
}

export interface CreateCheckinParams {
  event_id: string;
  student_id: string;
  checkin_time: string;
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

// Tipos para queries e mutations do tRPC
export type GetEventsResponse = KihapEvent[];
export type GetEventByIdResponse = KihapEvent;
export type CreateEventResponse = KihapEvent;
export type UpdateEventResponse = KihapEvent;
export type DeleteEventResponse = { success: boolean };

export type GetCheckinsResponse = EventCheckinWithDetails[];
export type CreateCheckinResponse = EventCheckin;

export type GetLeadsResponse = Lead[];
export type CreateLeadResponse = Lead;
export type UpdateLeadResponse = Lead;

// Tipos para erros
export interface ApiError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}
