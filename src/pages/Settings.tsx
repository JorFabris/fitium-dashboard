import { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Shield, Filter, 
  Home, Users, UserSquare2, Calendar, CheckSquare, 
  CreditCard, Receipt, FileBarChart, Settings as SettingsIcon, Trophy,
  type LucideIcon
} from 'lucide-react';
import { useDashboardSections } from '@/hooks/useDashboardSections';
import { toast } from 'react-toastify';
import { CreateSectionSidebar } from '@/components/CreateSectionSidebar';

const getSectionIcon = (name: string): LucideIcon => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('dashboard')) return Home;
  if (lowerName.includes('estudiantes') || lowerName.includes('alumnos')) return Users;
  if (lowerName.includes('coaches')) return UserSquare2;
  if (lowerName.includes('clases')) return Calendar;
  if (lowerName.includes('asistencias')) return CheckSquare;
  if (lowerName.includes('pagos')) return CreditCard;
  if (lowerName.includes('gastos')) return Receipt;
  if (lowerName.includes('reportes')) return FileBarChart;
  if (lowerName.includes('configuración') || lowerName.includes('configuracion')) return SettingsIcon;
  if (lowerName.includes('competencias')) return Trophy;
  return Shield;
};

const getIconColorClass = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('dashboard')) return 'text-blue-500 bg-blue-50';
  if (lowerName.includes('estudiantes') || lowerName.includes('alumnos')) return 'text-purple-500 bg-purple-50';
  if (lowerName.includes('coaches')) return 'text-emerald-500 bg-emerald-50';
  if (lowerName.includes('clases')) return 'text-orange-500 bg-orange-50';
  if (lowerName.includes('asistencias')) return 'text-teal-500 bg-teal-50';
  if (lowerName.includes('pagos')) return 'text-blue-600 bg-blue-50';
  if (lowerName.includes('gastos')) return 'text-pink-500 bg-pink-50';
  if (lowerName.includes('reportes')) return 'text-indigo-500 bg-indigo-50';
  if (lowerName.includes('configuración') || lowerName.includes('configuracion')) return 'text-gray-500 bg-gray-50';
  if (lowerName.includes('competencias')) return 'text-yellow-600 bg-yellow-50';
  return 'text-gray-500 bg-gray-50';
};

export default function Settings() {
  const {
    sections,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    deleteSection,
    updateSection,
    createSection
  } = useDashboardSections();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);

  const handleOpenCreate = () => {
    setSelectedSection(null);
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (section: any) => {
    setSelectedSection(section);
    setIsSidebarOpen(true);
  };

  const handleSidebarSubmit = async (data: any, id?: string) => {
    if (id) {
      const success = await updateSection(id, data);
      if (success) {
        toast.success('Sección actualizada correctamente');
        setIsSidebarOpen(false);
      } else {
        toast.error('Hubo un error al actualizar la sección');
      }
    } else {
      const success = await createSection(data);
      if (success) {
        toast.success('Sección creada correctamente');
        setIsSidebarOpen(false);
      } else {
        toast.error('Hubo un error al crear la sección');
      }
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sección?')) {
      const success = await deleteSection(id);
      if (success) {
        toast.success('Sección eliminada correctamente');
      } else {
        toast.error('Error al eliminar la sección');
      }
    }
  };

  const toggleStatus = async (section: any) => {
    const success = await updateSection(section._id, { isEnabled: !section.isEnabled });
    if (success) {
      toast.success(`Sección ${!section.isEnabled ? 'activada' : 'desactivada'} correctamente`);
    } else {
      toast.error('Error al actualizar el estado');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return (
      <>
        {date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br />
        {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </>
    );
  };

  const filteredSections = sections.filter(s => 
    s.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 px-1 py-2 sm:px-4 sm:py-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Administra las secciones del sistema y los roles que pueden acceder a cada una.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva sección</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Gestión de secciones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Define qué secciones estarán disponibles en el sistema y qué roles pueden acceder a cada una.</p>
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar sección..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-full"
              />
            </div>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-full sm:w-auto bg-white">
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors">
            <Filter className="w-4 h-4 text-gray-500" />
            <span>Filtrar roles</span>
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Cargando secciones...</div>
          ) : filteredSections.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">No se encontraron secciones</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 text-xs font-bold tracking-wide">
                  <th className="px-6 py-4">Sección</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Roles permitidos</th>
                  <th className="px-6 py-4">Creado el</th>
                  <th className="px-6 py-4">Actualizado el</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredSections.map((s) => {
                  const Icon = getSectionIcon(s.sectionName);
                  const iconColor = getIconColorClass(s.sectionName);

                  return (
                    <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-gray-900">{s.sectionName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-500 line-clamp-2 max-w-xs">{s.description || 'Sin descripción'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            type="button" 
                            onClick={() => toggleStatus(s)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none ${s.isEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${s.isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                          <span className={`font-medium ${s.isEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
                            {s.isEnabled ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {s.allowedRoles.includes('admin') && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">Admin</span>
                          )}
                          {s.allowedRoles.includes('coach') && (
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">Coach</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 leading-snug">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 leading-snug">
                        {formatDate(s.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => handleOpenEdit(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteClick(s._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <span>{`Mostrando ${filteredSections.length > 0 ? (page - 1) * 10 + 1 : 0} a ${Math.min(page * 10, totalDocs)} de ${totalDocs} secciones`}</span>
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
      <CreateSectionSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        sectionData={selectedSection}
      />
    </div>
  );
}
