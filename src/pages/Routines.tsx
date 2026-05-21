import { useState } from 'react';
import { Search, Plus, Download, Eye, Edit2, Trash2, Dumbbell } from 'lucide-react';
import { toast } from 'react-toastify';
import { ROUTINES_TEXTS } from '@/constants/texts';
import { CreateRoutineSidebar } from '@/components/CreateRoutineSidebar';
import { useRoutines } from '@/hooks/useRoutines';

export default function Routines() {
  const {
    routines,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    createRoutine,
    updateRoutine,
    deleteRoutine
  } = useRoutines();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<any | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleOpenCreate = () => {
    setSelectedRoutine(null);
    setIsViewOnly(false);
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (routine: any) => {
    setSelectedRoutine(routine);
    setIsViewOnly(false);
    setIsSidebarOpen(true);
  };

  const handleOpenView = (routine: any) => {
    setSelectedRoutine(routine);
    setIsViewOnly(true);
    setIsSidebarOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.')) {
      const success = await deleteRoutine(id);
      if (success) {
        toast.success('Rutina eliminada correctamente');
      } else {
        toast.error('Hubo un error al eliminar la rutina');
      }
    }
  };

  const handleSidebarSubmit = async (data: any, id?: string) => {
    if (id) {
      await updateRoutine(id, data);
    } else {
      await createRoutine(data);
    }
    setIsSidebarOpen(false);
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-200">Activa</span>;
    } else {
      return <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full border border-orange-200">Pausada</span>;
    }
  };

  // Filter routines locally by search query
  const filteredRoutines = routines.filter((routine) => {
    const nameMatch = routine.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatch = (routine.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    let studentMatch = false;
    if (routine.student) {
      if (typeof routine.student === 'object') {
        studentMatch = `${routine.student.firstName} ${routine.student.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      } else {
        studentMatch = routine.student.toLowerCase().includes(searchQuery.toLowerCase());
      }
    }

    return nameMatch || descriptionMatch || studentMatch;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{ROUTINES_TEXTS.TITLE}</h1>
          <p className="text-sm text-gray-500 mt-1">{ROUTINES_TEXTS.SUBTITLE}</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ROUTINES_TEXTS.SEARCH_PLACEHOLDER}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
            <Download className="w-4 h-4 text-gray-500" />
            <span>Exportar</span>
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0">
            <Plus className="w-4 h-4" />
            {ROUTINES_TEXTS.NEW_ROUTINE}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredRoutines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <Dumbbell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="font-semibold text-sm">No se encontraron rutinas</p>
              <p className="text-xs text-gray-400 mt-1">Intenta con otro término de búsqueda o crea una nueva rutina.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8F9FA] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{ROUTINES_TEXTS.TABLE_ROUTINE}</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{ROUTINES_TEXTS.TABLE_STUDENT}</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{ROUTINES_TEXTS.TABLE_DAYS}</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{ROUTINES_TEXTS.TABLE_PERIOD}</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{ROUTINES_TEXTS.TABLE_COACH}</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{ROUTINES_TEXTS.TABLE_STATUS}</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-xs text-center">{ROUTINES_TEXTS.TABLE_ACTIONS}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRoutines.map((routine) => {
                  const hasStudentObj = routine.student && typeof routine.student === 'object';
                  const studentName = hasStudentObj 
                    ? `${routine.student.firstName} ${routine.student.lastName}`
                    : (routine.student || 'Sin asignar');
                  const studentImg = hasStudentObj && routine.student.photo
                    ? routine.student.photo
                    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';

                  const daysCount = Array.isArray(routine.days) ? routine.days.length : 0;

                  const startStr = routine.startDate 
                    ? new Date(routine.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
                    : '';
                  const endStr = routine.endDate 
                    ? new Date(routine.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
                    : 'Sin límite';
                  const period = `${startStr} - ${endStr}`;

                  return (
                    <tr key={routine._id || routine.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Dumbbell className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{routine.name}</p>
                            <p className="text-xs text-gray-500 whitespace-normal min-w-[200px] max-w-[280px] leading-tight mt-0.5">{routine.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={studentImg} alt={studentName} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium text-gray-900">{studentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium text-[13px]">{daysCount} días</td>
                      <td className="px-6 py-4 text-gray-600 text-xs whitespace-pre-wrap">{period.replace(' - ', '\n- ')}</td>
                      <td className="px-6 py-4 text-gray-600 text-[13px]">{routine.createdBy || 'Marcos Ruiz'}</td>
                      <td className="px-6 py-4">{getStatusBadge(routine.active)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenView(routine)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(routine)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(routine._id || routine.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200">
                            <Trash2 className="w-4 h-4" />
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
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>{`Mostrando ${filteredRoutines.length > 0 ? (page - 1) * 10 + 1 : 0} a ${Math.min(page * 10, totalDocs)} de ${totalDocs} rutinas`}</span>
          <div className="flex items-center gap-1">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)} 
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              &lt;
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold">{page}</button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)} 
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      <CreateRoutineSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        routineData={selectedRoutine}
        isViewOnly={isViewOnly}
      />
    </div>
  );
}
