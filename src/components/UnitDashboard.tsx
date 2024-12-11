import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import StudentForm from './StudentForm';
import SubUnitForm from './SubUnitForm';
import { Student, SubUnit } from '../types';

export default function UnitDashboard() {
  const { unitId, subUnitId } = useParams();
  const { user } = useAuthStore();
  const { 
    units, 
    students,
    subunits, 
    updateStudent,
    addStudent,
    addSubUnit,
    kihapEvents,
    eventCheckins
  } = useDataStore();
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showSubUnitForm, setShowSubUnitForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSubUnit, setSelectedSubUnit] = useState<SubUnit | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const unit = units.find(u => u.id === unitId);
  if (!unit) return <div className="text-gray-800 dark:text-white">Unidade não encontrada</div>;

  const unitSubunits = subunits.filter(su => su.parentUnitId === unitId);
  const subUnit = subUnitId 
    ? unitSubunits.find(su => su.id === subUnitId)
    : null;

  const filteredStudents = students.filter(student => 
    subUnitId 
      ? student.subUnitId === subUnitId
      : student.unitId === unitId
  );

  const searchFilteredStudents = filteredStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStudents = filteredStudents.filter(s => s.active);
  const inactiveStudents = filteredStudents.filter(s => !s.active);

  const unitEvents = kihapEvents.filter(event => 
    event.unitId === unitId && (event.status === 'active' || event.active)
  );

  const handleStudentSubmit = (studentData: Partial<Student>) => {
    if (selectedStudent) {
      updateStudent({ ...selectedStudent, ...studentData });
    } else if (user) {
      addStudent({
        ...studentData,
        unitId: unitId || '',
        subUnitId: subUnitId || '',
        name: studentData.name || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        belt: studentData.belt || 'Branca',
        birthDate: studentData.birthDate || new Date().toISOString(),
        enrollmentDate: new Date().toISOString(),
        status: 'active'
      });
    }
    setShowStudentForm(false);
    setSelectedStudent(null);
  };

  const handleSubUnitSubmit = (data: Omit<SubUnit, 'id' | 'parentUnitId'>) => {
    if (unitId) {
      addSubUnit({
        ...data,
        unitId,
        parentUnitId: unitId
      });
    }
    setShowSubUnitForm(false);
    setSelectedSubUnit(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {subUnit ? subUnit.name : unit.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {unit.address}, {unit.city} - {unit.state}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Alunos Ativos</h3>
          <p className="text-2xl font-bold text-[#1d528d] dark:text-blue-400">{activeStudents.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Alunos Inativos</h3>
          <p className="text-2xl font-bold text-[#1d528d] dark:text-blue-400">{inactiveStudents.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Subunidades</h3>
          <p className="text-2xl font-bold text-[#1d528d] dark:text-blue-400">{unitSubunits.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Taxa de Retenção</h3>
          <p className="text-2xl font-bold text-[#1d528d] dark:text-blue-400">
            {filteredStudents.length > 0 
              ? Math.round((activeStudents.length / filteredStudents.length) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        {(user?.role === 'admin' || user?.role === 'instructor') && (
          <>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setShowStudentForm(true);
              }}
              className="bg-[#1d528d] text-white px-4 py-2 rounded-md hover:bg-[#164070] transition-colors"
            >
              Adicionar Aluno
            </button>

            {!subUnitId && (
              <button
                onClick={() => {
                  setSelectedSubUnit(undefined);
                  setShowSubUnitForm(true);
                }}
                className="bg-[#1d528d] text-white px-4 py-2 rounded-md hover:bg-[#164070] transition-colors"
              >
                Adicionar Subunidade
              </button>
            )}
          </>
        )}
      </div>

      {/* Subunidades */}
      {!subUnitId && unitSubunits.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Subunidades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unitSubunits.map(subunit => {
              const subunitStudents = students.filter(s => s.subUnitId === subunit.id);
              const activeSubunitStudents = subunitStudents.filter(s => s.active);
              
              return (
                <Link
                  key={subunit.id}
                  to={`/dashboard/unit/${unitId}/subunit/${subunit.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{subunit.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Alunos Ativos: {activeSubunitStudents.length}</p>
                  <p className="text-gray-600 dark:text-gray-300">Total de Alunos: {subunitStudents.length}</p>
                  <div className="mt-4 text-[#1d528d] dark:text-blue-400 text-sm font-medium">
                    Ver dashboard →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Alunos</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar alunos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1d528d] dark:focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchFilteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedStudent(student);
                setShowStudentForm(true);
              }}
            >
              <div className="flex items-center gap-4">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-300 text-xl">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{student.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{student.belt}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {student.active ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Section */}
      {unitEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Eventos KIHAP</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unitEvents.map(event => {
              const eventCheckinCount = eventCheckins.filter(c => c.eventId === event.id).length;
              
              return (
                <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{event.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {new Date(event.date).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Local: {event.location}</p>
                  <p className="text-gray-600 dark:text-gray-300">Checkins: {eventCheckinCount}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Forms */}
      {showStudentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <StudentForm
              student={selectedStudent}
              onSubmit={handleStudentSubmit}
              onClose={() => {
                setShowStudentForm(false);
                setSelectedStudent(null);
              }}
            />
          </div>
        </div>
      )}

      {showSubUnitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <SubUnitForm
              subUnit={selectedSubUnit}
              onSubmit={handleSubUnitSubmit}
              onClose={() => {
                setShowSubUnitForm(false);
                setSelectedSubUnit(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
