-- Tabela para unidades
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para usuários
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para estudantes
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  belt TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para eventos KIHAP
CREATE TABLE IF NOT EXISTS kihap_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date DATETIME NOT NULL,
  location TEXT NOT NULL,
  unit_id TEXT REFERENCES units(id) ON DELETE CASCADE,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para checkins em eventos
CREATE TABLE IF NOT EXISTS event_checkins (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES kihap_events(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  checkin_time DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, student_id)
);

-- Tabela para leads
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT NOT NULL,
  unitId TEXT NOT NULL,
  notes TEXT,
  value REAL,
  status TEXT NOT NULL CHECK (status IN ('novo', 'contato', 'visitou', 'matriculado', 'desistente')),
  history TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- View para checkins com detalhes
CREATE VIEW IF NOT EXISTS event_checkins_with_details AS
SELECT 
  ec.*,
  s.name as student_name,
  s.belt as student_belt,
  ke.name as event_name,
  ke.date as event_date,
  ke.location as event_location
FROM event_checkins ec
JOIN students s ON ec.student_id = s.id
JOIN kihap_events ke ON ec.event_id = ke.id;
