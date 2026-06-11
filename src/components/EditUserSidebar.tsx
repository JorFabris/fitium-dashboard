import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface EditUserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  userData?: any | null;
}

export const EditUserSidebar: React.FC<EditUserSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userData
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    box: '',
    studentAssociated: '',
    active: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        password: '',
        role: userData.role || 'coach',
        box: userData.box || 'Fitium Box',
        studentAssociated: userData.studentAssociated || '',
        active: userData.active ?? true,
      });
    } else if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        box: '',
        studentAssociated: '',
        active: true,
      });
      setShowPassword(false);
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      box: formData.box,
      studentAssociated: formData.studentAssociated,
      active: formData.active,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60] transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-[70] overflow-y-auto flex flex-col transition-transform transform translate-x-0">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Editar usuario</h2>
            <p className="text-xs text-gray-500 mt-1">Actualiza la información del usuario.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Apellido <span className="text-red-500">*</span></label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contraseña <span className="text-gray-400 font-normal">(dejar en blanco para no cambiar)</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Nueva contraseña" 
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Mínimo 6 caracteres.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Rol <span className="text-red-500">*</span></label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Box <span className="text-red-500">*</span></label>
              <select name="box" value={formData.box} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white">
                <option value="Fitium Box">Fitium Box</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estudiante asociado <span className="text-gray-400 font-normal">(opcional)</span></label>
              <select name="studentAssociated" value={formData.studentAssociated} onChange={handleChange} disabled={formData.role !== 'coach'} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white disabled:bg-gray-50 disabled:text-gray-500">
                <option value="">Buscar y seleccionar estudiante</option>
                {/* Options would go here */}
              </select>
              <p className="text-[11px] text-gray-500 mt-2">Solo aplica para usuarios con rol Coach.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setFormData(p => ({ ...p, active: !p.active }))} 
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none ${formData.active ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.active ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-700 font-medium">{formData.active ? 'Activo' : 'Inactivo'}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Los usuarios inactivos no podrán acceder al sistema.</p>
            </div>

            {userData && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mt-4">
                <h4 className="text-xs font-semibold text-gray-900 mb-3">Información del sistema</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-gray-500">Fecha de creación</p>
                    <p className="text-xs text-gray-700 font-medium mt-1">22/01/2024 10:30 AM</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500">Última actualización</p>
                    <p className="text-xs text-gray-700 font-medium mt-1">15/05/2025 09:15 AM</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
