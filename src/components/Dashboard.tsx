import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { MapPin, Users, FileText, DollarSign, Globe, Play, Video } from 'lucide-react';
import { Student, Lead, LiveClass } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { units, students, leads, subunits, onlineContent, liveClasses } = useDataStore();

  // Calcula o total de subunidades em todas as unidades
  const totalSubunits = subunits.length;

  // Calcula o total de alunos
  const totalStudents = students.length;

  // Calcula o total de contratos ativos
  const totalActiveContracts = students.filter((student: Student) => 
    student.status === 'active'
  ).length;

  // Calcula o total de novos leads
  const totalNewLeads = leads.filter((lead: Lead) => 
    lead.status === 'novo'
  ).length;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Visão Geral</h2>
        <p className="text-gray-600 dark:text-gray-300">Gerenciamento global das unidades</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          icon={<MapPin className="text-[#1d528d] dark:text-blue-400" />}
          title="Total de Unidades"
          value={totalSubunits}
        />

        <StatCard
          icon={<Users className="text-[#1d528d] dark:text-blue-400" />}
          title="Total de Alunos"
          value={totalStudents}
        />

        <StatCard
          icon={<FileText className="text-[#1d528d] dark:text-blue-400" />}
          title="Contratos Ativos"
          value={totalActiveContracts}
        />

        <StatCard
          icon={<DollarSign className="text-[#1d528d] dark:text-blue-400" />}
          title="Total de Novos Leads"
          value={totalNewLeads}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => {
          if (unit.type === 'online') {
            const onlineStudents = students.filter(s => s.unitId === unit.id);
            const onlineLeads = leads.filter(l => l.unitId === unit.id);
            return (
              <div
                key={unit.id}
                onClick={() => navigate(`/dashboard/unit/${unit.id}`)}
                className="bg-gradient-to-br from-[#1d528d] to-[#1a4a80] text-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Globe className="text-white" size={20} />
                      <h3 className="text-lg font-semibold">{unit.name}</h3>
                    </div>
                    <p className="text-gray-200 text-sm">Plataforma de Ensino Online</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-200" />
                    <span className="text-gray-200">
                      {onlineStudents.length} alunos online
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Play size={16} className="text-gray-200" />
                    <span className="text-gray-200">
                      {onlineContent.length} aulas disponíveis
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-gray-200" />
                    <span className="text-gray-200">
                      {liveClasses?.filter((c: LiveClass) => c.status === 'scheduled').length || 0} aulas ao vivo agendadas
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-200" />
                    <span className="text-gray-200">
                      {onlineLeads.filter(l => l.status === 'novo').length} novos leads
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          const unitSubunits = subunits.filter(s => s.unitId === unit.id);
          return (
            <div
              key={unit.id}
              onClick={() => navigate(`/dashboard/unit/${unit.id}`)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#1d528d] dark:text-blue-400" size={20} />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{unit.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{unit.city}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs px-2 py-1 rounded-full">
                  {unitSubunits.length} subunidades
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>
                    {students.filter(s => s.unitId === unit.id).length} alunos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>
                    {students.filter((s: Student) => s.unitId === unit.id && s.status === 'active').length} contratos ativos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>
                    {leads.filter((l: Lead) => l.unitId === unit.id && l.status === 'novo').length} novos leads
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
        <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
      </div>
      <h3 className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">{title}</h3>
    </div>
  );
}
