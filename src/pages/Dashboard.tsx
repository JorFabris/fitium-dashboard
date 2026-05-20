import React from 'react';
import { 
  DollarSign, Users, AlertTriangle, Calendar, ChevronRight,
  TrendingUp, TrendingDown, Bell, Plus, Calendar as CalendarIcon,
  CreditCard, ShoppingCart, CalendarPlus, Trophy, Megaphone,
  ArrowRight, ShieldAlert, AlertCircle, AlertOctagon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock SVG Sparklines
const SparklineBlue = () => (
  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18L15 12L25 16L40 6L58 14" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Dashboard: React.FC = () => {

  const todaysClasses = [
    { time: '07:00', name: 'CrossFit', coach: 'Juan Pérez', participants: 18, capacity: 20, img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
    { time: '09:00', name: 'Funcional', coach: 'Sofía Gómez', participants: 12, capacity: 15, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { time: '10:30', name: 'Gymnastics', coach: 'Marcos Ruiz', participants: 10, capacity: 12, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { time: '18:00', name: 'Weightlifting', coach: 'Marcos Ruiz', participants: 20, capacity: 20, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { time: '19:30', name: 'CrossFit', coach: 'Sofía Gómez', participants: 16, capacity: 20, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  ];

  const topStudents = [
    { rank: 1, name: 'Juan Pérez', classes: 24, attendance: '96%', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', color: 'bg-yellow-400' },
    { rank: 2, name: 'Ana López', classes: 22, attendance: '92%', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', color: 'bg-gray-300' },
    { rank: 3, name: 'Martín Ruiz', classes: 21, attendance: '88%', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', color: 'bg-orange-400' },
    { rank: 4, name: 'Lucía Fernández', classes: 20, attendance: '85%', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', color: 'bg-gray-100' },
    { rank: 5, name: 'Tomás Díaz', classes: 19, attendance: '84%', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', color: 'bg-gray-100' },
  ];

  const chartData = {
    labels: ['29 Abr', '6 May', '13 May', '20 May', '27 May'],
    datasets: [
      {
        label: 'Ingresos',
        data: [1.2, 1.5, 1.4, 2.0, 1.8],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Alumnos activos',
        data: [0.8, 1.0, 1.2, 1.1, 1.5],
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Asistencia (%)',
        data: [1.0, 0.9, 1.1, 1.3, 1.4],
        borderColor: '#6B7280',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 2.5,
        ticks: {
          callback: function(value: any) {
            return value === 0 ? '0' : value + 'M';
          },
          font: {
            size: 11,
          },
          color: '#9CA3AF'
        },
        grid: {
          color: '#F3F4F6',
        },
        border: {
          display: false,
          dash: [4, 4]
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#9CA3AF'
        },
        border: {
          display: false,
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bienvenido de nuevo, Jorge 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Aquí tienes el resumen de tu box hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            25 de mayo, 2024
          </button>
          <button className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Agregar alumno
          </button>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Ingresos del mes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">$1.850.000</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              12% <span className="text-gray-400 font-normal">vs mes anterior</span>
            </span>
            <SparklineBlue />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Alumnos activos</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">184</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              8 <span className="text-gray-400 font-normal">nuevos esta semana</span>
            </span>
            <SparklineBlue />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-red-50 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Mensualidades vencidas</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">17</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver pendientes <ArrowRight className="w-3 h-3" />
            </button>
            <SparklineBlue />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Clases de hoy</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">9 clases</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              134 reservas
            </span>
            <SparklineBlue />
          </div>
        </div>
      </div>

      {/* Middle Row: Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-gray-900">Evolución mensual</h3>
            <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 rounded-md">Semana</button>
              <button className="px-3 py-1 text-xs font-medium bg-white text-blue-600 shadow-sm rounded-md border border-gray-100">Mes</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 rounded-md">Año</button>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[240px] w-full mt-2">
             <Line data={chartData} options={chartOptions} />
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-50 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Ingresos
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> Alumnos activos
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Asistencia (%)
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Alertas importantes</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Ver todas</button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <div className="p-2 bg-red-50 rounded-lg text-red-500 shrink-0"><ShieldAlert className="w-5 h-5" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">17 mensualidades vencidas</p>
                <p className="text-xs text-gray-500">Total pendiente: $425.000</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-500 shrink-0"><AlertOctagon className="w-5 h-5" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">3 alumnos por vencer esta semana</p>
                <p className="text-xs text-gray-500">Requieren seguimiento</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 shrink-0"><AlertCircle className="w-5 h-5" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Stock bajo en proteínas</p>
                <p className="text-xs text-gray-500">Quedan 3 unidades</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500 shrink-0"><Bell className="w-5 h-5" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">2 clases con cupos completos</p>
                <p className="text-xs text-gray-500">Hoy: 18:00 y 19:00</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Classes, Top Students, Finance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Classes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">Clases del día</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Ver todas</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="pb-3 font-medium text-gray-500 w-16">Hora</th>
                  <th className="pb-3 font-medium text-gray-500">Clase</th>
                  <th className="pb-3 font-medium text-gray-500">Coach</th>
                  <th className="pb-3 font-medium text-gray-500 text-right">Reservas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todaysClasses.map((cls, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-gray-900">{cls.time}</td>
                    <td className="py-3 text-gray-600">{cls.name}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={cls.img} alt={cls.coach} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-gray-900 text-xs">{cls.coach}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-semibold text-gray-900">{cls.participants} <span className="text-gray-400 font-normal">/ {cls.capacity}</span></span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">Top alumnos del mes</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Ver ranking</button>
          </div>
          <div className="space-y-4">
            {topStudents.map((s) => (
              <div key={s.rank} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${s.color}`}>
                  {s.rank}
                </div>
                <img src={s.img} alt={s.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.classes} clases</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{s.attendance}</p>
                  <p className="text-[10px] text-gray-500 uppercase">asistencia</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finance Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">Resumen financiero</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Ver reporte</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500">Ingresos hoy</p>
                <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5" /></div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">$78.500</h4>
              <p className="text-[10px] text-green-600 font-medium mt-1">↑ 15% vs ayer</p>
            </div>
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500">Gastos hoy</p>
                <div className="w-6 h-6 rounded-md bg-gray-200 text-gray-600 flex items-center justify-center"><TrendingDown className="w-3.5 h-3.5" /></div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">$12.300</h4>
              <p className="text-[10px] text-red-500 font-medium mt-1">↓ 8% vs ayer</p>
            </div>
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500">Ganancia neta</p>
                <div className="w-6 h-6 rounded-md bg-green-100 text-green-600 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5" /></div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">$66.200</h4>
              <p className="text-[10px] text-green-600 font-medium mt-1">↑ 18% vs ayer</p>
            </div>
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500 leading-tight">Proyección mensual</p>
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5" /></div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">$2.120.000</h4>
              <p className="text-[10px] text-green-600 font-medium mt-1">↑ 10% vs mes anterior</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-4 px-2">Acciones rápidas</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0"><Plus className="w-4 h-4" /></div>
            Nuevo alumno
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><CreditCard className="w-4 h-4" /></div>
            Registrar pago
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><ShoppingCart className="w-4 h-4" /></div>
            Venta rápida
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><CalendarPlus className="w-4 h-4" /></div>
            Crear clase
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><Trophy className="w-4 h-4" /></div>
            Crear competencia
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><Megaphone className="w-4 h-4" /></div>
            Enviar anuncio
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
