import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import type { Student } from '../types';
import StudentForm from './StudentForm';

export default function SubUnitDashboard() {
  const { subunitId } = useParams<{ subunitId: string }>();
  const { subunits, students, addStudent, deleteStudent } = useDataStore();
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importedStudents, setImportedStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);

  const subunit = subunits.find(s => s.id === subunitId);
  const subunitStudents = [...students, ...importedStudents].filter(s => s.subUnitId === subunitId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        
        const dataRows = rows.slice(1);
        
        const newStudents: Student[] = dataRows
          .filter(row => row.trim())
          .map(row => {
            const [firstName, lastName, phone, email] = row.split(',');
            return {
              id: crypto.randomUUID(),
              name: `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim(),
              email: email?.trim() || '',
              phone: phone?.trim() || '',
              birthDate: new Date().toISOString(),
              enrollmentDate: new Date().toISOString(),
              status: 'active',
              unitId: subunit?.unitId || '',
              subUnitId: subunitId || '',
            } as Student;
          });

        setImportedStudents(newStudents);
      };
      
      reader.readAsText(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!importedStudents.length) return;
    setIsImporting(true);
    
    try {
      for (const student of importedStudents) {
        const { id, ...studentData } = student;
        addStudent({
          ...studentData,
          name: studentData.name || '',
          email: studentData.email || '',
          phone: studentData.phone || '',
          birthDate: studentData.birthDate || new Date().toISOString(),
          enrollmentDate: studentData.enrollmentDate || new Date().toISOString(),
          status: studentData.status || 'active',
          unitId: studentData.unitId || '',
          subUnitId: studentData.subUnitId || ''
        });
      }

      setImportedStudents([]);
      setFile(null);
    } catch (error) {
      console.error('Erro ao importar alunos:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentForm(true);
  };

  const handleStudentSubmit = (studentData: Partial<Student>) => {
    if (selectedStudent) {
      // Update existing student
      const updatedStudent: Omit<Student, 'id'> = {
        name: studentData.name || selectedStudent.name,
        email: studentData.email || selectedStudent.email,
        phone: studentData.phone || selectedStudent.phone,
        birthDate: studentData.birthDate || selectedStudent.birthDate,
        enrollmentDate: studentData.enrollmentDate || selectedStudent.enrollmentDate,
        status: studentData.status || selectedStudent.status,
        unitId: studentData.unitId || selectedStudent.unitId,
        subUnitId: studentData.subUnitId || selectedStudent.subUnitId
      };
      addStudent(updatedStudent);
    } else {
      // Add new student
      const newStudent: Omit<Student, 'id'> = {
        name: studentData.name || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        birthDate: studentData.birthDate || new Date().toISOString(),
        enrollmentDate: new Date().toISOString(),
        status: 'active',
        unitId: subunit?.unitId || '',
        subUnitId: subunitId || ''
      };
      addStudent(newStudent);
    }
    setShowStudentForm(false);
    setSelectedStudent(null);
  };

  const handleStudentDelete = (studentId: string) => {
    deleteStudent(studentId);
    setShowStudentForm(false);
    setSelectedStudent(null);
  };

  if (!subunit) return <div>Subunidade não encontrada</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Dashboard - {subunit.name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total de Alunos</h3>
            <p className="text-3xl font-bold text-blue-600">{subunitStudents.length}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Alunos Ativos</h3>
            <p className="text-3xl font-bold text-green-600">
              {subunitStudents.filter(s => s.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Alunos Inativos</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {subunitStudents.filter(s => s.status === 'inactive').length}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Importar Alunos</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                Selecione o arquivo CSV
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                aria-describedby="file-upload-help"
              />
              <p id="file-upload-help" className="mt-2 text-sm text-gray-600">
                O arquivo CSV deve conter as colunas na ordem: Nome, Sobrenome, Telefone, Email
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={!importedStudents.length || isImporting}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                !importedStudents.length || isImporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              aria-label={isImporting ? 'Importando alunos...' : 'Importar alunos'}
            >
              {isImporting ? 'Importando...' : 'Importar'}
            </button>
          </div>
          
          {importedStudents.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Alunos a serem importados ({importedStudents.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {importedStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.phone}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lista de Alunos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white" aria-label="Lista de alunos">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subunitStudents.map((student) => (
                  <tr 
                    key={student.id}
                    onClick={() => handleStudentClick(student)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showStudentForm && (
        <StudentForm
          student={selectedStudent}
          onSubmit={handleStudentSubmit}
          onClose={() => {
            setShowStudentForm(false);
            setSelectedStudent(null);
          }}
          onDelete={handleStudentDelete}
        />
      )}
    </div>
  );
}
