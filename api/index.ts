import { initTRPC } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';
import type {
  KihapEvent,
  EventCheckin,
  Student,
  Lead,
  ApiError
} from '../src/types';

// Inicialização do tRPC
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// Inicialização do SQLite
const db = new Database('server/database.sqlite');

// Schemas Zod
const eventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  date: z.string().datetime(),
  location: z.string().min(1, 'Localização é obrigatória'),
  unitId: z.string().uuid()
});

const checkinSchema = z.object({
  eventId: z.string().uuid(),
  studentId: z.string().uuid()
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

// Função auxiliar para verificar se um aluno pode fazer checkin
interface DbEvent {
  id: string;
  name: string;
  description: string | null;
  date: string;
  location: string;
  unitId: string;
  active: number;
  createdAt: string;
  updatedAt: string | null;
}

function canStudentCheckin(eventId: string, studentId: string): boolean {
  const event = db.prepare('SELECT date FROM kihap_events WHERE id = ?').get(eventId) as DbEvent | undefined;
  if (!event) return false;

  const hasCheckin = db.prepare(
    'SELECT 1 FROM event_checkins WHERE eventId = ? AND studentId = ?'
  ).get(eventId, studentId);
  if (hasCheckin) return false;

  const eventDate = new Date(event.date);
  const now = new Date();
  const hoursDiff = Math.abs(eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursDiff <= 2;
}

// Rotas da API
const appRouter = router({
  // Leads
  getLeads: publicProcedure.query(() => {
    return db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all() as Lead[];
  }),

  createLead: publicProcedure
    .input(leadSchema)
    .mutation(({ input }) => {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      
      db.prepare(`
        INSERT INTO leads (id, name, email, phone, source, unitId, notes, value, status, createdAt, history)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        input.name,
        input.email,
        input.phone,
        input.source,
        input.unitId,
        input.notes,
        input.value,
        input.status,
        createdAt,
        '[]'
      );

      return db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Lead;
    }),

  updateLead: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      ...leadSchema.partial().shape
    }))
    .mutation(({ input }) => {
      const { id, ...updateData } = input;
      const setClause = Object.keys(updateData)
        .map(key => `${key} = @${key}`)
        .join(', ');

      db.prepare(`
        UPDATE leads
        SET ${setClause}
        WHERE id = @id
      `).run({ ...updateData, id });

      return db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Lead;
    }),

  // Eventos
  getEvents: publicProcedure.query(() => {
    return db.prepare(
      'SELECT * FROM kihap_events WHERE active = 1 ORDER BY date ASC'
    ).all() as KihapEvent[];
  }),

  getEventById: publicProcedure
    .input(z.string().uuid())
    .query(({ input }) => {
      return db.prepare(
        'SELECT * FROM kihap_events WHERE id = ?'
      ).get(input) as KihapEvent;
    }),

  createEvent: publicProcedure
    .input(eventSchema)
    .mutation(({ input }) => {
      // Verifica se a unidade existe
      const unit = db.prepare('SELECT id FROM units WHERE id = ?').get(input.unitId);
      if (!unit) {
        throw new Error(`Unidade com ID ${input.unitId} não encontrada. Por favor, verifique se a unidade existe.`);
      }

      const id = uuidv4();
      const createdAt = new Date().toISOString();
      
      try {
        db.prepare(`
          INSERT INTO kihap_events (id, name, description, date, location, unitId, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          id,
          input.name,
          input.description,
          input.date,
          input.location,
          input.unitId,
          createdAt
        );

        return db.prepare('SELECT * FROM kihap_events WHERE id = ?').get(id) as KihapEvent;
      } catch (error) {
        console.error('Erro ao criar evento:', error);
        throw new Error(`Erro ao criar evento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }),

  updateEvent: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      ...eventSchema.partial().shape
    }))
    .mutation(({ input }) => {
      const { id, ...updateData } = input;
      const setClause = Object.keys(updateData)
        .map(key => `${key} = @${key}`)
        .join(', ');

      db.prepare(`
        UPDATE kihap_events
        SET ${setClause}, updatedAt = @updatedAt
        WHERE id = @id
      `).run({ ...updateData, id, updatedAt: new Date().toISOString() });

      return db.prepare('SELECT * FROM kihap_events WHERE id = ?').get(id) as KihapEvent;
    }),

  // Checkins
  getEventCheckins: publicProcedure
    .input(z.string().uuid())
    .query(({ input }) => {
      return db.prepare(
        'SELECT * FROM event_checkins_with_details WHERE eventId = ?'
      ).all(input);
    }),

  createCheckin: publicProcedure
    .input(checkinSchema)
    .mutation(({ input }) => {
      if (!canStudentCheckin(input.eventId, input.studentId)) {
        throw new Error('Checkin não permitido neste momento');
      }

      const id = uuidv4();
      const checkinTime = new Date().toISOString();
      
      db.prepare(`
        INSERT INTO event_checkins (id, eventId, studentId, checkinTime)
        VALUES (?, ?, ?, ?)
      `).run(id, input.eventId, input.studentId, checkinTime);

      return db.prepare('SELECT * FROM event_checkins WHERE id = ?').get(id) as EventCheckin;
    }),

  // Estudantes
  getStudents: publicProcedure.query(() => {
    return db.prepare('SELECT * FROM students ORDER BY name').all() as Student[];
  }),

  getStudentById: publicProcedure
    .input(z.string().uuid())
    .query(({ input }) => {
      return db.prepare('SELECT * FROM students WHERE id = ?').get(input) as Student;
    })
});

// Tipos exportados
export type AppRouter = typeof appRouter;

// Handler para requisições
export default async function handler(req: Request) {
  try {
    const origin = req.headers.get('origin');
    
    // Headers CORS
    const corsHeaders = {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    };

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

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
          code: apiError.code || 'INTERNAL_SERVER_ERROR',
          details: apiError.details || null
        }
      }),
      {
        status: apiError.code === 'NOT_FOUND' ? 404 : 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      }
    );
  }
}
