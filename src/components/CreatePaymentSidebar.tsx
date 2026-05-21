import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { studentsService } from '@/services/students.service';

interface CreatePaymentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  paymentData?: any;
  isViewOnly?: boolean;
}

const monthsList = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
];

const currentYear = new Date().getFullYear();
const yearsList = [currentYear - 1, currentYear, currentYear + 1];

const getDefaultMonthAndYear = () => {
  const today = new Date();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  if (today.getDate() > 23) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return { month, year };
};

export const CreatePaymentSidebar: React.FC<CreatePaymentSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  paymentData,
  isViewOnly = false
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const autocompleteRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState(() => {
    const { month, year } = getDefaultMonthAndYear();
    return {
      month,
      year,
      amount: '',
      status: 'paid' as 'pending' | 'paid' | 'overdue',
      dueDate: '',
      paidAt: '',
      paymentMethod: 'cash' as 'cash' | 'transfer' | 'card' | 'other',
      discount: '',
      notes: ''
    };
  });

  // Fetch students for search suggestions
  useEffect(() => {
    if (isOpen) {
      studentsService.getPaginated(1, 100).then((res) => {
        if (res && res.data) {
          const mapped = res.data.map((s: any) => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.email || '',
            img: s.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          }));
          setStudents(mapped);

          // Populate edit/view data if exists
          if (paymentData) {
            const defaultDate = getDefaultMonthAndYear();
            setFormData({
              month: paymentData.month || defaultDate.month,
              year: paymentData.year || defaultDate.year,
              amount: paymentData.amount || 0,
              status: paymentData.status || 'paid',
              dueDate: paymentData.dueDate ? new Date(paymentData.dueDate).toISOString().split('T')[0] : '',
              paidAt: paymentData.paidAt ? new Date(paymentData.paidAt).toISOString().split('T')[0] : '',
              paymentMethod: paymentData.paymentMethod || 'cash',
              discount: paymentData.discount || 0,
              notes: paymentData.notes || ''
            });

            if (paymentData.student) {
              const sObj = paymentData.student;
              const sName = typeof sObj === 'object' ? `${sObj.firstName} ${sObj.lastName}` : 'Estudiante';
              const sImg = typeof sObj === 'object' ? sObj.photo : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';
              const sId = typeof sObj === 'object' ? sObj._id : sObj;
              setSelectedStudent({
                id: sId,
                name: sName,
                img: sImg || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
              });
              setStudentSearch(sName);
            }
          }
        }
      }).catch(err => console.error(err));
    } else {
      // Reset form
      const { month, year } = getDefaultMonthAndYear();
      setFormData({
        month,
        year,
        amount: '',
        status: 'paid',
        dueDate: '',
        paidAt: '',
        paymentMethod: 'cash',
        discount: '',
        notes: ''
      });
      setSelectedStudent(null);
      setStudentSearch('');
    }
  }, [isOpen, paymentData]);

  // Click outside to close student suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowStudentSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search students from backend when typing in autocomplete
  useEffect(() => {
    if (!isOpen || selectedStudent) return;

    if (!studentSearch.trim()) {
      studentsService.getPaginated(1, 100).then((res) => {
        if (res && res.data) {
          setStudents(res.data.map((s: any) => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.email || '',
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
            email: s.email || '',
            img: s.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
          })));
        }
      }).catch(err => console.error(err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [studentSearch, isOpen, selectedStudent]);

  const filteredStudents = students;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'discount' || name === 'month' || name === 'year'
        ? Number(value)
        : value
    }));
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setStudentSearch(student.name);
    setShowStudentSuggestions(false);
  };

  const handleClearStudent = () => {
    if (isViewOnly) return;
    setSelectedStudent(null);
    setStudentSearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewOnly) {
      onClose();
      return;
    }
    if (!selectedStudent) {
      alert('Por favor selecciona un estudiante.');
      return;
    }

    setLoading(true);
    const payload = {
      student: selectedStudent.id,
      month: formData.month,
      year: formData.year,
      amount: formData.amount,
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString(),
      paidAt: formData.status === 'paid' && formData.paidAt ? new Date(formData.paidAt).toISOString() : undefined,
      paymentMethod: formData.status === 'paid' ? formData.paymentMethod : undefined,
      discount: formData.discount,
      notes: formData.notes
    };

    await onSubmit(payload, paymentData?._id);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

      {/* Sidebar Container */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-xl z-50 overflow-y-auto flex flex-col transition-transform transform translate-x-0">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isViewOnly ? 'Ver pago' : paymentData ? 'Editar pago' : 'Nuevo pago'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isViewOnly ? 'Detalle completo del pago registrado.' : 'Registra o actualiza la mensualidad de un estudiante.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="p-6 space-y-6 flex-1">

            {/* Student Autocomplete Search */}
            <div className="relative" ref={autocompleteRef}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Estudiante <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                {selectedStudent ? (
                  <div className="absolute left-3 flex items-center gap-2 pointer-events-none">
                    <img src={selectedStudent.img} alt={selectedStudent.name} className="w-5 h-5 rounded-full object-cover" />
                  </div>
                ) : (
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                )}

                <input
                  required
                  type="text"
                  placeholder="Buscar estudiante por nombre o email..."
                  readOnly={isViewOnly || !!selectedStudent}
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setShowStudentSuggestions(true);
                  }}
                  onFocus={() => !selectedStudent && setShowStudentSuggestions(true)}
                  className={`w-full pl-10 pr-10 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium ${selectedStudent ? 'bg-blue-50/30 text-blue-900 border-blue-200 font-semibold' : ''
                    } ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                />

                {selectedStudent && !isViewOnly && (
                  <button
                    type="button"
                    onClick={handleClearStudent}
                    className="absolute right-3 p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showStudentSuggestions && !isViewOnly && !selectedStudent && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 divide-y divide-gray-50">
                  {filteredStudents.length === 0 ? (
                    <div className="p-3 text-xs text-gray-500 text-center">No se encontraron estudiantes</div>
                  ) : (
                    filteredStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectStudent(s)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <img src={s.img} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">{s.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{s.email}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Mes y Año */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mes del Pago <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="month"
                  disabled={isViewOnly}
                  value={formData.month}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                >
                  {monthsList.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Año <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="year"
                  disabled={isViewOnly}
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Monto y Descuento */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Monto ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                  <input
                    required
                    type="number"
                    name="amount"
                    min={0}
                    readOnly={isViewOnly}
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`w-full pl-7 pr-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Descuento (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discount"
                    min={0}
                    max={100}
                    readOnly={isViewOnly}
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full pr-7 pl-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">%</span>
                </div>
              </div>
            </div>

            {/* Fecha de vencimiento y Estado */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Vencimiento <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="dueDate"
                  readOnly={isViewOnly}
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="status"
                  disabled={isViewOnly}
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white ${formData.status === 'paid' ? 'text-green-600 font-semibold' :
                    formData.status === 'pending' ? 'text-amber-600 font-semibold' : 'text-red-600 font-semibold'
                    } ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                >
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagado</option>
                  <option value="overdue">Vencido</option>
                </select>
              </div>
            </div>

            {/* Método de pago y fecha de pago (Solo si está pagado) */}
            {formData.status === 'paid' && (
              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-5 bg-green-50/30 p-3 rounded-lg border border-green-100">
                <div>
                  <label className="block text-xs font-semibold text-green-800 mb-1.5">
                    Método de Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="paymentMethod"
                    disabled={isViewOnly}
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-base md:text-sm border border-green-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 font-medium text-green-700 bg-white ${isViewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="cash">Efectivo</option>
                    <option value="transfer">Transferencia</option>
                    <option value="card">Tarjeta</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-green-800 mb-1.5">
                    Fecha de Pago <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    name="paidAt"
                    readOnly={isViewOnly}
                    value={formData.paidAt}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-base md:text-sm border border-green-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 font-medium text-green-700 ${isViewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
            )}

            {/* Notas */}
            <div className="border-t border-gray-50 pt-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notas adicionales</label>
              <textarea
                name="notes"
                readOnly={isViewOnly}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Escribe alguna observación o comentario aquí..."
                rows={3}
                className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium resize-none ${isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10">
            {isViewOnly ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
              >
                <span>Aceptar</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors flex items-center justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Guardando...' : paymentData ? 'Guardar cambios' : 'Registrar pago'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
