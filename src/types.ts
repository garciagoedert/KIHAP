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
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  belt?: string;
  commissionRate?: number;
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

export type LeadStatus = 'novo' | 'contato' | 'visitou' | 'matriculado' | 'desistente';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  notes?: string;
  createdAt: string;
  unitId?: string;
  history?: LeadHistory[];
  value?: number;
}

export interface LeadHistory {
  id: string;
  leadId: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  type: 'status_change' | 'note' | 'contact';
  oldStatus?: LeadStatus;
  newStatus?: LeadStatus;
  description?: string;
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  createdAt: string;
  userId: string;
  read: boolean;
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

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  startTime: string;
  duration: number;
  maxParticipants: number;
  status?: string;
  targetStudentIds?: string[];
  targetBelts?: string[];
  unitId?: string;
  scheduledFor?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
  category?: string;
  beltLevel?: string;
  color?: string;
  icon?: string;
  type?: string;
  image?: string;
}

export interface StudentBadge {
  id: string;
  studentId: string;
  badgeId: string;
  awardedAt: string;
  awardedBy?: string;
}

export interface PhysicalTest {
  id: string;
  studentId: string;
  date: string;
  type: string;
  result: number;
  notes?: string;
}

export interface Store {
  id: string;
  name: string;
  unitId: string;
  city?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  storeId?: string;
  image?: string;
  active?: boolean;
}

export interface Sale {
  id: string;
  productId: string;
  studentId: string;
  quantity: number;
  totalPrice: number;
  date: string;
  product?: Product;
  student?: Student;
  price?: number;
  status?: string;
  createdAt?: string;
}

export interface Commission {
  id: string;
  saleId: string;
  instructorId: string;
  amount: number;
  status: 'pending' | 'paid';
  instructor?: Instructor;
  sale?: Sale;
  createdAt?: string;
}

export interface KihapEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  unitId: string;
  name?: string;
  active?: boolean;
  status?: 'active' | 'cancelled' | 'completed';
}

export interface EventCheckin {
  id: string;
  eventId: string;
  studentId: string;
  checkinTime: string;
}

export interface Class {
  id: string;
  startTime: string;
  endTime: string;
  type: 'ADULTO' | 'KIDS' | 'BABY LITTLE' | 'LITTLE' | 'FAIXA PRETA' | 'SPARRING';
  instructor: string;
  capacity: number;
  enrolled: number;
  subUnit?: string;
}
