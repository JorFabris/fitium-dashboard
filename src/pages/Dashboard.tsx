import React, { useState, useEffect } from 'react';
import {
  DollarSign, Users, AlertTriangle, ChevronRight,
  TrendingUp, TrendingDown, Bell, Plus, Calendar as CalendarIcon,
  CreditCard, ShoppingCart, CalendarPlus, Trophy, Megaphone,
  ArrowRight, ShieldAlert, AlertCircle, AlertOctagon, Loader2
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
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency } from '@/utils/formatters';

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
    <path d="M2 18L15 12L25 16L40 6L58 14" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getAlertStyle = (type: string) => {
  switch (type) {
    case 'danger':
      return { bg: 'bg-red-50 border-red-100', iconBg: 'bg-red-100 text-red-600', icon: ShieldAlert };
    case 'warning':
      return { bg: 'bg-orange-50 border-orange-100', iconBg: 'bg-orange-100 text-orange-600', icon: AlertOctagon };
    case 'info':
    default:
      return { bg: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100 text-blue-600', icon: Bell };
  }
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const summary = await dashboardService.getSummary();
        setData(summary);
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold border border-red-100 bg-red-50 rounded-2xl max-w-xl mx-auto mt-12">
        Error al cargar los datos del dashboard. Por favor, intenta de nuevo más tarde.
      </div>
    );
  }

  const { stats, evolucionMensual, alertasImportantes, clasesDelDia, topAlumnos, resumenFinanciero } = data;

  const chartData = {
    labels: evolucionMensual?.labels || [],
    datasets: [
      {
        label: 'Ingresos',
        data: (evolucionMensual?.ingresos || []).map((v: number) => v / 1000000),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Alumnos activos',
        data: (evolucionMensual?.alumnosActivos || []).map((v: number) => v / 100),
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Asistencia (%)',
        data: (evolucionMensual?.asistencia || []).map((v: number) => v / 100),
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
          callback: function (value: any) {
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
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </button>
          <button className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <Bell className="w-5 h-5" />
            {alertasImportantes?.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white">
                {alertasImportantes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* KPI 1: Ingresos del mes */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Ingresos del mes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {formatCurrency(stats?.ingresosDelMes?.total || 0)}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className={`text-xs font-medium flex items-center gap-1 ${
              stats?.ingresosDelMes?.isPositive ? 'text-green-600' : 'text-red-500'
            }`}>
              {stats?.ingresosDelMes?.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(stats?.ingresosDelMes?.porcentaje || 0)}%{' '}
              <span className="text-gray-400 font-normal">vs mes anterior</span>
            </span>
            <SparklineBlue />
          </div>
        </div>

        {/* KPI 2: Alumnos activos */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Alumnos activos</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats?.alumnosActivos?.total || 0}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stats?.alumnosActivos?.nuevosEstaSemana || 0}{' '}
              <span className="text-gray-400 font-normal">nuevos esta semana</span>
            </span>
            <SparklineBlue />
          </div>
        </div>

        {/* KPI 3: Mensualidades vencidas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-red-50 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Mensualidades vencidas</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats?.mensualidadesVencidas || 0}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Requieren seguimiento</span>
            <SparklineBlue />
          </div>
        </div>

        {/* KPI 4: Clases de hoy */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Clases de hoy</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats?.clasesDeHoy || 0} clases</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Cronograma del día</span>
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
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Ingresos (en M)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> Alumnos (x100)
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
          </div>

          <div className="space-y-1">
            {alertasImportantes?.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-12">No hay alertas activas hoy.</p>
            ) : (
              alertasImportantes.map((alert: any, idx: number) => {
                const style = getAlertStyle(alert.type);
                const Icon = style.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${style.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{alert.message}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Classes, Top Students, Finance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Classes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">Clases del día</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-3 font-medium text-gray-500 w-16">Hora</th>
                  <th className="pb-3 font-medium text-gray-500">Clase</th>
                  <th className="pb-3 font-medium text-gray-500">Coach</th>
                  <th className="pb-3 font-medium text-gray-500 text-right">Reservas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clasesDelDia?.map((cls: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-gray-900">{cls.hora}</td>
                    <td className="py-3 text-gray-600">{cls.clase}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[9px] uppercase">
                          {cls.coach?.[0] || 'C'}
                        </div>
                        <span className="text-gray-900 text-xs font-medium">{cls.coach}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end">
                        <span className="text-xs font-bold text-gray-800">{cls.reservas}</span>
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
          </div>
          <div className="space-y-4">
            {topAlumnos?.map((s: any, idx: number) => {
              const rankColors = ['bg-yellow-400 text-white', 'bg-gray-300 text-white', 'bg-orange-400 text-white'];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                    rankColors[idx] || 'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {s.nombre?.[0] || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.nombre}</p>
                    <p className="text-xs text-gray-500">{s.clases} clases</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{s.asistencia}%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">asistencia</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Finance Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">Resumen financiero</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Ingresos Hoy */}
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500">Ingresos hoy</p>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  resumenFinanciero?.ingresosHoy?.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {resumenFinanciero?.ingresosHoy?.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">{formatCurrency(resumenFinanciero?.ingresosHoy?.total || 0)}</h4>
              <p className={`text-[10px] font-bold mt-1 ${
                resumenFinanciero?.ingresosHoy?.isPositive ? 'text-green-600' : 'text-red-500'
              }`}>
                {resumenFinanciero?.ingresosHoy?.isPositive ? '↑' : '↓'} {Math.abs(resumenFinanciero?.ingresosHoy?.porcentaje || 0)}% vs ayer
              </p>
            </div>

            {/* Gastos Hoy */}
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500">Gastos hoy</p>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  resumenFinanciero?.gastosHoy?.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {resumenFinanciero?.gastosHoy?.isPositive ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">{formatCurrency(resumenFinanciero?.gastosHoy?.total || 0)}</h4>
              <p className={`text-[10px] font-bold mt-1 ${
                resumenFinanciero?.gastosHoy?.isPositive ? 'text-green-600' : 'text-red-500'
              }`}>
                {resumenFinanciero?.gastosHoy?.isPositive ? '↓' : '↑'} {Math.abs(resumenFinanciero?.gastosHoy?.porcentaje || 0)}% vs ayer
              </p>
            </div>

            {/* Ganancia Neta */}
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500">Ganancia neta</p>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  resumenFinanciero?.gananciaNeta?.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {resumenFinanciero?.gananciaNeta?.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">{formatCurrency(resumenFinanciero?.gananciaNeta?.total || 0)}</h4>
              <p className={`text-[10px] font-bold mt-1 ${
                resumenFinanciero?.gananciaNeta?.isPositive ? 'text-green-600' : 'text-red-500'
              }`}>
                {resumenFinanciero?.gananciaNeta?.isPositive ? '↑' : '↓'} {Math.abs(resumenFinanciero?.gananciaNeta?.porcentaje || 0)}% vs ayer
              </p>
            </div>

            {/* Proyección Mensual */}
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-gray-500 leading-tight">Proyección mensual</p>
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5" /></div>
              </div>
              <h4 className="text-lg font-bold text-gray-900">{formatCurrency(resumenFinanciero?.proyeccionMensual || 0)}</h4>
              <p className="text-[10px] text-green-600 font-bold mt-1">↑ 10% vs mes anterior</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
