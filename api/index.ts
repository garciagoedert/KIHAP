import { initTRPC } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import type {
  KihapEvent,
  EventCheckin,
  Student,
  Lead,
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

const leadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  source: z.string(),
  unitId: z.string(),
  notes: z.string().optional(),
  value: z.number().optional(),
  status: z.enum(['novo', 'contato', 'visitou', 'matriculado', 'desistente']).default('novo')
});

// Rotas da API
const appRouter = router({
  // Leads
  getLeads: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Lead[];
  }),

  createLead: publicProcedure
    .input(leadSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          ...input,
          created_at: new Date().toISOString(),
          history: []
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Lead;
    }),

  updateLead: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      ...leadSchema.partial().shape
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Lead;
    }),

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

// Handler para requisições Vercel V0
export const config = {
  runtime: 'edge',
  regions: ['gru1'], // São Paulo
};

export default async function handler(
  req: Request,
) {
  // Configuração de CORS
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'https://kihap.vercel.app',
    'http://localhost:5177',
    'http://localhost:5173'
  ];

  const corsHeaders = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') 
      ? origin! 
      : allowedOrigins[0],
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Tratamento de erros global
  try {
    const response = await fetchRequestHandler({
      endpoint: '/api',
      req,
      router: appRouter,
      createContext: () => ({}),
    });

    // Adiciona headers CORS à resposta
    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('API Error:', error);
    const apiError = error as ApiError;
    
    return new Response(
      JSON.stringify({
        error: {
          message: apiError.message || 'Erro interno do servidor',
          code: apiError.code,
          details: apiError.details
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}
