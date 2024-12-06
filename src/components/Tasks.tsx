import React, { useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '../types';
import { 
  Plus, 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  AlertCircle,
  Trash2,
  Edit2,
  Filter
} from 'lucide-react';

const getPriorityColors = (isDarkMode: boolean) => ({
  low: isDarkMode 
    ? 'bg-blue-900/50 text-blue-200' 
    : 'bg-blue-100 text-blue-800',
  medium: isDarkMode 
    ? 'bg-yellow-900/50 text-yellow-200' 
    : 'bg-yellow-100 text-yellow-800',
  high: isDarkMode 
    ? 'bg-red-900/50 text-red-200' 
    : 'bg-red-100 text-red-800'
});

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta'
};

export default function Tasks() {
  const { tasks, users, addTask, updateTask, deleteTask, completeTask } = useDataStore();
  const currentUser = useAuthStore(state => state.user);
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const priorityColors = getPriorityColors(isDarkMode);

  const userTasks = tasks.filter(task => 
    currentUser?.role === 'admin' || task.assignedTo.toString() === currentUser?.id
  );

  const filteredTasks = userTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDelete = (taskId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tarefas</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Gerencie suas tarefas e atividades</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-[#1d528d] text-white px-4 py-2 rounded-md hover:bg-[#164070] transition-colors"
            title="Criar nova tarefa"
          >
            <Plus size={20} />
            Nova Tarefa
          </button>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          {/* Filters */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2">
              <Filter size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'pending' 
                      ? 'bg-[#1d528d] text-white' 
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Mostrar tarefas pendentes"
                >
                  Pendentes
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'completed' 
                      ? 'bg-[#1d528d] text-white' 
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Mostrar tarefas concluídas"
                >
                  Concluídas
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'all' 
                      ? 'bg-[#1d528d] text-white' 
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Mostrar todas as tarefas"
                >
                  Todas
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Feed */}
          <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {filteredTasks.map(task => {
              const assignedUser = users.find(u => u.id === task.assignedTo.toString());
              const createdByUser = users.find(u => u.id === task.createdBy.toString());
              
              return (
                <div 
                  key={task.id} 
                  className={`p-6 ${
                    isDarkMode
                      ? task.status === 'completed' 
                        ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                        : 'hover:bg-gray-700/50'
                      : task.status === 'completed'
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`mt-1 ${
                        task.status === 'completed' 
                          ? 'text-green-500 dark:text-green-400' 
                          : isDarkMode
                            ? 'text-gray-500 hover:text-gray-400'
                            : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={task.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluída'}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            task.status === 'completed' 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : isDarkMode
                                ? 'text-white'
                                : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-start gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setShowForm(true);
                            }}
                            className={`p-1 ${
                              isDarkMode
                                ? 'text-gray-500 hover:text-blue-400'
                                : 'text-gray-400 hover:text-[#1d528d]'
                            }`}
                            title="Editar tarefa"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className={`p-1 ${
                              isDarkMode
                                ? 'text-gray-500 hover:text-red-400'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                            title="Excluir tarefa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 items-center text-sm">
                        <span className={`px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                          {priorityLabels[task.priority]}
                        </span>

                        <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Clock size={16} />
                          <span>Criada em {format(new Date(task.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>

                        {task.dueDate && (
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Calendar size={16} />
                            <span>Prazo: {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                          </div>
                        )}

                        {task.status === 'completed' && task.completedAt && (
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            <CheckCircle2 size={16} />
                            <span>Concluída em {format(new Date(task.completedAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                          </div>
                        )}

                        <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <AlertCircle size={16} />
                          <span>
                            Atribuída a {assignedUser?.name || 'Usuário removido'}
                            {currentUser?.role === 'admin' && (
                              <> por {createdByUser?.name || 'Usuário removido'}</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <CheckCircle2 size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
                <p className="text-sm">Crie uma nova tarefa para começar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onSubmit={(taskData) => {
            if (editingTask) {
              updateTask({ ...taskData, id: editingTask.id });
            } else {
              addTask(taskData);
            }
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
}

function TaskForm({ task, onClose, onSubmit }: TaskFormProps) {
  const currentUser = useAuthStore(state => state.user);
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const { users } = useDataStore();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo || (currentUser?.id ? parseInt(currentUser.id, 10) : 0),
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || '',
    status: task?.status || 'pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      createdBy: task?.createdBy || (currentUser?.id ? parseInt(currentUser.id, 10) : 0),
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <button
              onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}
              title="Fechar formulário"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
              required
              placeholder="Digite o título da tarefa"
              title="Digite o título da tarefa"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
              placeholder="Digite a descrição da tarefa"
              title="Digite a descrição da tarefa"
            />
          </div>

          {currentUser?.role === 'admin' && (
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Atribuir para
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: parseInt(e.target.value, 10) })}
                className={`w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
                required
                title="Selecione o usuário responsável"
              >
                {users.map(user => (
                  <option key={user.id} value={parseInt(user.id, 10)}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Prioridade
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className={`w-full rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
              required
              title="Selecione a prioridade da tarefa"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Data de Entrega
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
              title="Selecione a data de entrega"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium ${
                isDarkMode
                  ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              } border rounded-md`}
              title="Cancelar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#1d528d] border border-transparent rounded-md hover:bg-[#164070]"
              title={task ? 'Salvar alterações' : 'Criar tarefa'}
            >
              {task ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
