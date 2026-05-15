import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';

interface CreateStudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  studentData?: any | null;
  onlyView?: boolean;
}

export const CreateStudentSidebar: React.FC<CreateStudentSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentData,
  onlyView = false
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: '',
    email: '',
    phone: '',
    emergencyPhone: '',
    address: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    active: true,
    notes: '',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentData && isOpen) {
      setFormData({
        firstName: studentData.firstName || '',
        lastName: studentData.lastName || '',
        idNumber: studentData.idNumber || '',
        birthDate: studentData.birthDate ? new Date(studentData.birthDate).toISOString().split('T')[0] : '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        emergencyPhone: studentData.emergencyPhone || '',
        address: studentData.address || '',
        enrollmentDate: studentData.enrollmentDate ? new Date(studentData.enrollmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        active: studentData.active ?? true,
        notes: studentData.notes || '',
        photo: studentData.photo || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop'
      });
    } else if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        idNumber: '',
        birthDate: '',
        email: '',
        phone: '',
        emergencyPhone: '',
        address: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        active: true,
        notes: '',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop'
      });
    }
  }, [studentData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
      enrollmentDate: formData.enrollmentDate ? new Date(formData.enrollmentDate).toISOString() : undefined,
    };

    await onSubmit(payload, studentData?._id);
    setLoading(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto flex flex-col transition-transform transform translate-x-0">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{studentData ? 'Editar estudiante' : 'Crear estudiante'}</h2>
            <p className="text-xs text-gray-500 mt-1">{studentData ? 'Actualiza los datos del alumno.' : 'Completa los datos básicos del nuevo alumno.'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6 space-y-8 flex-1">
            {/* Foto de perfil */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Foto de perfil</h3>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
                  <Camera className="w-6 h-6 mb-1" />
                </div>
                <div>
                  <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Subir foto</button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG o WEBP<br />Máx. 2MB</p>
                </div>
              </div>
            </section>

            {/* Información personal */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Información personal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ej: Juan" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Apellido <span className="text-red-500">*</span></label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ej: Pérez" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">DNI / Documento</label>
                  <input name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="Ej: 40123456" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha de nacimiento <span className="text-red-500">*</span></label>
                  <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-600" />
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contacto</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ej: juan@email.com" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Teléfono</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej: +54 11 1234 5678" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Teléfono de emergencia</label>
                  <input name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="Ej: +54 11 8765 4321" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Dirección</label>
                  <input name="address" value={formData.address} onChange={handleChange} placeholder="Ej: Av. Siempre Viva 742" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>
              </div>
            </section>

            {/* Información adicional */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Información adicional</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha de inscripción <span className="text-red-500">*</span></label>
                  <input required type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-3 mt-2">
                    <button type="button" onClick={() => setFormData(p => ({ ...p, active: !p.active }))} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none ${formData.active ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.active ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-sm text-gray-700 font-medium">{formData.active ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </div>
                <div className="col-span-2 mt-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notas</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Agrega observaciones médicas, lesiones o información relevante..." rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"></textarea>
                  <div className="text-right text-xs text-gray-400 mt-1">{formData.notes.length}/500</div>
                </div>
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0">
            <button hidden={onlyView} type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button hidden={onlyView} type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? (studentData ? 'Guardando...' : 'Creando...') : (studentData ? 'Guardar cambios' : 'Crear estudiante')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
