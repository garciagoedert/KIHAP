import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useScheduleStore from '../store/useScheduleStore';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { Class } from '../types';

const ClassSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'DIA' | 'SEMANA'>('SEMANA');
  const [period, setPeriod] = useState<'TODOS' | 'MANHÃ' | 'TARDE' | 'NOITE'>('TODOS');
  const [selectedSubUnit, setSelectedSubUnit] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Class>>({
    type: 'ADULTO',
    capacity: 20,
    enrolled: 0
  });

  const { classes, addClass, removeClass, updateClass, selectedClass, setSelectedClass } = useScheduleStore();
  const { subunits, units } = useDataStore();
  const user = useAuthStore(state => state.user);

  // Atualiza o formData quando as subunidades são carregadas
  useEffect(() => {
    if (subunits.length > 0 && !formData.subUnit) {
      setFormData(prev => ({
        ...prev,
        subUnit: selectedSubUnit || subunits[0].id
      }));
    }
  }, [subunits, selectedSubUnit]);

  const handleOpenModal = (classData?: Partial<Class>) => {
    // Se não houver subunidade selecionada no filtro, usa a primeira subunidade disponível
    const defaultSubUnit = selectedSubUnit || (subunits.length > 0 ? subunits[0].id : '');

    if (classData?.id) {
      // Editando uma aula existente
      setFormData(classData as Class);
      setSelectedClass(classData as Class);
    } else {
      // Criando uma nova aula
      setFormData({
        type: 'ADULTO',
        capacity: 20,
        enrolled: 0,
        startTime: classData?.startTime || '',
        subUnit: defaultSubUnit
      });
      setSelectedClass(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      type: 'ADULTO',
      capacity: 20,
      enrolled: 0,
      subUnit: selectedSubUnit || (subunits.length > 0 ? subunits[0].id : '')
    });
    setSelectedClass(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Garante que uma subunidade foi selecionada
    if (!formData.subUnit) {
      alert('Por favor, selecione uma subunidade');
      return;
    }

    if (selectedClass) {
      updateClass(selectedClass.id, formData);
    } else {
      addClass(formData as Class);
    }
    handleCloseModal();
  };

  // Cores para cada tipo de aula
  const classColors: Record<string, string> = {
    ADULTO: 'border-l-4 border-red-500',
    KIDS: 'border-l-4 border-green-500',
    'BABY LITTLE': 'border-l-4 border-yellow-500',
    LITTLE: 'border-l-4 border-blue-500',
    'FAIXA PRETA': 'border-l-4 border-black',
    SPARRING: 'border-l-4 border-purple-500',
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const generateWeekDays = () => {
    if (viewType === 'DIA') {
      return [currentDate];
    }

    const days = [];
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push(day);
    }
    
    return days;
  };

  const previousPeriod = () => {
    if (viewType === 'DIA') {
      setCurrentDate(prev => addDays(prev, -1));
    } else {
      setCurrentDate(prev => addDays(prev, -7));
    }
  };

  const nextPeriod = () => {
    if (viewType === 'DIA') {
      setCurrentDate(prev => addDays(prev, 1));
    } else {
      setCurrentDate(prev => addDays(prev, 7));
    }
  };

  const getClassesForTimeSlot = (timeSlot: string, dayIndex: number) => {
    return classes.filter(cls => {
      if (selectedSubUnit && cls.subUnit !== selectedSubUnit) {
        return false;
      }

      // Filtrar por período
      const hour = parseInt(timeSlot.split(':')[0]);
      if (period === 'MANHÃ' && (hour < 6 || hour >= 12)) return false;
      if (period === 'TARDE' && (hour < 12 || hour >= 18)) return false;
      if (period === 'NOITE' && (hour < 18 || hour >= 23)) return false;

      return cls.startTime === timeSlot;
    });
  };

  const getSubunitName = (subunitId: string) => {
    const subunit = subunits.find(su => su.id === subunitId);
    if (!subunit) return subunitId;
    const unit = units.find(u => u.id === subunit.unitId);
    return `${subunit.name} - ${unit?.name || ''}`;
  };

  const renderClass = (cls: Class) => (
    <div
      key={cls.id}
      className={`${classColors[cls.type]} bg-white rounded p-2 shadow-sm mb-1 relative group`}
    >
      <div className="text-sm font-semibold">{cls.type}</div>
      <div className="text-xs">{cls.instructor}</div>
      <div className="text-xs text-gray-600">
        {cls.enrolled}/{cls.capacity}
      </div>
      {cls.subUnit && (
        <div className="text-xs text-gray-500">
          {getSubunitName(cls.subUnit)}
        </div>
      )}
      <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(cls);
          }}
          className="p-1 bg-blue-100 hover:bg-blue-200 rounded"
          title="Editar"
        >
          <Edit2 size={14} className="text-blue-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeClass(cls.id);
          }}
          className="p-1 bg-red-100 hover:bg-red-200 rounded"
          title="Excluir"
        >
          <Trash2 size={14} className="text-red-600" />
        </button>
      </div>
    </div>
  );

  const gridCols = viewType === 'DIA' ? 'grid-cols-2' : 'grid-cols-8';

  return (
    <div className="container mx-auto p-4">
      {/* Cabeçalho com navegação e filtros */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${period === 'TODOS' ? 'bg-purple-600 text-white' : 'bg-purple-100'}`}
            onClick={() => setPeriod('TODOS')}
          >
            TODOS
          </button>
          <button
            className={`px-4 py-2 rounded ${period === 'MANHÃ' ? 'bg-purple-600 text-white' : 'bg-purple-100'}`}
            onClick={() => setPeriod('MANHÃ')}
          >
            MANHÃ
          </button>
          <button
            className={`px-4 py-2 rounded ${period === 'TARDE' ? 'bg-purple-600 text-white' : 'bg-purple-100'}`}
            onClick={() => setPeriod('TARDE')}
          >
            TARDE
          </button>
          <button
            className={`px-4 py-2 rounded ${period === 'NOITE' ? 'bg-purple-600 text-white' : 'bg-purple-100'}`}
            onClick={() => setPeriod('NOITE')}
          >
            NOITE
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={previousPeriod} className="p-2" title={viewType === 'DIA' ? 'Dia anterior' : 'Semana anterior'}>
            ←
          </button>
          <span className="font-semibold">
            {format(currentDate, "d 'de' MMMM", { locale: ptBR })}
          </span>
          <button onClick={nextPeriod} className="p-2" title={viewType === 'DIA' ? 'Próximo dia' : 'Próxima semana'}>
            →
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${viewType === 'DIA' ? 'bg-purple-600 text-white' : 'bg-purple-100'}`}
            onClick={() => setViewType('DIA')}
          >
            DIA
          </button>
          <button
            className={`px-4 py-2 rounded ${viewType === 'SEMANA' ? 'bg-purple-600 text-white' : 'bg-purple-100'}`}
            onClick={() => setViewType('SEMANA')}
          >
            SEMANA
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
            title="Adicionar novo horário"
          >
            <Plus size={20} />
            Novo Horário
          </button>
        </div>
      </div>

      {/* Grade de horários */}
      <div className="border rounded-lg overflow-hidden">
        <div className={`grid ${gridCols} bg-gray-50`}>
          {/* Coluna de horários */}
          <div className="border-r p-2 font-semibold">Horário</div>
          
          {/* Cabeçalhos dos dias da semana */}
          {generateWeekDays().map((day, index) => (
            <div
              key={index}
              className={`p-2 text-center border-r ${
                format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ? 'bg-purple-100'
                  : ''
              }`}
            >
              <div className="font-semibold">{format(day, 'EEE', { locale: ptBR })}</div>
              <div className="text-sm">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Slots de horário */}
        <div className="divide-y">
          {generateTimeSlots().map((timeSlot, index) => (
            <div key={index} className={`grid ${gridCols}`}>
              {/* Horário */}
              <div className="border-r p-2 text-sm">{timeSlot}</div>

              {/* Células para cada dia */}
              {Array(viewType === 'DIA' ? 1 : 7)
                .fill(null)
                .map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border-r p-2 min-h-[80px] relative"
                    onClick={() => handleOpenModal({ startTime: timeSlot })}
                  >
                    {getClassesForTimeSlot(timeSlot, dayIndex).map(renderClass)}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Seletor de Subunidade */}
      <div className="mt-4">
        <label htmlFor="subunit-select" className="block text-sm font-medium text-gray-700 mb-1">
          Selecione a Subunidade
        </label>
        <select
          id="subunit-select"
          className="p-2 border rounded w-64"
          value={selectedSubUnit || ''}
          onChange={(e) => setSelectedSubUnit(e.target.value || null)}
          aria-label="Selecione a Subunidade"
        >
          <option value="">Todas as Subunidades</option>
          {subunits.map(subunit => (
            <option key={subunit.id} value={subunit.id}>
              {getSubunitName(subunit.id)}
            </option>
          ))}
        </select>
      </div>

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedClass ? 'Editar Horário' : 'Novo Horário'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-subunit" className="block text-sm font-medium text-gray-700 mb-1">
                  Subunidade
                </label>
                <select
                  id="modal-subunit"
                  className="w-full p-2 border rounded"
                  value={formData.subUnit || ''}
                  onChange={(e) => setFormData({ ...formData, subUnit: e.target.value })}
                  required
                  aria-label="Selecione a Subunidade"
                >
                  <option value="">Selecione uma subunidade</option>
                  {subunits.map(subunit => (
                    <option key={subunit.id} value={subunit.id}>
                      {getSubunitName(subunit.id)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="class-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Aula
                </label>
                <select
                  id="class-type"
                  className="w-full p-2 border rounded"
                  value={formData.type || 'ADULTO'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Class['type'] })}
                  required
                  aria-label="Tipo de Aula"
                >
                  <option value="ADULTO">ADULTO</option>
                  <option value="KIDS">KIDS</option>
                  <option value="BABY LITTLE">BABY LITTLE</option>
                  <option value="LITTLE">LITTLE</option>
                  <option value="FAIXA PRETA">FAIXA PRETA</option>
                  <option value="SPARRING">SPARRING</option>
                </select>
              </div>
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário Início
                </label>
                <input
                  id="start-time"
                  type="time"
                  className="w-full p-2 border rounded"
                  value={formData.startTime || ''}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  aria-label="Horário de Início"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário Fim
                </label>
                <input
                  id="end-time"
                  type="time"
                  className="w-full p-2 border rounded"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  aria-label="Horário de Fim"
                />
              </div>
              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                  Instrutor
                </label>
                <input
                  id="instructor"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.instructor || ''}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  required
                  placeholder="Nome do instrutor"
                  aria-label="Nome do Instrutor"
                />
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade
                </label>
                <input
                  id="capacity"
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                  min="1"
                  placeholder="Número máximo de alunos"
                  aria-label="Capacidade da Turma"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {selectedClass ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;
