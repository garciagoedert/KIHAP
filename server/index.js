import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicializa o banco de dados SQLite
const db = new Database('database.sqlite');

// Carrega e executa o schema SQL
const schema = fs.readFileSync(join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

const app = express();
const port = 3000;

// Configura CORS para permitir acesso de qualquer origem
app.use(cors());
app.use(express.json());

// Middleware para autenticação básica
const authMiddleware = (req, res, next) => {
  // Por enquanto, vamos considerar todos os requests como autenticados
  // Em produção, você implementaria verificação de token JWT aqui
  req.user = {
    id: 'local-user',
    role: 'admin'
  };
  next();
};

// Função para obter o IP da máquina
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pula endereços não IPv4 e localhost
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Rotas para unidades
app.get('/api/units', authMiddleware, (req, res) => {
  const units = db.prepare('SELECT * FROM units').all();
  res.json(units);
});

app.post('/api/units', authMiddleware, (req, res) => {
  const { name } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare('INSERT INTO units (id, name) VALUES (?, ?)').run(id, name);
    res.json({ id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para eventos
app.get('/api/events', authMiddleware, (req, res) => {
  const events = db.prepare('SELECT * FROM kihap_events WHERE active = 1').all();
  res.json(events);
});

app.post('/api/events', authMiddleware, (req, res) => {
  const { name, description, date, location, unit_id } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare(`
      INSERT INTO kihap_events (id, name, description, date, location, unit_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, description, date, location, unit_id);
    
    res.json({ id, name, description, date, location, unit_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para checkins
app.get('/api/checkins', authMiddleware, (req, res) => {
  const checkins = db.prepare('SELECT * FROM event_checkins_with_details').all();
  res.json(checkins);
});

app.post('/api/checkins', authMiddleware, (req, res) => {
  const { event_id, student_id } = req.body;
  const id = uuidv4();
  const checkin_time = new Date().toISOString();
  
  try {
    db.prepare(`
      INSERT INTO event_checkins (id, event_id, student_id, checkin_time)
      VALUES (?, ?, ?, ?)
    `).run(id, event_id, student_id, checkin_time);
    
    res.json({ id, event_id, student_id, checkin_time });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para usuários
app.get('/api/users', authMiddleware, (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.post('/api/users', authMiddleware, (req, res) => {
  const { email, role } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare('INSERT INTO users (id, email, role) VALUES (?, ?, ?)')
      .run(id, email, role);
    res.json({ id, email, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para estudantes
app.get('/api/students', authMiddleware, (req, res) => {
  const students = db.prepare('SELECT * FROM students').all();
  res.json(students);
});

app.post('/api/students', authMiddleware, (req, res) => {
  const { user_id, name, belt } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare('INSERT INTO students (id, user_id, name, belt) VALUES (?, ?, ?, ?)')
      .run(id, user_id, name, belt);
    res.json({ id, user_id, name, belt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de healthcheck
app.get('/api/healthcheck', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota para obter o endereço do servidor
app.get('/api/server-info', (req, res) => {
  const localIP = getLocalIP();
  res.json({
    ip: localIP,
    port: port,
    url: `http://${localIP}:${port}`
  });
});

const localIP = getLocalIP();
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor central rodando em:`);
  console.log(`- Local: http://localhost:${port}`);
  console.log(`- Rede: http://${localIP}:${port}`);
  console.log('\nOutros dispositivos podem se conectar usando o endereço da rede');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Fechando conexão com o banco de dados...');
  db.close();
  process.exit(0);
});
