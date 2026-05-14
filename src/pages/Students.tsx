import React from 'react';
import { 
  Search, Bell, Plus, Users, UserPlus, Calendar, CalendarX2, 
  Filter, Download, Eye, Edit2, MoreVertical, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { useStudents } from '../hooks/useStudents';

const Students: React.FC = () => {
  const {
    students,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit
  } = useStudents();

  const kpis = [
    { 
      title: 'Estudiantes activos', 
      value: totalDocs.toString(), 
      change: '12%', 
      isPositive: true, 
      textBottom: 'vs mes anterior', 
      icon: Users, 
      iconBg: 'bg-blue-50', 
      iconColor: 'text-blue-600' 
    },
    { 
      title: 'Nuevos este mes', 
      value: '24', 
      change: '8%', 
      isPositive: true, 
      textBottom: 'vs mes anterior', 
      icon: UserPlus, 
      iconBg: 'bg-green-50', 
      iconColor: 'text-green-600' 
    },
    { 
      title: 'Por vencer esta semana', 
      value: '7', 
      actionText: 'Ver lista', 
      icon: Calendar, 
      iconBg: 'bg-yellow-50', 
      iconColor: 'text-yellow-600' 
    },
    { 
      title: 'Inactivos', 
      value: '16', 
      change: '4%', 
      isPositive: false, 
      textBottom: 'vs mes anterior', 
      icon: CalendarX2, 
      iconBg: 'bg-red-50', 
      iconColor: 'text-red-500' 
    },
  ];

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">Activo</span>;
    }
    return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">Inactivo</span>;
  };

  const getPlanColor = (plan: string) => {
    switch(plan) {
      case 'Premium': return 'text-blue-600';
      case 'Elite': return 'text-purple-600';
      case 'Básico': return 'text-orange-500';
      default: return 'text-gray-900';
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Estudiantes</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona todos los miembros de tu box.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar estudiante..." 
              className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 shadow-sm"
            />
          </div>
          <button className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Agregar estudiante
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${kpi.iconBg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-gray-500 leading-none">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2 leading-none">{kpi.value}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {kpi.actionText ? (
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  {kpi.actionText} <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <span className={`text-xs font-medium flex items-center gap-1 ${kpi.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.isPositive ? '↑' : '↓'} {kpi.change} <span className="text-gray-400 font-normal">{kpi.textBottom}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar por nombre, email o teléfono..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-gray-500 uppercase ml-1 mb-1">Estado</span>
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 relative min-w-[110px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                  <option>Todos</option>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-gray-500 uppercase ml-1 mb-1">Plan</span>
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 relative min-w-[110px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                  <option>Todos</option>
                  <option>Premium</option>
                  <option>Básico</option>
                </select>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-gray-500 uppercase ml-1 mb-1">Entrenador</span>
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 relative min-w-[110px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                  <option>Todos</option>
                  <option>Marcos Ruiz</option>
                  <option>Sofía Gómez</option>
                </select>
              </div>
            </div>

            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mt-5">
              <Filter className="w-4 h-4 text-gray-500" />
              Más filtros
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mt-5 lg:mt-0">
            <Download className="w-4 h-4 text-gray-500" />
            Exportar
          </button>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8F9FA] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Estudiante</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Contacto</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Plan</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Entrenador</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Estado</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">Próximo pago</th>
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
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-48 text-center text-gray-500">
                    No se encontraron estudiantes.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const enrollDate = new Date(student.enrollmentDate).toLocaleDateString('es-AR');
                  // Mock plan, coach, and payment info since they aren't on the schema directly yet
                  const planName = 'Básico'; 
                  const planFreq = 'Mensual';
                  const coachName = 'Marcos Ruiz';
                  const nextPayment = '25/05/2024';
                  const paymentAmt = '$45.000';
                  
                  return (
                    <tr key={student._id || student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.photo ? (
                            <img src={student.photo} alt={student.firstName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {student.firstName?.[0]}{student.lastName?.[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900">{student.firstName} {student.lastName}</p>
                            <p className="text-xs text-gray-500">Desde {enrollDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{student.email || 'Sin email'}</p>
                        <p className="text-xs text-gray-500">{student.phone || 'Sin teléfono'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-semibold ${getPlanColor(planName)}`}>{planName}</p>
                        <p className="text-xs text-gray-500">{planFreq}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-bold">
                            {coachName.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="text-gray-900">{coachName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(student.active)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{nextPayment}</p>
                        <p className="text-xs text-gray-500">{paymentAmt}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Mostrando {students.length > 0 ? (page - 1) * limit + 1 : 0} a {Math.min(page * limit, totalDocs)} de {totalDocs} estudiantes
          </p>
          <div className="flex items-center gap-1">
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

    </div>
  );
};

export default Students;
