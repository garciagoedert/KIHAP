import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import mongoose from 'mongoose';
import {
  Unit,
  Subunit,
  User,
  Student,
  KihapEvent,
  EventCheckin,
  Lead
} from './models.js';

config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conecta ao MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kihap';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

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

// Inicializa a unidade padrão se não existir
async function initializeDefaultUnit() {
  try {
    const defaultUnit = await Unit.findById('1');
    if (!defaultUnit) {
      console.log('Criando unidade padrão...');
      await Unit.create({
        _id: '1',
        name: 'Kihap Florianópolis'
      });
    }
  } catch (error) {
    console.error('Erro ao criar unidade padrão:', error);
  }
}
initializeDefaultUnit();

// Rotas para unidades
app.get('/api/units', authMiddleware, async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/units', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const unit = await Unit.create({
      _id: uuidv4(),
      name
    });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para eventos
app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const events = await KihapEvent.find({ active: true });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    const { name, description, date, location, unitId } = req.body;
    const event = await KihapEvent.create({
      _id: uuidv4(),
      name,
      description,
      date,
      location,
      unitId
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para checkins
app.get('/api/checkins', authMiddleware, async (req, res) => {
  try {
    const checkins = await EventCheckin.find()
      .populate('studentId', 'name belt')
      .populate('eventId', 'name date location');
    res.json(checkins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/checkins', authMiddleware, async (req, res) => {
  try {
    const { eventId, studentId } = req.body;
    const checkin = await EventCheckin.create({
      _id: uuidv4(),
      eventId,
      studentId,
      checkinTime: new Date()
    });
    res.json(checkin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para usuários
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', authMiddleware, async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await User.create({
      _id: uuidv4(),
      email,
      role
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para estudantes
app.get('/api/students', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', authMiddleware, async (req, res) => {
  try {
    const { userId, name, belt } = req.body;
    const student = await Student.create({
      _id: uuidv4(),
      userId,
      name,
      belt
    });
    res.json(student);
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
process.on('SIGINT', async () => {
  console.log('Fechando conexão com o MongoDB...');
  await mongoose.connection.close();
  process.exit(0);
});
