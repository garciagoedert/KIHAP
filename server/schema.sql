-- Tabela de metadados de sincronização
CREATE TABLE IF NOT EXISTS sync_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Tabela para unidades
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  type TEXT CHECK (type IN ('physical', 'online')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para subunidades
CREATE TABLE IF NOT EXISTS subunits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unitId TEXT NOT NULL,
  address TEXT NOT NULL,
  parentUnitId TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unitId) REFERENCES units(id) ON DELETE CASCADE,
  FOREIGN KEY (parentUnitId) REFERENCES units(id) ON DELETE SET NULL
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
  unitId TEXT REFERENCES units(id) ON DELETE CASCADE,
  active INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para checkins em eventos
CREATE TABLE IF NOT EXISTS event_checkins (
  id TEXT PRIMARY KEY,
  eventId TEXT REFERENCES kihap_events(id) ON DELETE CASCADE,
  studentId TEXT REFERENCES students(id) ON DELETE CASCADE,
  checkinTime DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(eventId, studentId)
);

-- Tabela para leads
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT NOT NULL,
  unitId TEXT NOT NULL,
  subUnitId TEXT,
  notes TEXT,
  value REAL,
  status TEXT NOT NULL CHECK (status IN ('novo', 'contato', 'visitou', 'matriculado', 'desistente')),
  history TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unitId) REFERENCES units(id),
  FOREIGN KEY (subUnitId) REFERENCES subunits(id)
);

-- View para checkins com detalhes
CREATE VIEW IF NOT EXISTS event_checkins_with_details AS
SELECT 
  ec.*,
  s.name as studentName,
  s.belt as studentBelt,
  ke.name as eventName,
  ke.date as eventDate,
  ke.location as eventLocation
FROM event_checkins ec
JOIN students s ON ec.studentId = s.id
JOIN kihap_events ke ON ec.eventId = ke.id;
