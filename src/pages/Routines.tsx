import { useState } from 'react';
import { Search, Filter, Plus, Download, Eye, Edit2, MoreVertical, Dumbbell } from 'lucide-react';
import { ROUTINES_TEXTS, COMMON_TEXTS } from '@/constants/texts';
import { CreateRoutineSidebar } from '@/components/CreateRoutineSidebar';

export default function Routines() {
  const [routines, setRoutines] = useState([
    { id: 1, name: 'Fuerza e Hipertrofia', description: 'Rutina enfocada en desarrollo de fuerza y aumento de masa muscular.', student: 'Juan Pérez', studentImg: 'https://i.pravatar.cc/150?u=1', days: 5, period: '20/05/2024 - 20/07/2024', coach: 'Marcos Ruiz', status: 'Activa' },
    { id: 2, name: 'Quema de Grasa Avanzado', description: 'Entrenamientos de alta intensidad para pérdida de grasa.', student: 'Ana López', studentImg: 'https://i.pravatar.cc/150?u=2', days: 4, period: '15/05/2024 - 15/07/2024', coach: 'Sofía Gómez', status: 'Activa' },
    { id: 3, name: 'Resistencia Funcional', description: 'Mejora de resistencia cardiovascular y capacidad funcional.', student: 'Martín Ruiz', studentImg: 'https://i.pravatar.cc/150?u=3', days: 5, period: '10/05/2024 - 10/06/2024', coach: 'Juan Pérez', status: 'Activa' },
    { id: 4, name: 'Movilidad y Core', description: 'Rutina de movilidad, estabilidad y fortalecimiento del core.', student: 'Lucía Fernández', studentImg: 'https://i.pravatar.cc/150?u=4', days: 3, period: '01/05/2024 - 01/06/2024', coach: 'Sofía Gómez', status: 'Finalizada' },
    { id: 5, name: 'Fuerza Máxima', description: 'Entrenamiento enfocado en aumentar fuerza máxima en ejercicios principales.', student: 'Tomás Díaz', studentImg: 'https://i.pravatar.cc/150?u=5', days: 4, period: '28/04/2024 - 28/06/2024', coach: 'Marcos Ruiz', status: 'Activa' },
    { id: 6, name: 'Acondicionamiento General', description: 'Mejora general de condición física con entrenamientos variados.', student: 'Valentina Morales', studentImg: 'https://i.pravatar.cc/150?u=6', days: 4, period: '25/04/2024 - 25/06/2024', coach: 'Juan Pérez', status: 'Pausada' },
    { id: 7, name: 'Rehabilitación Hombro', description: 'Rutina específica para recuperación y fortalecimiento del hombro.', student: 'Nicolás Castro', studentImg: 'https://i.pravatar.cc/150?u=7', days: 3, period: '15/04/2024 - 15/05/2024', coach: 'Sofía Gómez', status: 'Activa' },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<any | null>(null);

  const handleOpenCreate = () => {
    setSelectedRoutine(null);
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (routine: any) => {
    setSelectedRoutine(routine);
    setIsSidebarOpen(true);
  };

  const handleSidebarSubmit = async (data: any, id?: string) => {
    if (id) {
      setRoutines(prev => prev.map(r => r.id.toString() === id.toString() ? { ...r, ...data } : r));
    } else {
      const newId = routines.length > 0 ? Math.max(...routines.map(r => r.id)) + 1 : 1;
      const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const endStr = data.endDate ? new Date(data.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Sin límite';
      const period = `${todayStr} - ${endStr}`;
      
      setRoutines(prev => [...prev, {
        id: newId,
        name: data.name,
        description: data.description,
        student: data.student,
        studentImg: data.studentImg || 'https://i.pravatar.cc/150?u=temp',
        days: data.days,
        period,
        coach: data.coach || 'Marcos Ruiz',
        status: data.status
      }]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa':
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-200">{status}</span>;
      case 'Finalizada':
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">{status}</span>;
      case 'Pausada':
        return <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full border border-orange-200">{status}</span>;
      default:
        return null;
    }
  };

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
              placeholder={ROUTINES_TEXTS.SEARCH_PLACEHOLDER}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
            <Filter className="w-4 h-4 text-gray-500" />
            {COMMON_TEXTS.BUTTON_FILTERS}
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0">
            <Plus className="w-4 h-4" />
            {ROUTINES_TEXTS.NEW_ROUTINE}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto">
              <option>Todos los estudiantes</option>
            </select>
            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-[10px] font-semibold text-gray-500 uppercase ml-1 mb-1">Estado</span>
              <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] w-full sm:w-auto">
                <option>Todos</option>
              </select>
            </div>
            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-[10px] font-semibold text-gray-500 uppercase ml-1 mb-1">Entrenador</span>
              <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] w-full sm:w-auto">
                <option>Todos</option>
              </select>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shrink-0 w-full xl:w-auto">
            <Download className="w-4 h-4 text-gray-500" />
            {COMMON_TEXTS.BUTTON_EXPORT}
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
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
              {routines.map((routine) => (
                <tr key={routine.id} className="hover:bg-gray-50/50 transition-colors">
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
                      <img src={routine.studentImg} alt={routine.student} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium text-gray-900">{routine.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium text-[13px]">{routine.days} días</td>
                  <td className="px-6 py-4 text-gray-600 text-xs whitespace-pre-wrap">{routine.period.replace(' - ', '\n- ')}</td>
                  <td className="px-6 py-4 text-gray-600 text-[13px]">{routine.coach}</td>
                  <td className="px-6 py-4">{getStatusBadge(routine.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenEdit(routine)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Mostrando 1 a 7 de 7 rutinas</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">&lt;</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">&gt;</button>
          </div>
        </div>
      </div>

      <CreateRoutineSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        routineData={selectedRoutine}
      />
    </div>
  );
}
