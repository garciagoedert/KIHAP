import { VercelRequest, VercelResponse } from '@vercel/node';
import { initTRPC } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import type {
  KihapEvent,
  EventCheckin,
  Student,
  CreateEventParams,
  CreateCheckinParams,
  ApiError
} from '../src/types/supabase';

// Inicialização do tRPC
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// Inicialização do Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Schemas Zod
const eventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  date: z.string().datetime(),
  location: z.string().min(1, 'Localização é obrigatória'),
  unit_id: z.string().uuid()
});

const checkinSchema = z.object({
  event_id: z.string().uuid(),
  student_id: z.string().uuid()
});

// Rotas da API
const appRouter = router({
  // Eventos
  getEvents: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('kihap_events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data as KihapEvent[];
  }),

  getEventById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('kihap_events')
        .select('*')
        .eq('id', input)
        .single();
      
      if (error) throw error;
      return data as KihapEvent;
    }),

  createEvent: publicProcedure
    .input(eventSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('kihap_events')
        .insert([input])
        .select()
        .single();
      
      if (error) throw error;
      return data as KihapEvent;
    }),

  updateEvent: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      ...eventSchema.partial().shape
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const { data, error } = await supabase
        .from('kihap_events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as KihapEvent;
    }),

  // Checkins
  getEventCheckins: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('event_checkins_with_details')
        .select('*')
        .eq('event_id', input);
      
      if (error) throw error;
      return data;
    }),

  createCheckin: publicProcedure
    .input(checkinSchema)
    .mutation(async ({ input }) => {
      // Verifica se o aluno pode fazer checkin
      const { data: canCheckin } = await supabase
        .rpc('can_student_checkin', {
          p_event_id: input.event_id,
          p_student_id: input.student_id
        });

      if (!canCheckin) {
        throw new Error('Checkin não permitido neste momento');
      }

      const { data, error } = await supabase
        .from('event_checkins')
        .insert([{
          ...input,
          checkin_time: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as EventCheckin;
    }),

  // Estudantes
  getStudents: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Student[];
  }),

  getStudentById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', input)
        .single();
      
      if (error) throw error;
      return data as Student;
    })
});

// Tipos exportados
export type AppRouter = typeof appRouter;

// Handler para requisições Vercel
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Tratamento de erros global
  try {
    return await fetchRequestHandler({
      endpoint: '/api',
      req: req as unknown as Request,
      router: appRouter,
      createContext: () => ({}),
    });
  } catch (error) {
    console.error('API Error:', error);
    const apiError = error as ApiError;
    res.status(500).json({
      error: {
        message: apiError.message || 'Erro interno do servidor',
        code: apiError.code,
        details: apiError.details
      }
    });
  }
}
