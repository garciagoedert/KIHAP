import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import { useThemeStore } from '../store/useThemeStore';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Video, 
  Calendar, 
  Image as ImageIcon, 
  FileText, 
  Eye, 
  EyeOff,
  Users,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OnlineContent, Unit } from '../types';
import ContentForm from './ContentForm';

type ContentType = 'all' | 'video' | 'live' | 'image' | 'document';

export default function OnlineContentManagement() {
  const currentUser = useAuthStore(state => state.user);
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const { onlineContent, units, addContent, updateContent, deleteContent } = useDataStore();
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<OnlineContent | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    currentUser?.unitId || 'all'
  );
  const [selectedType, setSelectedType] = useState<ContentType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('feed');

  // Filter content based on selections
  const filteredContent = useMemo(() => {
    return onlineContent.filter((content: OnlineContent) => {
      if (selectedUnitId !== 'all' && content.unitId !== selectedUnitId) return false;
      if (selectedType !== 'all' && content.type !== selectedType) return false;
      if (selectedCategory !== 'all' && content.category !== selectedCategory) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          content.title.toLowerCase().includes(searchLower) ||
          content.description.toLowerCase().includes(searchLower) ||
          content.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [onlineContent, selectedUnitId, selectedType, selectedCategory, searchTerm]);

  // Sort content by date
  const sortedContent = useMemo(() => {
    return [...filteredContent].sort((a: OnlineContent, b: OnlineContent) => {
      const dateA = new Date(a.type === 'live' ? a.scheduledFor || a.createdAt : a.createdAt);
      const dateB = new Date(b.type === 'live' ? b.scheduledFor || b.createdAt : b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredContent]);

  const handleDelete = (contentId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este conteúdo?')) {
      deleteContent(contentId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Tatame Online
          </h2>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Gerencie o conteúdo online para seus alunos
          </p>
        </div>
        <button
          onClick={() => {
            setEditingContent(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#1d528d] text-white px-4 py-2 rounded-md hover:bg-[#164070] transition-colors"
          title="Criar novo conteúdo"
        >
          <Plus size={20} />
          Novo Conteúdo
        </button>
      </div>

      {/* Filters */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="w-full md:w-96 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className={`rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
              title="Selecionar unidade"
            >
              <option value="all">Todas as Unidades</option>
              {units.map((unit: Unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>

            <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md p-1`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? isDarkMode
                      ? 'bg-gray-600 text-blue-400'
                      : 'bg-white shadow text-[#1d528d]'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Visualização em grade"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('feed')}
                className={`p-2 rounded ${
                  viewMode === 'feed'
                    ? isDarkMode
                      ? 'bg-gray-600 text-blue-400'
                      : 'bg-white shadow text-[#1d528d]'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Visualização em lista"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ... (mantenha o resto do código do componente) ... */}
      </div>
    </div>
  );
}
