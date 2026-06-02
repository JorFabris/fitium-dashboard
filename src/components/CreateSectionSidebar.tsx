import React, { useState, useEffect } from 'react';
import { X, Shield, User, Info } from 'lucide-react';

interface CreateSectionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  sectionData?: any | null;
}

export const CreateSectionSidebar: React.FC<CreateSectionSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sectionData
}) => {
  const [formData, setFormData] = useState({
    sectionName: '',
    description: '',
    isEnabled: true,
    allowedRoles: ['admin'] as string[]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sectionData && isOpen) {
      setFormData({
        sectionName: sectionData.sectionName || '',
        description: sectionData.description || '',
        isEnabled: sectionData.isEnabled ?? true,
        allowedRoles: sectionData.allowedRoles || ['admin']
      });
    } else if (!isOpen) {
      setFormData({
        sectionName: '',
        description: '',
        isEnabled: true,
        allowedRoles: ['admin']
      });
    }
  }, [sectionData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => {
      const isSelected = prev.allowedRoles.includes(role);
      let newRoles = [...prev.allowedRoles];
      
      if (isSelected) {
        newRoles = newRoles.filter(r => r !== role);
      } else {
        newRoles.push(role);
      }
      
      return { ...prev, allowedRoles: newRoles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.allowedRoles.length === 0) {
      return; // Prevenir guardado si no hay roles
    }
    
    setLoading(true);

    try {
      await onSubmit(formData, sectionData?._id);
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
            <h2 className="text-lg font-bold text-gray-900">{sectionData ? 'Editar sección' : 'Nueva sección'}</h2>
            <p className="text-xs text-gray-500 mt-1">{sectionData ? 'Actualiza los datos de la sección y sus permisos.' : 'Crea una nueva sección y define quién puede acceder a ella.'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nombre de la sección <span className="text-red-500">*</span></label>
              <input 
                required 
                name="sectionName" 
                value={formData.sectionName} 
                onChange={handleChange} 
                placeholder="Ej. Inventario"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
              />
              <p className="text-[11px] text-gray-500 mt-1.5">Este nombre se mostrará en el menú lateral.</p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Descripción <span className="text-gray-400 font-normal">(opcional)</span></label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Describe brevemente qué contiene esta sección y su propósito."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none" 
              />
              <p className="text-[11px] text-gray-500 mt-1.5">Máximo 200 caracteres.</p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setFormData(p => ({ ...p, isEnabled: !p.isEnabled }))} 
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none ${formData.isEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-700 font-medium">{formData.isEnabled ? 'Activo' : 'Inactivo'}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Si está inactivo, la sección no estará disponible en el sistema.</p>
            </div>

            {/* Roles Permitidos */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Roles permitidos <span className="text-red-500">*</span></label>
              <p className="text-[11px] text-gray-500 mb-3">Selecciona los roles que podrán acceder a esta sección.</p>
              
              <div className="space-y-3">
                {/* Admin Role */}
                <label className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${formData.allowedRoles.includes('admin') ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                      checked={formData.allowedRoles.includes('admin')}
                      onChange={() => handleRoleToggle('admin')}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <Shield className={`w-3.5 h-3.5 ${formData.allowedRoles.includes('admin') ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${formData.allowedRoles.includes('admin') ? 'text-blue-900' : 'text-gray-700'}`}>Admin</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">Acceso completo a la sección.</span>
                  </div>
                </label>

                {/* Coach Role */}
                <label className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${formData.allowedRoles.includes('coach') ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                      checked={formData.allowedRoles.includes('coach')}
                      onChange={() => handleRoleToggle('coach')}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <User className={`w-3.5 h-3.5 ${formData.allowedRoles.includes('coach') ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${formData.allowedRoles.includes('coach') ? 'text-blue-900' : 'text-gray-700'}`}>Coach</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">Acceso limitado según permisos.</span>
                  </div>
                </label>
              </div>

              {formData.allowedRoles.length === 0 && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex items-start gap-2 mt-4">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-blue-900">Información</h4>
                    <p className="text-[11px] text-blue-700 mt-0.5">Al menos un rol debe tener acceso a la sección.</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || formData.allowedRoles.length === 0} 
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar sección'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
