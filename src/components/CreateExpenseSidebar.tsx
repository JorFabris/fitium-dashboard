import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Image as ImageIcon, Trash2, Download } from 'lucide-react';

interface CreateExpenseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: string) => Promise<void>;
  expenseData?: any;
  isViewOnly?: boolean;
}

const categoriesList = [
  { value: 'equipment', label: 'Equipamiento' },
  { value: 'utilities', label: 'Servicios' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'cleaning', label: 'Limpieza' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'salaries', label: 'Salarios' },
  { value: 'other', label: 'Otros' }
];

const paymentMethodsList = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'transfer', label: 'Transferencia' }
];

export const CreateExpenseSidebar: React.FC<CreateExpenseSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  expenseData,
  isViewOnly = false
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'equipment',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    paymentMethod: 'cash',
    receipt: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (expenseData) {
        setFormData({
          description: expenseData.description || '',
          category: expenseData.category || 'equipment',
          amount: expenseData.amount ? String(expenseData.amount) : '',
          date: expenseData.date ? new Date(expenseData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          supplier: expenseData.supplier || '',
          paymentMethod: expenseData.paymentMethod || 'cash',
          receipt: expenseData.receipt || '',
          notes: expenseData.notes || ''
        });
      } else {
        setFormData({
          description: '',
          category: 'equipment',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          supplier: '',
          paymentMethod: 'cash',
          receipt: '',
          notes: ''
        });
      }
    }
  }, [isOpen, expenseData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo supera el límite de 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          receipt: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setFormData(prev => ({
      ...prev,
      receipt: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        amount: Number(formData.amount)
      };
      await onSubmit(payload, expenseData?._id);
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-300 z-50 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-in sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-50 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isViewOnly ? 'Detalle de gasto' : expenseData ? 'Editar gasto' : 'Nuevo gasto'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isViewOnly
                ? 'Información completa del gasto registrado.'
                : expenseData
                ? 'Modifica los datos del gasto seleccionado.'
                : 'Registra un nuevo gasto de tu negocio.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-6 space-y-5 flex-1">
            
            {/* Descripción */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-gray-400 font-medium">
                  {formData.description.length}/150
                </span>
              </div>
              <textarea
                required
                name="description"
                readOnly={isViewOnly}
                maxLength={150}
                value={formData.description}
                onChange={handleChange}
                placeholder="Ej. Compra de discos olímpicos 20kg"
                rows={2}
                className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium resize-none ${
                  isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                }`}
              />
            </div>

            {/* Categoría y Monto */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="category"
                  disabled={isViewOnly}
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white ${
                    isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                  }`}
                >
                  {categoriesList.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Monto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    readOnly={isViewOnly}
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`w-full pl-7 pr-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-800 ${
                      isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                name="date"
                readOnly={isViewOnly}
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 ${
                  isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                }`}
              />
            </div>

            {/* Proveedor */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Proveedor <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                name="supplier"
                readOnly={isViewOnly}
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Ej. Fitness Pro"
                className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-800 ${
                  isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                }`}
              />
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Método de pago <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="paymentMethod"
                disabled={isViewOnly}
                value={formData.paymentMethod}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-gray-700 bg-white ${
                  isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                }`}
              >
                {paymentMethodsList.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Comprobante */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Comprobante <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              {formData.receipt ? (
                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {formData.receipt.startsWith('data:image/') ? (
                      <img
                        src={formData.receipt}
                        alt="Comprobante"
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                      />
                    ) : formData.receipt.startsWith('data:application/pdf') ? (
                      <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg border border-red-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg border border-blue-100 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <span className="text-xs font-semibold text-gray-700 block truncate">Comprobante cargado</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Archivo en Base64</span>
                    </div>
                  </div>
                  {isViewOnly ? (
                    <a
                      href={formData.receipt}
                      download={`comprobante_${formData.description.replace(/\s+/g, '_').toLowerCase() || 'gasto'}`}
                      className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100 flex items-center justify-center shrink-0"
                      title="Descargar comprobante"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={removeReceipt}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : isViewOnly ? (
                <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-xs text-gray-400 font-medium">
                  Sin comprobante adjunto
                </div>
              ) : (
                <label className="border border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50/50 transition-colors gap-2 text-center group">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 group-hover:scale-105 transition-transform duration-200">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">Subir comprobante</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">PNG, JPG o PDF (Máx. 5MB)</span>
                  </div>
                </label>
              )}
            </div>

            {/* Notas */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Notas <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <span className="text-[10px] text-gray-400 font-medium">
                  {formData.notes.length}/300
                </span>
              </div>
              <textarea
                name="notes"
                readOnly={isViewOnly}
                maxLength={300}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Agrega una nota (opcional)..."
                rows={3}
                className={`w-full px-3 py-2 text-base md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium resize-none ${
                  isViewOnly ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''
                }`}
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
                  className="w-1/2 sm:w-auto px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors flex items-center justify-center bg-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Guardando...' : expenseData ? 'Guardar cambios' : 'Guardar gasto'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
