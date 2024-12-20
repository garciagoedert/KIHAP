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

        {/* Type and Category Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="type">
              Tipo
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ContentType)}
              className={`rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
            >
              <option value="all">Todos os tipos</option>
              <option value="video">Vídeos</option>
              <option value="live">Aulas ao vivo</option>
              <option value="image">Imagens</option>
              <option value="document">Documentos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="category">
              Categoria
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              } shadow-sm focus:border-[#1d528d] focus:ring-1 focus:ring-[#1d528d]`}
            >
              <option value="all">Todas as categorias</option>
              <option value="class">Aulas</option>
              <option value="technique">Técnicas</option>
              <option value="theory">Teoria</option>
              <option value="workout">Treinos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid/Feed */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContent.map((content: OnlineContent) => (
            <div
              key={content.id}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-md overflow-hidden`}
            >
              <div className="relative aspect-video">
                <img
                  src={content.thumbnailUrl || 'https://via.placeholder.com/640x360?text=Sem+Thumbnail'}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingContent(content);
                        setShowForm(true);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Editar conteúdo"
                    >
                      <Edit2 size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Excluir conteúdo"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
                {!content.isPublished && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    Rascunho
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {content.title}
                </h3>
                <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {content.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {format(new Date(content.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  <div className="flex items-center gap-2">
                    {content.type === 'video' && <Video size={16} />}
                    {content.type === 'live' && <Calendar size={16} />}
                    {content.type === 'image' && <ImageIcon size={16} />}
                    {content.type === 'document' && <FileText size={16} />}
                    <span className="capitalize">{content.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedContent.map((content: OnlineContent) => (
            <div
              key={content.id}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-md overflow-hidden`}
            >
              <div className="flex">
                <div className="w-48 h-32 flex-shrink-0">
                  <img
                    src={content.thumbnailUrl || 'https://via.placeholder.com/640x360?text=Sem+Thumbnail'}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {content.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingContent(content);
                          setShowForm(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Editar conteúdo"
                      >
                        <Edit2 size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Excluir conteúdo"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {content.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {format(new Date(content.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    <div className="flex items-center gap-1">
                      {content.type === 'video' && <Video size={16} />}
                      {content.type === 'live' && <Calendar size={16} />}
                      {content.type === 'image' && <ImageIcon size={16} />}
                      {content.type === 'document' && <FileText size={16} />}
                      <span className="capitalize">{content.type}</span>
                    </div>
                    {!content.isPublished && (
                      <span className="text-yellow-500 flex items-center gap-1">
                        <EyeOff size={16} /> Rascunho
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{content.targetBelts?.length || 0} faixas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Form Modal */}
      {showForm && (
        <ContentForm
          content={editingContent}
          onClose={() => {
            setShowForm(false);
            setEditingContent(null);
          }}
          onSubmit={(data) => {
            if (editingContent) {
              updateContent({ ...editingContent, ...data });
            } else {
              addContent({
                ...data,
                createdAt: new Date().toISOString()
              });
            }
            setShowForm(false);
            setEditingContent(null);
          }}
        />
      )}
    </div>
  );
}
