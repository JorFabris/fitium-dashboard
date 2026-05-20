import React, { useState, useEffect } from 'react';
import { X, User, Check, Plus } from 'lucide-react';

interface CreateRoutineSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  routineData?: any | null;
}

export const CreateRoutineSidebar: React.FC<CreateRoutineSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  routineData
}) => {
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);

  // Mock student list for autocomplete
  const mockStudents = [
    { id: '1', name: 'Juan Pérez', img: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Ana López', img: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Martín Ruiz', img: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Lucía Fernández', img: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Tomás Díaz', img: 'https://i.pravatar.cc/150?u=5' },
    { id: '6', name: 'Valentina Morales', img: 'https://i.pravatar.cc/150?u=6' },
    { id: '7', name: 'Nicolás Castro', img: 'https://i.pravatar.cc/150?u=7' },
  ];

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

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
    }
    setSelectedDays(updated);

    // Update daysCount select label text
    if (updated.length === 0) {
      setFormData(prev => ({ ...prev, daysCount: 'Seleccionar días' }));
    } else {
      setFormData(prev => ({ ...prev, daysCount: `${updated.length} días seleccionados (${updated.join(', ')})` }));
    }
  };

  useEffect(() => {
    if (routineData && isOpen) {
      setFormData({
        name: routineData.name || '',
        description: routineData.description || '',
        startDate: routineData.startDate ? new Date(routineData.startDate).toISOString().split('T')[0] : '',
        endDate: routineData.endDate ? new Date(routineData.endDate).toISOString().split('T')[0] : '',
        daysCount: routineData.days ? `${routineData.days} días` : 'Seleccionar días',
        coach: routineData.coach || '',
        active: routineData.status === 'Activa'
      });
      // Setup mock student
      const foundStudent = mockStudents.find(s => s.name === routineData.student);
      if (foundStudent) {
        setSelectedStudent(foundStudent);
        setStudentSearch(foundStudent.name);
      }
      setSelectedDays(Array.from({ length: routineData.days || 3 }, (_, i) => weekdays[i].key));
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
    }
  }, [routineData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Por favor selecciona un estudiante.');
      return;
    }
    setLoading(true);

    const payload = {
      ...formData,
      student: selectedStudent.name,
      studentImg: selectedStudent.img,
      days: selectedDays.length || 3,
      status: formData.active ? 'Activa' : 'Pausada'
    };

    await onSubmit(payload, routineData?.id);
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
            <h2 className="text-lg font-bold text-gray-900">{routineData ? 'Editar rutina' : 'Nueva rutina'}</h2>
            <p className="text-xs text-gray-500 mt-1">Completa la información para crear una nueva rutina de entrenamiento.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
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
                  placeholder="Buscar estudiante por nombre..."
                  value={studentSearch}
                  onFocus={() => setShowStudentSuggestions(true)}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    if (selectedStudent && e.target.value !== selectedStudent.name) {
                      setSelectedStudent(null);
                    }
                  }}
                  className={`w-full ${selectedStudent ? 'pl-10' : 'pl-9'} pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium`}
                />
                {selectedStudent && (
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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Fuerza e Hipertrofia"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Descripción (opcional)</label>
                  <span className="text-[10px] text-gray-400">{formData.description.length}/300</span>
                </div>
                <textarea
                  name="description"
                  maxLength={300}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe el objetivo de la rutina, beneficios y recomendaciones..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none font-medium text-gray-600 leading-normal"
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
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha de fin (opcional)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-700 font-medium"
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
                <select
                  disabled
                  value={formData.daysCount}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium cursor-not-allowed outline-none"
                >
                  <option>{formData.daysCount}</option>
                </select>
                
                {/* Day Selector Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {weekdays.map(day => {
                    const isSelected = selectedDays.includes(day.key);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-[11px] text-gray-500">Selecciona los días en los que el estudiante realizará esta rutina.</p>
            </div>

            {/* Entrenador */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Entrenador</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Entrenador (creado por)</label>
                <select
                  name="coach"
                  value={formData.coach}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white"
                >
                  <option value="">Seleccionar entrenador</option>
                  <option value="Marcos Ruiz">Marcos Ruiz</option>
                  <option value="Sofía Gómez">Sofía Gómez</option>
                  <option value="Juan Pérez">Juan Pérez</option>
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
                    onClick={() => setFormData(p => ({ ...p, active: !p.active }))}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none ${formData.active ? 'bg-blue-600' : 'bg-gray-200'}`}
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
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{routineData ? 'Guardar cambios' : 'Crear rutina'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </>
  );
};
