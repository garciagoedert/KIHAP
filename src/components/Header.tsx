import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Menu, X, LogOut, Users, Building2, BookOpen, BarChart3, CheckSquare, Home, UserCircle, Shield, Video, Award, MessageSquare, ChevronDown, ShoppingBag, Calendar, Moon, Sun } from 'lucide-react';

export default function Header() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCRMSubmenuOpen, setIsCRMSubmenuOpen] = useState(false);
  const [isAdminSubmenuOpen, setIsAdminSubmenuOpen] = useState(false);
  const [isEventsSubmenuOpen, setIsEventsSubmenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmenuToggle = (submenu: 'CRM' | 'Administração' | 'Eventos KIHAP') => {
    setIsCRMSubmenuOpen(submenu === 'CRM' ? !isCRMSubmenuOpen : false);
    setIsAdminSubmenuOpen(submenu === 'Administração' ? !isAdminSubmenuOpen : false);
    setIsEventsSubmenuOpen(submenu === 'Eventos KIHAP' ? !isEventsSubmenuOpen : false);
  };

  const getSubmenuState = (label: string) => {
    switch (label) {
      case 'CRM':
        return isCRMSubmenuOpen;
      case 'Administração':
        return isAdminSubmenuOpen;
      case 'Eventos KIHAP':
        return isEventsSubmenuOpen;
      default:
        return false;
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={24} />
    },
    {
      label: 'Meu Perfil',
      path: '/dashboard/profile',
      icon: <UserCircle size={24} />
    },
    ...(user?.role === 'admin' ? [
      {
        label: 'Administração',
        path: '/dashboard/admin',
        icon: <Shield size={24} />,
        submenu: [
          { 
            label: 'Usuários',
            path: '/dashboard/users/manage',
            icon: <Users size={24} />
          },
          {
            label: 'Unidades',
            path: '/dashboard/units/manage',
            icon: <Building2 size={24} />
          },
          {
            label: 'Grade de Horários',
            path: '/dashboard/schedule',
            icon: <BookOpen size={24} />
          }
        ]
      }
    ] : []),
    ...(user?.role === 'admin' || user?.role === 'instructor' ? [
      {
        label: 'Tatame Online',
        path: '/dashboard/online',
        icon: <Video size={24} />
      },
      {
        label: 'Badges',
        path: '/dashboard/badges',
        icon: <Award size={24} />
      },
      {
        label: 'KIHAP STORE',
        path: '/dashboard/store',
        icon: <ShoppingBag size={24} />
      },
      {
        label: 'Eventos KIHAP',
        path: '/dashboard/events',
        icon: <Calendar size={24} />,
        submenu: [
          {
            label: 'Gerenciar Eventos',
            path: '/dashboard/events/manage',
            icon: <Calendar size={24} />
          },
          {
            label: 'Checkins',
            path: '/dashboard/events/checkins',
            icon: <CheckSquare size={24} />
          }
        ]
      }
    ] : []),
    ...(user?.role === 'admin' ? [
      {
        label: 'CRM',
        path: '/dashboard/crm',
        icon: <BarChart3 size={24} />,
        submenu: [
          {
            label: 'Mensagens',
            path: '/dashboard/messages',
            icon: <MessageSquare size={24} />
          }
        ]
      }
    ] : []),
    {
      label: 'Tarefas',
      path: '/dashboard/tasks',
      icon: <CheckSquare size={24} />
    }
  ];

  return (
    <header className="bg-[#1a2c54] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img 
              src="https://kihap.com.br/wp-content/uploads/2021/02/kihap-wh-1536x359.png" 
              alt="KIHAP Logo" 
              className="h-8 w-auto"
            />
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Menu"
            data-state={isMenuOpen ? "open" : "closed"}
          >
            <div className="relative w-6 h-6">
              <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                <Menu size={24} />
              </div>
              <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                <X size={24} />
              </div>
            </div>
          </button>
        </div>

        <div 
          className={`fixed inset-0 bg-black transition-all duration-500 ease-in-out z-[90] ${
            isMenuOpen ? 'bg-opacity-50 pointer-events-auto' : 'bg-opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <div 
          id="mobile-menu"
          className={`fixed right-0 top-0 h-full w-[280px] bg-[#1a2c54] shadow-xl transform transition-all duration-500 ease-in-out z-[110] ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <div className="p-4 border-b border-gray-700 flex justify-end">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300"
              title="Fechar Menu"
              aria-label="Fechar Menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col h-[calc(100%-80px)]" aria-label="Menu principal">
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-2 px-4">
                {menuItems.map((item, index) => (
                  <div key={index} className="mb-2">
                    {item.submenu ? (
                      <div>
                        <div className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300">
                          <Link
                            to={item.path}
                            className="flex-1 flex items-center gap-3"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.icon}
                            <span className="font-medium text-lg">{item.label}</span>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubmenuToggle(item.label as any);
                            }}
                            className="p-2 hover:bg-gray-600 rounded-full transition-all duration-300"
                            title={`Expandir submenu ${item.label}`}
                            aria-label={`Expandir submenu ${item.label}`}
                            data-state={getSubmenuState(item.label) ? "open" : "closed"}
                          >
                            <ChevronDown 
                              size={20} 
                              className="transition-transform duration-300" 
                              style={{ 
                                transform: getSubmenuState(item.label) ? 'rotate(180deg)' : 'rotate(0deg)' 
                              }} 
                            />
                          </button>
                        </div>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            getSubmenuState(item.label) ? 'mt-2' : 'mt-0'
                          }`}
                          style={{
                            height: getSubmenuState(item.label) ? `${item.submenu.length * 60}px` : '0px'
                          }}
                        >
                          <div className="pl-4 border-l-2 border-gray-700">
                            {item.submenu.map((subitem: any, subindex: number) => (
                              <Link
                                key={subindex}
                                to={subitem.path}
                                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-300 mb-1"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subitem.icon}
                                <span className="text-base">{subitem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="font-medium text-lg">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-gray-700">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300 mb-4"
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                <span className="font-medium text-lg">
                  {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </span>
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
              >
                <LogOut size={24} />
                <span className="font-medium text-lg">Sair</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
