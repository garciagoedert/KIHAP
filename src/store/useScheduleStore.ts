import { create } from 'zustand';
import { Class } from '../types';

interface ScheduleStore {
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  addClass: (newClass: Class) => void;
  removeClass: (classId: string) => void;
  updateClass: (classId: string, updatedClass: Partial<Class>) => void;
  selectedClass: Class | null;
  setSelectedClass: (classData: Class | null) => void;
}

const useScheduleStore = create<ScheduleStore>((set) => ({
  classes: [
    {
      id: '1',
      startTime: '08:00',
      endTime: '09:00',
      type: 'ADULTO',
      instructor: 'SRTA. SABINO',
      capacity: 20,
      enrolled: 4,
      subUnit: '1-1' // Santa Mônica
    },
    {
      id: '2',
      startTime: '09:00',
      endTime: '09:30',
      type: 'BABY LITTLE',
      instructor: 'MR. SIMÕES',
      capacity: 16,
      enrolled: 0,
      subUnit: '1-2' // Centro
    }
  ],
  
  selectedClass: null,
  
  setClasses: (classes) => set({ classes }),
  
  addClass: (newClass) =>
    set((state) => ({
      classes: [...state.classes, { ...newClass, id: crypto.randomUUID() }],
    })),
  
  removeClass: (classId) =>
    set((state) => ({
      classes: state.classes.filter((cls) => cls.id !== classId),
    })),
  
  updateClass: (classId, updatedClass) =>
    set((state) => ({
      classes: state.classes.map((cls) =>
        cls.id === classId ? { ...cls, ...updatedClass } : cls
      ),
    })),
    
  setSelectedClass: (classData) => set({ selectedClass: classData }),
}));

export default useScheduleStore;
