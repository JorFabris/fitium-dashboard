import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface CreateCoachSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  coachData?: any | null;
  onlyView?: boolean;
}

export const CreateCoachSidebar: React.FC<CreateCoachSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  coachData,
  onlyView = false
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    active: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coachData && isOpen) {
      setFormData({
        firstName: coachData.firstName || '',
        lastName: coachData.lastName || '',
        email: coachData.email || '',
        password: '', // Never populate password on edit
        active: coachData.active ?? true,
      });
    } else if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        active: true,
      });
      setShowPassword(false);
    }
  }, [coachData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      active: formData.active,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    await onSubmit(payload, coachData?._id);
    setLoading(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto flex flex-col transition-transform transform translate-x-0">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{coachData ? 'Editar coach' : 'Crear coach'}</h2>
            <p className="text-xs text-gray-500 mt-1">{coachData ? 'Actualiza los datos del entrenador.' : 'Completa los datos para agregar un nuevo entrenador.'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6 space-y-8 flex-1">
            {/* Información personal */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Información personal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
                  <input disabled={onlyView} required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ej: Marcos" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Apellido <span className="text-red-500">*</span></label>
                  <input disabled={onlyView} required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ej: Ruiz" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <input disabled={onlyView} required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ej: marcos.ruiz@fitium.com" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
            </section>

            {/* Credenciales de acceso */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Credenciales de acceso</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contraseña (opcional)</label>
                <div className="relative">
                  <input 
                    disabled={onlyView}
                    type={showPassword ? 'text' : 'password'} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Mínimo 8 caracteres" 
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Si no defines una contraseña, el sistema generará una automáticamente.</p>
              </div>
            </section>

            {/* Estado */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Estado</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado del coach <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    type="button" 
                    disabled={onlyView}
                    onClick={() => setFormData(p => ({ ...p, active: !p.active }))} 
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none disabled:opacity-50 ${formData.active ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">{formData.active ? 'Activo' : 'Inactivo'}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Los coaches inactivos no podrán acceder al sistema.</p>
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0">
            <button hidden={onlyView} type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button hidden={onlyView} type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? (coachData ? 'Guardando...' : 'Creando...') : (coachData ? 'Guardar cambios' : 'Crear coach')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
