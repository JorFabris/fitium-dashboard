import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Download, Eye, Edit2, Trash2, ChevronLeft, ChevronRight,
  Loader2, Filter, Calendar, Coins, CreditCard, Building2, Receipt
} from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { CreateExpenseSidebar } from '@/components/CreateExpenseSidebar';
import { toast } from 'react-toastify';

const categoryMap: { [key: string]: { label: string; className: string } } = {
  equipment: { label: 'Equipamiento', className: 'bg-purple-50 text-purple-700 border border-purple-100' },
  utilities: { label: 'Servicios', className: 'bg-blue-50 text-blue-700 border border-blue-100' },
  maintenance: { label: 'Mantenimiento', className: 'bg-amber-50 text-amber-700 border border-amber-100' },
  marketing: { label: 'Marketing', className: 'bg-pink-50 text-pink-700 border border-pink-100' },
  cleaning: { label: 'Limpieza', className: 'bg-slate-50 text-slate-700 border border-slate-100' },
  rent: { label: 'Alquiler', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  salaries: { label: 'Salarios', className: 'bg-indigo-50 text-indigo-700 border border-indigo-100' },
  other: { label: 'Otros', className: 'bg-gray-50 text-gray-700 border border-gray-100' }
};

const methodMap: { [key: string]: { label: string; className: string; icon: any } } = {
  cash: { label: 'Efectivo', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100', icon: Coins },
  card: { label: 'Tarjeta', className: 'bg-indigo-50 text-indigo-700 border border-indigo-100', icon: CreditCard },
  transfer: { label: 'Transferencia', className: 'bg-blue-50 text-blue-700 border border-blue-100', icon: Building2 }
};

const Expenses: React.FC = () => {
  const {
    expenses,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    createExpense,
    updateExpense,
    deleteExpense
  } = useExpenses();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>('create');
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Local Filter States
  const [categoryFilter, setCategoryFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  // Extract unique suppliers from expenses for the filter dropdown
  const uniqueSuppliers = useMemo(() => {
    const suppliers = expenses
      .map(e => e.supplier)
      .filter((s): s is string => !!s && s.trim().length > 0);
    return Array.from(new Set(suppliers));
  }, [expenses]);

  // Filtered expenses based on local UI choices
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch =
        (e.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.supplier || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter ? e.category === categoryFilter : true;
      const matchesMethod = methodFilter ? e.paymentMethod === methodFilter : true;
      const matchesSupplier = supplierFilter ? e.supplier === supplierFilter : true;

      return matchesSearch && matchesCategory && matchesMethod && matchesSupplier;
    });
  }, [expenses, searchQuery, categoryFilter, methodFilter, supplierFilter]);

  const handleOpenCreate = () => {
    setSelectedExpense(null);
    setViewMode('create');
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (expense: any) => {
    setSelectedExpense(expense);
    setViewMode('edit');
    setIsSidebarOpen(true);
  };

  const handleOpenView = (expense: any) => {
    setSelectedExpense(expense);
    setViewMode('view');
    setIsSidebarOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.')) {
      const success = await deleteExpense(id);
      if (success) {
        toast.success('Gasto eliminado correctamente');
      } else {
        toast.error('Hubo un error al eliminar el gasto');
      }
    }
  };

  const handleSidebarSubmit = async (data: any, id?: string) => {
    if (id) {
      const success = await updateExpense(id, data);
      if (success) {
        toast.success('Gasto actualizado correctamente');
      } else {
        toast.error('Hubo un error al actualizar el gasto');
      }
    } else {
      const success = await createExpense(data);
      if (success) {
        toast.success('Gasto registrado correctamente');
      } else {
        toast.error('Hubo un error al registrar el gasto');
      }
    }
  };

  const handleExport = () => {
    // Generate CSV content
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Proveedor', 'Monto', 'Método de pago', 'Notas'];
    const rows = filteredExpenses.map(e => [
      formatDate(e.date),
      e.description,
      categoryMap[e.category]?.label || e.category,
      e.supplier || 'N/A',
      e.amount,
      methodMap[e.paymentMethod]?.label || e.paymentMethod,
      e.notes || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gastos_fitium_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Gastos exportados correctamente');
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gastos</h1>
          <p className="text-sm text-gray-500 mt-1">Registra y gestiona los gastos de tu negocio.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar gasto..."
              className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm font-medium"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
          >
            <Download className="w-4 h-4 text-gray-500 shrink-0" />
            <span>Exportar</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Registrar gasto</span>
          </button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Date Filter visual helper */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <div className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 flex items-center justify-between">
            <span>Período actual</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
              Mes Completo
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(categoryMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-gray-100">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Supplier Filter */}
        <div className="relative">
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">Todos los proveedores</option>
            {uniqueSuppliers.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-gray-100">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Method Filter */}
        <div className="relative">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">Todos los métodos</option>
            {Object.entries(methodMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-gray-100">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8F9FA] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Fecha</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Descripción</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Categoría</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Proveedor</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Monto</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Método</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 relative">
              {loading ? (
                <tr>
                  <td colSpan={7} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-48 text-center text-gray-500">
                    No se encontraron gastos para mostrar.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => {
                  const cat = categoryMap[expense.category] || { label: expense.category, className: 'bg-gray-50 text-gray-700' };
                  const met = methodMap[expense.paymentMethod] || { label: expense.paymentMethod, className: 'bg-gray-50 text-gray-700', icon: Receipt };
                  const MethodIcon = met.icon;

                  return (
                    <tr key={expense._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Fecha */}
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {formatDate(expense.date)}
                      </td>
                      {/* Descripción */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-[280px]">{expense.description}</p>
                          {expense.notes && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{expense.notes}</p>
                          )}
                        </div>
                      </td>
                      {/* Categoría */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cat.className}`}>
                          {cat.label}
                        </span>
                      </td>
                      {/* Proveedor */}
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {expense.supplier || '—'}
                      </td>
                      {/* Monto */}
                      <td className="px-6 py-4 font-bold text-gray-900 text-base">
                        {formatCurrency(expense.amount)}
                      </td>
                      {/* Método */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${met.className}`}>
                          <MethodIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{met.label}</span>
                        </span>
                      </td>
                      {/* Acciones */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenView(expense)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(expense)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(expense._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              No se encontraron gastos para mostrar.
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const cat = categoryMap[expense.category] || { label: expense.category, className: 'bg-gray-50 text-gray-700' };
              const met = methodMap[expense.paymentMethod] || { label: expense.paymentMethod, className: 'bg-gray-50 text-gray-700', icon: Receipt };
              const MethodIcon = met.icon;

              return (
                <div key={expense._id} className="p-4 space-y-3.5 bg-white hover:bg-gray-50/30 transition-colors">
                  {/* Header Row */}
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-400 font-semibold">{formatDate(expense.date)}</span>
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.className}`}>
                        {cat.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${met.className}`}>
                        <MethodIcon className="w-3 h-3 shrink-0" />
                        <span>{met.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Description & Notes */}
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{expense.description}</h4>
                    {expense.supplier && (
                      <p className="text-xs text-gray-500 mt-1 font-medium">Proveedor: {expense.supplier}</p>
                    )}
                    {expense.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">{expense.notes}</p>
                    )}
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="text-lg font-extrabold text-gray-900">{formatCurrency(expense.amount)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenView(expense)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(expense)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Section */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 bg-white">
          <p className="text-xs text-gray-500 font-medium">
            Mostrando {filteredExpenses.length > 0 ? (page - 1) * limit + 1 : 0} a {Math.min(page * limit, totalDocs)} de {totalDocs} gastos
          </p>
          <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              Anterior
            </button>
            <div className="flex items-center gap-1 mx-2">
              <span className="text-sm font-semibold text-gray-700">Página {page} de {totalPages}</span>
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading || totalPages === 0}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Siguiente
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Slide-in sidebar for CRUD */}
      <CreateExpenseSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        expenseData={selectedExpense}
        isViewOnly={viewMode === 'view'}
      />

    </div>
  );
};

export default Expenses;
