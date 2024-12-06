import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

interface Student {
  id: string;
  name: string;
  email: string;
}

export function StudentListExample() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await trpc.getStudents.query();
        setStudents(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar estudantes');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Estudantes</h2>
      <div className="space-y-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{student.name}</h3>
            <p className="text-gray-600">{student.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
