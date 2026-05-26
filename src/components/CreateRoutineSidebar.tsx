import React, { useState, useEffect } from 'react';
import { X, User, Check, Plus, Trash2, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { studentsService } from '@/services/students.service';
import { coachesService } from '@/services/coaches.service';

interface CreateRoutineSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  routineData?: any | null;
  isViewOnly?: boolean;
}

const dayMapping: Record<string, 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = {
  'Lun': 'monday',
  'Mar': 'tuesday',
  'Mié': 'wednesday',
  'Jue': 'thursday',
  'Vie': 'friday',
  'Sáb': 'saturday',
  'Dom': 'sunday'
};

const reverseDayMapping: Record<string, string> = {
  'monday': 'Lun',
  'tuesday': 'Mar',
  'wednesday': 'Mié',
  'thursday': 'Jue',
  'friday': 'Vie',
  'saturday': 'Sáb',
  'sunday': 'Dom'
};

export const CreateRoutineSidebar: React.FC<CreateRoutineSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  routineData,
  isViewOnly = false
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [coaches, setCoaches] = useState<any[]>([]);

  // Detailed exercises per day state
  const [workoutDays, setWorkoutDays] = useState<Record<string, { label: string, exercises: any[] }>>({});
  const [activeAccordionTab, setActiveAccordionTab] = useState<string | null>(null);

  // Compact exercise addition inputs state
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weightKg: '',
    durationSec: '',
    restSec: '',
    notes: ''
  });

  // Fetch real coaches when modal is open
  useEffect(() => {
    if (isOpen) {
      coachesService.getPaginated(1, 100).then((res) => {
        if (res && res.data && res.data.data) {
          const mapped = res.data.data.map((c: any) => ({
            id: c._id,
            name: `${c.firstName} ${c.lastName}`
          }));
          setCoaches(mapped);
        }
      }).catch((err) => {
        console.error('Error fetching coaches:', err);
      });
    }
  }, [isOpen]);

  // Fetch real students when modal is open
  useEffect(() => {
    if (isOpen) {
      studentsService.getPaginated(1, 100).then((res) => {
        if (res && res.data) {
          const mapped = res.data.map((s: any) => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            img: s.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          }));
          setStudents(mapped);
          
          if (routineData && routineData.student) {
            const studentId = typeof routineData.student === 'object' ? routineData.student._id : routineData.student;
            const found = mapped.find((s: any) => s.id === studentId);
            if (found) {
              setSelectedStudent(found);
              setStudentSearch(found.name);
            }
          }
        }
      }).catch((err) => {
        console.error('Error fetching students:', err);
      });
    }
  }, [isOpen, routineData]);

  // Search students from backend when typing in autocomplete
  useEffect(() => {
    if (!isOpen || selectedStudent) return;

    if (!studentSearch.trim()) {
      studentsService.getPaginated(1, 100).then((res) => {
        if (res && res.data) {
          setStudents(res.data.map((s: any) => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            img: s.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          })));
        }
      });
      return;
    }

    const delayDebounce = setTimeout(() => {
      studentsService.search(studentSearch).then((res) => {
        if (res && res.data) {
          setStudents(res.data.map((s: any) => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            img: s.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          })));
        }
      }).catch(err => console.error(err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [studentSearch, isOpen, selectedStudent]);

  const filteredStudents = students;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    daysCount: 'Seleccionar días',
    coach: '',
    active: true
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const weekdays = [
    { key: 'Lun', label: 'Lun' },
    { key: 'Mar', label: 'Mar' },
    { key: 'Mié', label: 'Mié' },
    { key: 'Jue', label: 'Jue' },
    { key: 'Vie', label: 'Vie' },
    { key: 'Sáb', label: 'Sáb' },
    { key: 'Dom', label: 'Dom' }
  ];

  const toggleDay = (day: string) => {
    let updated;
    if (selectedDays.includes(day)) {
      updated = selectedDays.filter(d => d !== day);
    } else {
      updated = [...selectedDays, day];
      if (!workoutDays[day]) {
        setWorkoutDays(prev => ({
          ...prev,
          [day]: { label: '', exercises: [] }
        }));
      }
    }
    setSelectedDays(updated);

    if (updated.length === 0) {
      setFormData(prev => ({ ...prev, daysCount: 'Seleccionar días' }));
    } else {
      setFormData(prev => ({ ...prev, daysCount: `${updated.length} días seleccionados (${updated.join(', ')})` }));
    }
  };

  // Open first selected day automatically as accordion tab
  useEffect(() => {
    if (selectedDays.length > 0) {
      if (!activeAccordionTab || !selectedDays.includes(activeAccordionTab)) {
        setActiveAccordionTab(selectedDays[0]);
      }
    } else {
      setActiveAccordionTab(null);
    }
  }, [selectedDays]);

  useEffect(() => {
    if (routineData && isOpen) {
      setFormData({
        name: routineData.name || '',
        description: routineData.description || '',
        startDate: routineData.startDate ? new Date(routineData.startDate).toISOString().split('T')[0] : '',
        endDate: routineData.endDate ? new Date(routineData.endDate).toISOString().split('T')[0] : '',
        daysCount: routineData.days ? `${routineData.days.length} días` : 'Seleccionar días',
        coach: routineData.createdBy || '',
        active: routineData.active ?? true
      });

      if (routineData.student) {
        if (typeof routineData.student === 'object') {
          const studentObj = routineData.student;
          const sName = `${studentObj.firstName} ${studentObj.lastName}`;
          setSelectedStudent({
            id: studentObj._id,
            name: sName,
            img: studentObj.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          });
          setStudentSearch(sName);
        } else {
          const found = students.find(s => s.id === routineData.student);
          if (found) {
            setSelectedStudent(found);
            setStudentSearch(found.name);
          } else {
            setSelectedStudent({ id: routineData.student, name: 'Cargando...', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' });
            setStudentSearch('Cargando...');
          }
        }
      }

      if (Array.isArray(routineData.days)) {
        const initialSelected: string[] = [];
        const daysMap: Record<string, { label: string, exercises: any[] }> = {};
        
        routineData.days.forEach((d: any) => {
          const dayKey = reverseDayMapping[d.day];
          if (dayKey) {
            initialSelected.push(dayKey);
            daysMap[dayKey] = {
              label: d.label || '',
              exercises: d.exercises || []
            };
          }
        });
        
        setSelectedDays(initialSelected);
        setWorkoutDays(daysMap);
        setFormData(prev => ({
          ...prev,
          daysCount: `${initialSelected.length} días seleccionados (${initialSelected.join(', ')})`
        }));
      } else {
        setSelectedDays([]);
        setWorkoutDays({});
      }
    } else if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        daysCount: 'Seleccionar días',
        coach: '',
        active: true
      });
      setSelectedStudent(null);
      setStudentSearch('');
      setSelectedDays([]);
      setWorkoutDays({});
      setActiveAccordionTab(null);
      setNewExercise({
        name: '',
        sets: '',
        reps: '',
        weightKg: '',
        durationSec: '',
        restSec: '',
        notes: ''
      });
    }
  }, [routineData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = (dayKey: string) => {
    if (!newExercise.name.trim()) {
      alert('Por favor ingresa el nombre del ejercicio.');
      return;
    }

    const exData: any = {
      name: newExercise.name.trim()
    };
    if (newExercise.sets) exData.sets = Number(newExercise.sets);
    if (newExercise.reps) exData.reps = Number(newExercise.reps);
    if (newExercise.weightKg) exData.weightKg = Number(newExercise.weightKg);
    if (newExercise.durationSec) exData.durationSec = Number(newExercise.durationSec);
    if (newExercise.restSec) exData.restSec = Number(newExercise.restSec);
    if (newExercise.notes.trim()) exData.notes = newExercise.notes.trim();

    setWorkoutDays(prev => {
      const currentExs = prev[dayKey]?.exercises || [];
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          exercises: [...currentExs, exData]
        }
      };
    });

    setNewExercise({
      name: '',
      sets: '',
      reps: '',
      weightKg: '',
      durationSec: '',
      restSec: '',
      notes: ''
    });
  };

  const handleRemoveExercise = (dayKey: string, index: number) => {
    setWorkoutDays(prev => {
      const currentExs = [...(prev[dayKey]?.exercises || [])];
      currentExs.splice(index, 1);
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          exercises: currentExs
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Por favor selecciona un estudiante.');
      return;
    }
    setLoading(true);

    const mappedDays = selectedDays.map(dayKey => ({
      day: dayMapping[dayKey],
      label: workoutDays[dayKey]?.label || dayKey,
      exercises: workoutDays[dayKey]?.exercises || []
    }));

    const payload = {
      student: selectedStudent.id,
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      days: mappedDays,
      createdBy: formData.coach || 'Marcos Ruiz',
      active: formData.active
    };

    await onSubmit(payload, routineData?._id);
    setLoading(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-xl z-50 overflow-y-auto flex flex-col transition-transform transform translate-x-0">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isViewOnly ? 'Ver rutina' : (routineData && routineData._id) ? 'Editar rutina' : 'Nueva rutina'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isViewOnly ? 'Detalle completo de la rutina de entrenamiento.' : 'Completa la información para crear una nueva rutina de entrenamiento.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="p-6 space-y-6 flex-1">
            
            {/* Estudiante Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Estudiante <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                {selectedStudent ? (
                  <div className="absolute left-3 flex items-center gap-2 pointer-events-none">
                    <img src={selectedStudent.img} alt={selectedStudent.name} className="w-5 h-5 rounded-full object-cover" />
                  </div>
                ) : (
                  <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                )}
                <input
                  required
                  type="text"
                  readOnly={isViewOnly}
                  placeholder={isViewOnly ? "" : "Buscar estudiante por nombre..."}
                  value={studentSearch}
                  onFocus={() => !isViewOnly && setShowStudentSuggestions(true)}
                  onChange={(e) => {
                    if (isViewOnly) return;
                    setStudentSearch(e.target.value);
                    if (selectedStudent && e.target.value !== selectedStudent.name) {
                      setSelectedStudent(null);
                    }
                  }}
                  className={`w-full ${selectedStudent ? 'pl-10' : 'pl-9'} pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                />
                {selectedStudent && !isViewOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudent(null);
                      setStudentSearch('');
                    }}
                    className="absolute right-3 p-0.5 text-gray-400 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Selecciona el estudiante al que asignarás esta rutina.</p>

              {/* Suggestion Dropdown */}
              {showStudentSuggestions && studentSearch !== selectedStudent?.name && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStudentSuggestions(false)} />
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-gray-50">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => {
                            setSelectedStudent(student);
                            setStudentSearch(student.name);
                            setShowStudentSuggestions(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-blue-50/50 flex items-center justify-between text-sm transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={student.img} alt={student.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-semibold text-gray-900">{student.name}</span>
                          </div>
                          {selectedStudent?.id === student.id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 italic">No se encontraron estudiantes</div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Información General */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Información general</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nombre de la rutina <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  readOnly={isViewOnly}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isViewOnly ? "" : "Ej: Fuerza e Hipertrofia"}
                  className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Descripción (opcional)</label>
                  {!isViewOnly && <span className="text-[10px] text-gray-400">{formData.description.length}/300</span>}
                </div>
                <textarea
                  name="description"
                  readOnly={isViewOnly}
                  maxLength={300}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={isViewOnly ? "Sin descripción" : "Describe el objetivo de la rutina, beneficios y recomendaciones..."}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none font-medium text-gray-600 leading-normal ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                />
              </div>
            </div>

            {/* Período */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Período</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Fecha de inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    name="startDate"
                    readOnly={isViewOnly}
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-700 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha de fin (opcional)</label>
                  <input
                    type="date"
                    name="endDate"
                    readOnly={isViewOnly}
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-700 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500">Si no seleccionas una fecha de fin, la rutina no tendrá límite.</p>
            </div>

            {/* Días de la Rutina */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Días de la rutina</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Días <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.daysCount}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-semibold cursor-not-allowed outline-none select-none"
                />
                
                {/* Day Selector Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {weekdays.map(day => {
                    const isSelected = selectedDays.includes(day.key);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => !isViewOnly && toggleDay(day.key)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                            : isViewOnly
                              ? 'bg-white border-gray-200 text-gray-400'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        } ${isViewOnly ? 'cursor-default' : ''}`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-[11px] text-gray-500">Selecciona los días en los que el estudiante realizará esta rutina.</p>
            </div>

            {/* Ejercicios de la Rutina (Accordion Day Selector) */}
            {selectedDays.length > 0 && (
              <div className="border-t border-gray-50 pt-5 space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Ejercicios por día</h3>
                
                <div className="space-y-3">
                  {selectedDays.map(dayKey => {
                    const isOpenTab = activeAccordionTab === dayKey;
                    const exCount = workoutDays[dayKey]?.exercises?.length || 0;
                    const focusLabel = workoutDays[dayKey]?.label || '';

                    return (
                      <div key={dayKey} className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        {/* Header of Accordion Tab */}
                        <button
                          type="button"
                          onClick={() => setActiveAccordionTab(isOpenTab ? null : dayKey)}
                          className="w-full px-4 py-3 flex items-center justify-between text-sm bg-gray-50 hover:bg-gray-100/70 transition-colors border-b border-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                              {dayKey}
                            </span>
                            <div className="text-left">
                              <span className="font-bold text-gray-900">Entrenamiento</span>
                              {focusLabel && (
                                <span className="text-xs text-gray-400 font-semibold block leading-tight">
                                  {focusLabel}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                              {exCount} ej.
                            </span>
                            {isOpenTab ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {/* Exercises list / Editor inside Accordion Tab */}
                        {isOpenTab && (
                          <div className="p-4 space-y-4 bg-white divide-y divide-gray-50">
                            
                            {/* Focus/Label Input for the workout day */}
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Enfoque del día
                              </label>
                              <input
                                type="text"
                                readOnly={isViewOnly}
                                value={focusLabel}
                                onChange={(e) => {
                                  setWorkoutDays(prev => ({
                                    ...prev,
                                    [dayKey]: {
                                      ...prev[dayKey],
                                      label: e.target.value
                                    }
                                  }));
                                }}
                                placeholder={isViewOnly ? "Sin enfoque especificado" : "Ej: Pecho y Tríceps / Fuerza"}
                                className={`w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium ${isViewOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
                              />
                            </div>

                            {/* Loaded Exercises list */}
                            <div className="pt-3 space-y-2.5">
                              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Ejercicios cargados
                              </label>
                              {exCount > 0 ? (
                                <div className="space-y-2">
                                  {workoutDays[dayKey]?.exercises.map((ex: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-3 relative flex flex-col gap-1.5">
                                      <div className="flex items-start justify-between pr-6">
                                        <span className="text-xs font-bold text-gray-900 leading-normal flex items-center gap-1.5">
                                          <Dumbbell className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                          {ex.name}
                                        </span>
                                        {!isViewOnly && (
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveExercise(dayKey, idx)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-all"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                                        {ex.sets && (
                                          <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md border border-blue-100">
                                            {ex.sets} series
                                          </span>
                                        )}
                                        {ex.reps && (
                                          <span className="bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                                            {ex.reps} reps
                                          </span>
                                        )}
                                        {ex.weightKg && (
                                          <span className="bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-md border border-green-100">
                                            {ex.weightKg} kg
                                          </span>
                                        )}
                                        {ex.durationSec && (
                                          <span className="bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded-md border border-orange-100">
                                            {ex.durationSec}s dur.
                                          </span>
                                        )}
                                        {ex.restSec && (
                                          <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-md border border-gray-200">
                                            {ex.restSec}s desc.
                                          </span>
                                        )}
                                      </div>
                                      {ex.notes && (
                                        <p className="text-[10px] text-gray-400 italic mt-0.5 font-medium leading-relaxed bg-white p-2 rounded-lg border border-gray-100">
                                          {ex.notes}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-5 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
                                  <Dumbbell className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
                                  <p className="text-[11px] text-gray-400 font-semibold">Sin ejercicios cargados para este día.</p>
                                </div>
                              )}
                            </div>

                            {/* Compact Exercise Creator Panel (Only if editable) */}
                            {!isViewOnly && (
                              <div className="pt-4 space-y-3 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                  Agregar nuevo ejercicio
                                </p>
                                
                                <div>
                                  <input
                                    type="text"
                                    placeholder="Nombre del ejercicio (ej: Press de banca)"
                                    value={newExercise.name}
                                    onChange={(e) => setNewExercise(p => ({ ...p, name: e.target.value }))}
                                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium bg-white"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                      Sets
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      placeholder="Sets"
                                      value={newExercise.sets}
                                      onChange={(e) => setNewExercise(p => ({ ...p, sets: e.target.value }))}
                                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                      Reps
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      placeholder="Reps"
                                      value={newExercise.reps}
                                      onChange={(e) => setNewExercise(p => ({ ...p, reps: e.target.value }))}
                                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                      Peso (kg)
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      placeholder="Kg"
                                      value={newExercise.weightKg}
                                      onChange={(e) => setNewExercise(p => ({ ...p, weightKg: e.target.value }))}
                                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium bg-white"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                      Duración (s)
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      placeholder="Segundos"
                                      value={newExercise.durationSec}
                                      onChange={(e) => setNewExercise(p => ({ ...p, durationSec: e.target.value }))}
                                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                      Descanso (s)
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      placeholder="Segundos"
                                      value={newExercise.restSec}
                                      onChange={(e) => setNewExercise(p => ({ ...p, restSec: e.target.value }))}
                                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium bg-white"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <textarea
                                    placeholder="Notas, ritmos, agarres..."
                                    value={newExercise.notes}
                                    onChange={(e) => setNewExercise(p => ({ ...p, notes: e.target.value }))}
                                    rows={2}
                                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 resize-none font-medium text-gray-600 bg-white"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAddExercise(dayKey)}
                                  className="w-full flex items-center justify-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Agregar a {dayKey}</span>
                                </button>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Entrenador */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Entrenador</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Entrenador (creado por)</label>
                <select
                  name="coach"
                  disabled={isViewOnly}
                  value={formData.coach}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                >
                  <option value="">Seleccionar entrenador</option>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-gray-500">Entrenador que crea y asigna esta rutina.</p>
            </div>

            {/* Estado */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Estado</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Estado de la rutina <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => !isViewOnly && setFormData(p => ({ ...p, active: !p.active }))}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors focus:outline-none ${formData.active ? 'bg-blue-600' : 'bg-gray-200'} ${isViewOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm text-gray-700 font-semibold">{formData.active ? 'Activa' : 'Pausada'}</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500">Las rutinas inactivas no estarán disponibles para el estudiante.</p>
            </div>

          </div>

          {/* Sticky Footer */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0 z-10 shrink-0">
            {isViewOnly ? (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                Aceptar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {loading ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{(routineData && routineData._id) ? 'Guardar cambios' : 'Crear rutina'}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
