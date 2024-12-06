export interface KihapEvent {
  id: string;
  name: string;
  description: string | null;
  date: string;
  location: string;
  unit_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventCheckin {
  id: string;
  event_id: string;
  student_id: string;
  checkin_time: string;
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

export interface Student {
  id: string;
  name: string;
  belt: string;
  user_id: string;
  // Adicione outros campos conforme necessário
}

export interface Unit {
  id: string;
  name: string;
  // Adicione outros campos conforme necessário
}

export interface User {
  id: string;
  role: 'student' | 'instructor' | 'admin';
  // Adicione outros campos conforme necessário
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

// Tipos para erros
export interface ApiError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}
