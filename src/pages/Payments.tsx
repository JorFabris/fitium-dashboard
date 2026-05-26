import { useState } from 'react';
import { Search, Plus, Download, Eye, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { CreatePaymentSidebar } from '@/components/CreatePaymentSidebar';
import { usePayments } from '@/hooks/usePayments';
import { toast } from 'react-toastify';
import type { MonthlyFee } from '@/types';

const monthNames = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const paymentMethodLabels: Record<string, string> = {
  'cash': 'Efectivo',
  'transfer': 'Transferencia',
  'card': 'Tarjeta',
  'other': 'Otro'
};

export default function Payments() {
  const {
    payments,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    createPayment,
    updatePayment,
    deletePayment
  } = usePayments();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<MonthlyFee | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleOpenCreate = () => {
    setSelectedPayment(null);
    setIsViewOnly(false);
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (paymentObj: MonthlyFee) => {
    setSelectedPayment(paymentObj);
    setIsViewOnly(false);
    setIsSidebarOpen(true);
  };

  const handleOpenView = (paymentObj: MonthlyFee) => {
    setSelectedPayment(paymentObj);
    setIsViewOnly(true);
    setIsSidebarOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.')) {
      const success = await deletePayment(id);
      if (success) {
        toast.success('Pago eliminado correctamente');
      } else {
        toast.error('Hubo un error al eliminar el pago');
      }
    }
  };

  const handleSidebarSubmit = async (data: Partial<MonthlyFee>, id?: string) => {
    if (id) {
      const success = await updatePayment(id, data);
      if (success) {
        toast.success('Pago actualizado correctamente');
        setIsSidebarOpen(false);
      } else {
        toast.error('Hubo un error al actualizar el pago');
      }
    } else {
      const success = await createPayment(data);
      if (success) {
        toast.success('Pago registrado correctamente');
        setIsSidebarOpen(false);
      } else {
        toast.error('Hubo un error al registrar el pago');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-200">Pagado</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full border border-amber-200">Pendiente</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200">Vencido</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-full border border-gray-200">{status}</span>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  };

  // Filter payments locally
  const filteredPayments = payments.filter(p => {
    const studentName = typeof p.student === 'object' ? `${p.student?.firstName || ''} ${p.student?.lastName || ''}` : '';
    const studentEmail = typeof p.student === 'object' ? p.student?.email || '' : '';

    return studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 px-1 py-2 sm:px-4 sm:py-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pagos de Mensualidad</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Registra y administra las cuotas y membresías de tus estudiantes.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-full bg-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors bg-white shadow-sm shrink-0">
              <Download className="w-4 h-4 text-gray-500 shrink-0" />
              <span>Exportar</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Pago</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Content list */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Cargando pagos...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">No se encontraron pagos registrados</div>
          ) : (
            <>
              {/* Mobile Cards (Mobile-first layout) */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                {filteredPayments.map((p) => {
                  const studentName = typeof p.student === 'object'
                    ? `${p.student?.firstName} ${p.student?.lastName}`
                    : 'Estudiante no cargado';
                  // const studentImg = p.student?.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop`;

                  return (
                    <div key={p._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* <img src={studentImg} alt={studentName} className="w-8 h-8 rounded-full object-cover" /> */}
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">{studentName}</span>
                            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{p.student?.email}</span>
                          </div>
                        </div>
                        {getStatusBadge(p.status)}
                      </div>

                      {/* Detail Grid */}
                      <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-3 text-xs">
                        <div>
                          <span className="text-gray-400 font-medium block mb-1">Monto Neto</span>
                          <span className="text-gray-950 font-bold">{formatCurrency(p.amount)}</span>
                          {p.discount > 0 && (
                            <span className="text-[10px] text-green-600 block mt-0.5">({p.discount}% desc)</span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium block mb-1">Periodo</span>
                          <span className="text-gray-900 font-semibold">{monthNames[p.month]} - {p.year}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium block mb-1">Vencimiento</span>
                          <span className="text-gray-900 font-semibold">{formatDate(p.dueDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium block mb-1">Pago / Método</span>
                          {p.status === 'paid' ? (
                            <div className="text-gray-900 font-semibold">
                              <span>{formatDate(p.paidAt)}</span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">Método: {paymentMethodLabels[p.paymentMethod] || p.paymentMethod}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No abonado</span>
                          )}
                        </div>
                      </div>

                      {/* Notes (if any) */}
                      {p.notes && (
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-[11px] text-gray-500 flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span className="italic">{p.notes}</span>
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-3">
                        <button onClick={() => handleOpenView(p)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                        <button onClick={() => handleOpenEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors bg-white">
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button onClick={() => handleDeleteClick(p._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors bg-white">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table (Visible on desktop, hidden on mobile) */}
              <table className="w-full text-left border-collapse hidden md:table">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-3">Estudiante</th>
                    <th className="px-6 py-3">Periodo</th>
                    <th className="px-6 py-3 text-right">Monto</th>
                    <th className="px-6 py-3 text-center">Descuento</th>
                    <th className="px-6 py-3">Vencimiento</th>
                    <th className="px-6 py-3">Fecha de Pago</th>
                    <th className="px-6 py-3">Método</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {filteredPayments.map((p) => {
                    const studentName = typeof p.student === 'object'
                      ? `${p.student?.firstName} ${p.student?.lastName}`
                      : 'Estudiante no cargado';
                    // const studentImg = p.student?.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop`;

                    return (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Student info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* <img src={studentImg} alt={studentName} className="w-7 h-7 rounded-full object-cover" /> */}
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                              {p.student?.firstName?.[0]}{p.student?.lastName?.[0]}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block">{studentName}</span>
                              <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{p.student?.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Periodo */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700">{monthNames[p.month]} - {p.year}</span>
                        </td>

                        {/* Monto */}
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-gray-900">{formatCurrency(p.amount)}</span>
                        </td>

                        {/* Descuento */}
                        <td className="px-6 py-4 text-center">
                          {p.discount > 0 ? (
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded font-semibold border border-green-100">{p.discount}%</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Vencimiento */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-600">{formatDate(p.dueDate)}</span>
                        </td>

                        {/* Fecha Pago */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-600">{formatDate(p.paidAt)}</span>
                        </td>

                        {/* Método */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-600">
                            {paymentMethodLabels[p.paymentMethod] || p.paymentMethod || '-'}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4">
                          {getStatusBadge(p.status)}
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleOpenView(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 bg-white">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 bg-white">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteClick(p._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 bg-white">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{`Mostrando ${filteredPayments.length > 0 ? (page - 1) * 10 + 1 : 0} a ${Math.min(page * 10, totalDocs)} de ${totalDocs} pagos`}</span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              &lt;
            </button>
            <button className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg font-semibold">{page}</button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Modal */}
      <CreatePaymentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        paymentData={selectedPayment}
        isViewOnly={isViewOnly}
      />
    </div>
  );
}
