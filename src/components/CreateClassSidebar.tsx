import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { coachesService } from '@/services/coaches.service';

interface CreateClassSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  classData?: any | null;
  isViewOnly?: boolean;
}

const dayMapping: Record<string, string> = {
  'Lun': 'Monday',
  'Mar': 'Tuesday',
  'Mié': 'Wednesday',
  'Jue': 'Thursday',
  'Vie': 'Friday',
  'Sáb': 'Saturday',
  'Dom': 'Sunday'
};

const reverseDayMapping: Record<string, string> = {
  'Monday': 'Lun',
  'Tuesday': 'Mar',
  'Wednesday': 'Mié',
  'Thursday': 'Jue',
  'Friday': 'Vie',
  'Saturday': 'Sáb',
  'Sunday': 'Dom'
};

const weekdays = [
  { key: 'Lun', label: 'Lun' },
  { key: 'Mar', label: 'Mar' },
  { key: 'Mié', label: 'Mié' },
  { key: 'Jue', label: 'Jue' },
  { key: 'Vie', label: 'Vie' },
  { key: 'Sáb', label: 'Sáb' },
  { key: 'Dom', label: 'Dom' }
];

export const CreateClassSidebar: React.FC<CreateClassSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classData,
  isViewOnly = false
}) => {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    coach: '',
    startTime: '07:00',
    endTime: '08:00',
    capacity: 20,
    active: true,
    bookingsCount: 0,
    daysCount: 'Seleccionar días'
  });

  // Fetch real coaches when modal is open
  useEffect(() => {
    if (isOpen) {
      coachesService.getPaginated(1, 100).then((res) => {
        if (res && res.data && res.data.data) {
          const mapped = res.data.data.map((c: any) => ({
            id: c._id,
            name: `${c.firstName} ${c.lastName}`,
            img: c.profileImage || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`
          }));
          setCoaches(mapped);
        }
      }).catch(err => {
        console.error('Error fetching coaches:', err);
      });
    }
  }, [isOpen]);

  // Load classData for Edit or View Mode
  useEffect(() => {
    if (isOpen && classData) {
      const coachId = typeof classData.coach === 'object' ? classData.coach?._id : classData.coach;
      const initialSelected = Array.isArray(classData.weekDays)
        ? classData.weekDays.map((d: string) => reverseDayMapping[d]).filter(Boolean)
        : [];
      
      setSelectedDays(initialSelected);
      setFormData({
        name: classData.name || '',
        coach: coachId || '',
        startTime: classData.startTime || '07:00',
        endTime: classData.endTime || '08:00',
        capacity: classData.capacity || 20,
        active: classData.active !== undefined ? classData.active : true,
        bookingsCount: Array.isArray(classData.bookings) ? classData.bookings.length : 0,
        daysCount: initialSelected.length > 0
          ? `${initialSelected.length} días seleccionados (${initialSelected.join(', ')})`
          : 'Seleccionar días'
      });
    } else if (!isOpen) {
      setFormData({
        name: '',
        coach: '',
        startTime: '07:00',
        endTime: '08:00',
        capacity: 20,
        active: true,
        bookingsCount: 0,
        daysCount: 'Seleccionar días'
      });
      setSelectedDays([]);
    }
  }, [classData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (dayKey: string) => {
    if (isViewOnly) return;
    
    setSelectedDays((prev) => {
      const next = prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey];
      
      // Sort weekdays to keep order
      const sorted = weekdays
        .map(w => w.key)
        .filter(key => next.includes(key));

      setFormData((prevForm) => ({
        ...prevForm,
        daysCount: sorted.length > 0
          ? `${sorted.length} día${sorted.length > 1 ? 's' : ''} seleccionado${sorted.length > 1 ? 's' : ''} (${sorted.join(', ')})`
          : 'Seleccionar días'
      }));
      return sorted;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewOnly) return;
    if (!formData.coach) {
      alert('Por favor selecciona un entrenador.');
      return;
    }
    if (selectedDays.length === 0) {
      alert('Por favor selecciona al menos un día de la semana.');
      return;
    }
    setLoading(true);

    const payload = {
      name: formData.name,
      coach: formData.coach,
      startTime: formData.startTime,
      endTime: formData.endTime,
      weekDays: selectedDays.map(d => dayMapping[d]),
      capacity: Number(formData.capacity),
      active: formData.active
    };

    await onSubmit(payload, classData?._id);
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
              {isViewOnly ? 'Ver clase' : classData ? 'Editar clase' : 'Nueva clase'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isViewOnly ? 'Detalle completo de la clase programada.' : 'Completa la información para gestionar esta clase.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="p-6 space-y-6 flex-1">
            
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Información básica</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nombre de la clase <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  readOnly={isViewOnly}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isViewOnly ? "" : "Ej: CrossFit, HIIT, Yoga..."}
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                />
                {!isViewOnly && <p className="text-[10px] text-gray-400 mt-1">Elige un nombre descriptivo para la clase.</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Entrenador <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="coach"
                  disabled={isViewOnly}
                  value={formData.coach}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                >
                  <option value="">Seleccionar entrenador</option>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {!isViewOnly && <p className="text-[10px] text-gray-400 mt-1">Selecciona el coach que estará a cargo.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Hora de inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="time"
                    name="startTime"
                    readOnly={isViewOnly}
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-700 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Hora de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="time"
                    name="endTime"
                    readOnly={isViewOnly}
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-700 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                  />
                </div>
              </div>
              {!isViewOnly && <p className="text-[10px] text-gray-400">La clase no puede exceder las 24 horas.</p>}
            </div>

            {/* Días de la Semana */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Días de la semana</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Días <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.daysCount}
                  className="w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-semibold cursor-not-allowed outline-none select-none"
                />
                
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
              <p className="text-[11px] text-gray-500">Selecciona los días en los que se impartirá esta clase.</p>
            </div>

            {/* Capacidad y Reservas */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Capacidad y reservas</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Capacidad máxima <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  name="capacity"
                  min={1}
                  readOnly={isViewOnly}
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Ej: 20"
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                />
                {!isViewOnly && <p className="text-[10px] text-gray-400 mt-1">Número máximo de cupos por sesión.</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reservas actuales</label>
                <input
                  type="text"
                  readOnly
                  value={formData.bookingsCount}
                  className="w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-semibold cursor-not-allowed outline-none select-none"
                />
                {!isViewOnly && <p className="text-[10px] text-gray-400 mt-1">Se actualizará automáticamente.</p>}
              </div>
            </div>

            {/* Estado */}
            <div className="border-t border-gray-50 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Estado</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Clase activa <span className="text-red-500">*</span>
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
              <p className="text-[11px] text-gray-500">Las clases inactivas no estarán disponibles para los estudiantes.</p>
            </div>

          </div>

          {/* Sticky Footer */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0 z-10 shrink-0">
            {isViewOnly ? (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Aceptar
              </button>
            ) : (
              <>
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
                      <span>{classData ? 'Guardar cambios' : 'Crear clase'}</span>
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
