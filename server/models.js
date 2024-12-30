import mongoose from 'mongoose';
const { Schema } = mongoose;

// Schema para unidades
const unitSchema = new Schema({
  _id: { type: String, required: true }, // Mantendo o UUID como ID
  name: { type: String, required: true },
  address: String,
  phone: String,
  city: String,
  state: String,
  type: {
    type: String,
    enum: ['physical', 'online']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Schema para subunidades
const subunitSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  unitId: { type: String, ref: 'Unit', required: true },
  address: { type: String, required: true },
  parentUnitId: { type: String, ref: 'Unit' },
  phone: String,
  email: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Schema para usuários
const userSchema = new Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ['student', 'instructor', 'admin']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Schema para estudantes
const studentSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, ref: 'User' },
  name: { type: String, required: true },
  belt: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Schema para eventos KIHAP
const kihapEventSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: { type: String, required: true },
  unitId: { type: String, ref: 'Unit', required: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Schema para checkins em eventos
const eventCheckinSchema = new Schema({
  _id: { type: String, required: true },
  eventId: { type: String, ref: 'KihapEvent', required: true },
  studentId: { type: String, ref: 'Student', required: true },
  checkinTime: { type: Date, required: true }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Schema para leads
const leadSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, required: true },
  unitId: { type: String, ref: 'Unit', required: true },
  subUnitId: { type: String, ref: 'Subunit' },
  notes: String,
  value: Number,
  status: {
    type: String,
    required: true,
    enum: ['novo', 'contato', 'visitou', 'matriculado', 'desistente']
  },
  history: { type: String, default: '[]' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Criando os modelos
const Unit = mongoose.model('Unit', unitSchema);
const Subunit = mongoose.model('Subunit', subunitSchema);
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const KihapEvent = mongoose.model('KihapEvent', kihapEventSchema);
const EventCheckin = mongoose.model('EventCheckin', eventCheckinSchema);
const Lead = mongoose.model('Lead', leadSchema);

// Adicionando índices únicos
eventCheckinSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export {
  Unit,
  Subunit,
  User,
  Student,
  KihapEvent,
  EventCheckin,
  Lead
};
