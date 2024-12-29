import { createClient } from '@supabase/supabase-js';
import Database from 'better-sqlite3';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const db = new Database('database.sqlite');

// Função para obter o último timestamp de sincronização
function getLastSync(table) {
  const result = db.prepare('SELECT value FROM sync_meta WHERE key = ?').get(`last_sync_${table}`);
  return result ? result.value : '1970-01-01T00:00:00Z';
}

// Função para atualizar o timestamp de sincronização
function updateLastSync(table, timestamp) {
  db.prepare(`
    INSERT INTO sync_meta (key, value) 
    VALUES (?, ?) 
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(`last_sync_${table}`, timestamp);
}

// Função para sincronizar uma tabela específica
async function syncTable(tableName) {
  const lastSync = getLastSync(tableName);
  const now = new Date().toISOString();

  try {
    // Busca alterações do Supabase
    const { data: remoteChanges, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .gt('updated_at', lastSync);

    if (fetchError) throw fetchError;

    // Busca alterações locais
    const localChanges = db.prepare(`
      SELECT * FROM ${tableName} 
      WHERE updated_at > datetime(?)
    `).all(lastSync);

    // Prepara statements para upsert baseado no tipo de tabela
    let upsertLocal;
    switch (tableName) {
      case 'leads':
        upsertLocal = db.prepare(`
          INSERT INTO leads (id, name, email, phone, source, unitId, notes, value, status, history, created_at, updated_at)
          VALUES (@id, @name, @email, @phone, @source, @unitId, @notes, @value, @status, @history, @created_at, @updated_at)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            email = excluded.email,
            phone = excluded.phone,
            source = excluded.source,
            unitId = excluded.unitId,
            notes = excluded.notes,
            value = excluded.value,
            status = excluded.status,
            history = excluded.history,
            updated_at = excluded.updated_at
          WHERE excluded.updated_at > updated_at
        `);
        break;

      case 'units':
        upsertLocal = db.prepare(`
          INSERT INTO units (id, name, created_at, updated_at)
          VALUES (@id, @name, @created_at, @updated_at)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            updated_at = excluded.updated_at
          WHERE excluded.updated_at > updated_at
        `);
        break;

      case 'users':
        upsertLocal = db.prepare(`
          INSERT INTO users (id, email, role, created_at, updated_at)
          VALUES (@id, @email, @role, @created_at, @updated_at)
          ON CONFLICT(id) DO UPDATE SET
            email = excluded.email,
            role = excluded.role,
            updated_at = excluded.updated_at
          WHERE excluded.updated_at > updated_at
        `);
        break;

      case 'students':
        upsertLocal = db.prepare(`
          INSERT INTO students (id, user_id, name, belt, created_at, updated_at)
          VALUES (@id, @user_id, @name, @belt, @created_at, @updated_at)
          ON CONFLICT(id) DO UPDATE SET
            user_id = excluded.user_id,
            name = excluded.name,
            belt = excluded.belt,
            updated_at = excluded.updated_at
          WHERE excluded.updated_at > updated_at
        `);
        break;

      case 'kihap_events':
        upsertLocal = db.prepare(`
          INSERT INTO kihap_events (id, name, description, date, location, unit_id, active, created_at, updated_at)
          VALUES (@id, @name, @description, @date, @location, @unit_id, @active, @created_at, @updated_at)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            date = excluded.date,
            location = excluded.location,
            unit_id = excluded.unit_id,
            active = excluded.active,
            updated_at = excluded.updated_at
          WHERE excluded.updated_at > updated_at
        `);
        break;

      case 'event_checkins':
        upsertLocal = db.prepare(`
          INSERT INTO event_checkins (id, event_id, student_id, checkin_time, created_at, updated_at)
          VALUES (@id, @event_id, @student_id, @checkin_time, @created_at, @updated_at)
          ON CONFLICT(id) DO UPDATE SET
            event_id = excluded.event_id,
            student_id = excluded.student_id,
            checkin_time = excluded.checkin_time,
            updated_at = excluded.updated_at
          WHERE excluded.updated_at > updated_at
        `);
        break;

      default:
        throw new Error(`Tabela não suportada: ${tableName}`);
    }

    // Inicia transação local
    const transaction = db.transaction((changes) => {
      for (const change of changes) {
        upsertLocal.run(change);
      }
    });

    // Aplica mudanças remotas localmente
    if (remoteChanges.length > 0) {
      transaction(remoteChanges);
    }

    // Envia mudanças locais para o Supabase
    if (localChanges.length > 0) {
      const { error: upsertError } = await supabase
        .from(tableName)
        .upsert(localChanges, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (upsertError) throw upsertError;
    }

    // Atualiza timestamp de última sincronização
    updateLastSync(tableName, now);

    console.log(`Sincronização de ${tableName} concluída:`, {
      remoteChanges: remoteChanges.length,
      localChanges: localChanges.length
    });

  } catch (error) {
    console.error(`Erro ao sincronizar ${tableName}:`, error);
    throw error;
  }
}

// Função principal de sincronização
export async function syncAll() {
  try {
    // Cria tabela de metadados de sincronização se não existir
    db.prepare(`
      CREATE TABLE IF NOT EXISTS sync_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `).run();

    // Lista de tabelas para sincronizar
    const tables = ['leads', 'kihap_events', 'event_checkins', 'students', 'users', 'units'];

    // Sincroniza cada tabela
    for (const table of tables) {
      await syncTable(table);
    }

    console.log('Sincronização completa concluída com sucesso');
  } catch (error) {
    console.error('Erro durante sincronização:', error);
    throw error;
  }
}

// Função para iniciar sincronização periódica
export function startSync(intervalMinutes = 5) {
  // Sincroniza imediatamente ao iniciar
  syncAll().catch(console.error);

  // Agenda sincronizações periódicas
  setInterval(() => {
    syncAll().catch(console.error);
  }, intervalMinutes * 60 * 1000);
}
