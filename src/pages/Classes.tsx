import { useState } from 'react';
import { Search, Plus, Download, Eye, Edit2, Trash2, Dumbbell } from 'lucide-react';
import { CreateClassSidebar } from '@/components/CreateClassSidebar';
import { useClasses } from '@/hooks/useClasses';
import { toast } from 'react-toastify';
import type { Class } from '@/types';

const reverseDayMapping: Record<string, string> = {
  'Monday': 'Lun',
  'Tuesday': 'Mar',
  'Wednesday': 'Mié',
  'Thursday': 'Jue',
  'Friday': 'Vie',
  'Saturday': 'Sáb',
  'Sunday': 'Dom'
};

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Classes() {
  const {
    classes,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    createClass,
    updateClass,
    deleteClass
  } = useClasses();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleOpenCreate = () => {
    setSelectedClass(null);
    setIsViewOnly(false);
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (classObj: Class) => {
    setSelectedClass(classObj);
    setIsViewOnly(false);
    setIsSidebarOpen(true);
  };

  const handleOpenView = (classObj: Class) => {
    setSelectedClass(classObj);
    setIsViewOnly(true);
    setIsSidebarOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer.')) {
      const success = await deleteClass(id);
      if (success) {
        toast.success('Clase eliminada correctamente');
      } else {
        toast.error('Hubo un error al eliminar la clase');
      }
    }
  };

  const handleSidebarSubmit = async (data: Partial<Class>, id?: string) => {
    if (id) {
      const success = await updateClass(id, data);
      if (success) {
        toast.success('Clase actualizada correctamente');
        setIsSidebarOpen(false);
      } else {
        toast.error('Hubo un error al actualizar la clase');
      }
    } else {
      const success = await createClass(data);
      if (success) {
        toast.success('Clase creada correctamente');
        setIsSidebarOpen(false);
      } else {
        toast.error('Hubo un error al crear la clase');
      }
    }
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-200">Activa</span>;
    } else {
      return <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-full border border-gray-200">Inactiva</span>;
    }
  };

  const getClassIcon = (name: string) => {
    const n = name.toLowerCase();
    let bg = 'bg-blue-50 text-blue-600';
    if (n.includes('cross') || n.includes('fuerza')) {
      bg = 'bg-purple-50 text-purple-600';
    } else if (n.includes('weight') || n.includes('levantamiento')) {
      bg = 'bg-orange-50 text-orange-600';
    } else if (n.includes('hiit') || n.includes('cardio')) {
      bg = 'bg-emerald-50 text-emerald-600';
    } else if (n.includes('yoga') || n.includes('flex')) {
      bg = 'bg-sky-50 text-sky-600';
    } else if (n.includes('spin') || n.includes('bici')) {
      bg = 'bg-rose-50 text-rose-600';
    } else if (n.includes('core') || n.includes('abs')) {
      bg = 'bg-amber-50 text-amber-600';
    }
    return (
      <div className={`p-2.5 rounded-lg ${bg}`}>
        <Dumbbell className="w-4 h-4" />
      </div>
    );
  };

  const getClassSublabel = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cross')) return 'Entrenamiento funcional de alta intensidad';
    if (n.includes('weight')) return 'Levantamiento olímpico y técnica';
    if (n.includes('hiit')) return 'Entrenamiento interválico de alta intensidad';
    if (n.includes('yoga')) return 'Flexibilidad, respiración y bienestar';
    if (n.includes('spin')) return 'Ciclismo indoor de alta energía';
    if (n.includes('core')) return 'Fortalecimiento de zona media';
    return 'Sesión de entrenamiento dirigida';
  };

  // Filter local classes
  const filteredClasses = classes.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 px-1 py-2 sm:px-4 sm:py-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clases</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Gestiona tus clases, horarios y capacidad.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar clase..."
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
              <span>Nueva clase</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Table / Mobile list */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Cargando clases...</div>
          ) : filteredClasses.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">No se encontraron clases</div>
          ) : (
            <>
              {/* Mobile Card Grid (Visible on mobile/tablet, hidden on desktop) */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                {filteredClasses.map((classObj) => {
                  const coachName = typeof classObj.coach === 'object'
                    ? `${classObj.coach?.firstName} ${classObj.coach?.lastName}`
                    : 'Sin asignar';
                  
                  const coachImg = classObj.coach?.profileImage || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`;

                  const bookingsCount = Array.isArray(classObj.bookings) ? classObj.bookings.length : 0;
                  const capacity = classObj.capacity || 20;
                  const occupancy = Math.round((bookingsCount / capacity) * 100);

                  // Progress bar color logic
                  let barColor = 'bg-emerald-500';
                  if (occupancy < 50) {
                    barColor = 'bg-amber-500';
                  } else if (occupancy >= 90) {
                    barColor = 'bg-red-500';
                  } else if (occupancy >= 80) {
                    barColor = 'bg-emerald-500';
                  } else {
                    barColor = 'bg-amber-500';
                  }

                  const sortedDays = Array.isArray(classObj.weekDays)
                    ? [...classObj.weekDays].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
                    : [];

                  return (
                    <div key={classObj._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                      {/* Top Header Row of Card */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getClassIcon(classObj.name)}
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">{classObj.name}</span>
                            <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                              {getClassSublabel(classObj.name)}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(classObj.active)}
                      </div>

                      {/* Detail Grid */}
                      <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-3 text-xs">
                        <div>
                          <span className="text-gray-400 font-medium block mb-1">Horario</span>
                          <span className="text-gray-900 font-semibold">{classObj.startTime} - {classObj.endTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium block mb-1">Entrenador</span>
                          <div className="flex items-center gap-2">
                            <img src={coachImg} alt={coachName} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-gray-800 font-semibold">{coachName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Days section */}
                      <div>
                        <span className="text-gray-400 font-medium text-xs block mb-2">Días de la semana</span>
                        <div className="flex flex-wrap gap-1.5">
                          {sortedDays.map((day: string) => {
                            const label = reverseDayMapping[day] || day;
                            return (
                              <span key={day} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-semibold rounded-md">
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Occupancy and capacity progress */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                          <span>Ocupación: {occupancy}%</span>
                          <span className="text-gray-400 font-medium">({bookingsCount} / {capacity} reservas)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(occupancy, 100)}%` }} />
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-3">
                        <button onClick={() => handleOpenView(classObj)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                        <button onClick={() => handleOpenEdit(classObj)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors bg-white">
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button onClick={() => handleDeleteClick(classObj._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors bg-white">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table Layout (Visible on desktop, hidden on mobile) */}
              <table className="w-full text-left border-collapse hidden md:table">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-3">Clase</th>
                    <th className="px-6 py-3">Horario</th>
                    <th className="px-6 py-3">Días de la semana</th>
                    <th className="px-6 py-3">Coach</th>
                    <th className="px-6 py-3 text-center">Capacidad</th>
                    <th className="px-6 py-3 text-center">Reservas</th>
                    <th className="px-6 py-3">Ocupación</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredClasses.map((classObj) => {
                    const coachName = typeof classObj.coach === 'object'
                      ? `${classObj.coach?.firstName} ${classObj.coach?.lastName}`
                      : 'Sin asignar';
                    
                    const coachImg = classObj.coach?.profileImage || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`;

                    const bookingsCount = Array.isArray(classObj.bookings) ? classObj.bookings.length : 0;
                    const capacity = classObj.capacity || 20;
                    const occupancy = Math.round((bookingsCount / capacity) * 100);

                    // Progress bar color logic
                    let barColor = 'bg-emerald-500';
                    if (occupancy < 50) {
                      barColor = 'bg-amber-500';
                    } else if (occupancy >= 90) {
                      barColor = 'bg-red-500';
                    } else if (occupancy >= 80) {
                      barColor = 'bg-emerald-500';
                    } else {
                      barColor = 'bg-amber-500';
                    }

                    // Sort weekDays to display in order
                    const sortedDays = Array.isArray(classObj.weekDays)
                      ? [...classObj.weekDays].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
                      : [];

                    return (
                      <tr key={classObj._id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Name & Icon */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getClassIcon(classObj.name)}
                            <div>
                              <span className="font-semibold text-gray-900 block text-sm">{classObj.name}</span>
                              <span className="text-[11px] text-gray-400 font-medium block mt-0.5 max-w-[200px] truncate">
                                {getClassSublabel(classObj.name)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Horario */}
                        <td className="px-6 py-4">
                          <div className="text-gray-900 font-semibold text-xs leading-normal">
                            {classObj.startTime}
                            <span className="text-gray-400 font-medium block mt-0.5">{classObj.endTime}</span>
                          </div>
                        </td>

                        {/* Días */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {sortedDays.map((day: string) => {
                              const label = reverseDayMapping[day] || day;
                              return (
                                <span key={day} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-semibold rounded-md">
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Coach */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <img src={coachImg} alt={coachName} className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-semibold text-gray-700 text-xs">{coachName}</span>
                          </div>
                        </td>

                        {/* Capacidad */}
                        <td className="px-6 py-4 text-center text-xs font-semibold text-gray-900">{capacity}</td>

                        {/* Reservas */}
                        <td className="px-6 py-4 text-center text-xs font-semibold text-gray-900">{bookingsCount}</td>

                        {/* Ocupación */}
                        <td className="px-6 py-4">
                          <div className="w-24">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
                              <span>{occupancy}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${Math.min(occupancy, 100)}%` }} />
                            </div>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4">{getStatusBadge(classObj.active)}</td>

                        {/* Acciones */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleOpenView(classObj)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 bg-white">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleOpenEdit(classObj)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 bg-white">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteClick(classObj._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 bg-white">
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
          <span>{`Mostrando ${filteredClasses.length > 0 ? (page - 1) * 10 + 1 : 0} a ${Math.min(page * 10, totalDocs)} de ${totalDocs} clases`}</span>
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
      <CreateClassSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        classData={selectedClass}
        isViewOnly={isViewOnly}
      />
    </div>
  );
}
