import React, { useState, useEffect } from 'react';
import {
  Plus, Bell, FileText, AlertTriangle, ChevronRight, Loader2
} from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { DASHBOARD_TEXTS } from '@/constants/texts';

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
      <div className="h-[75vh] w-full flex items-center justify-center bg-[#F8F9FA] -m-4 md:-m-8">
        <Loader2 className="w-10 h-10 text-[#007AFF] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#F8F9FA] text-gray-900 p-6 md:p-8 -m-4 md:-m-8 min-h-[calc(100vh-4rem)] lg:min-h-screen flex items-center justify-center">
        <div className="p-8 text-center text-[#FF3B30] font-semibold border border-[#FF3B30]/20 bg-[#FF3B30]/5 rounded-2xl max-w-xl mx-auto">
          {DASHBOARD_TEXTS.ERROR_LOADING}
        </div>
      </div>
    );
  }

  const { header, kpis, alertasHoy, clasesHoy, alumnosRiesgo, altasBajas, ocupacionPromedio } = data;

  const getClassOccupancyStyle = (percentage: number) => {
    if (percentage >= 75) {
      return {
        barFill: 'bg-[#34C759]',
        textClass: 'text-[#34C759]'
      };
    } else if (percentage >= 40) {
      return {
        barFill: 'bg-[#FF9500]',
        textClass: 'text-[#FF9500]'
      };
    } else {
      return {
        barFill: 'bg-[#FF3B30]',
        textClass: 'text-[#FF3B30]'
      };
    }
  };

  const getRiskColors = (color: string) => {
    switch (color) {
      case 'red':
        return {
          avatarBg: 'bg-[#FF3B30]/10 text-[#FF3B30]',
          badgeBg: 'bg-[#FF3B30]/10 text-[#FF3B30]'
        };
      case 'orange':
        return {
          avatarBg: 'bg-[#FF9500]/10 text-[#FF9500]',
          badgeBg: 'bg-[#FF9500]/10 text-[#FF9500]'
        };
      case 'blue':
      default:
        return {
          avatarBg: 'bg-[#007AFF]/10 text-[#007AFF]',
          badgeBg: 'bg-[#007AFF]/10 text-[#007AFF]'
        };
    }
  };

  return (
    <div className="bg-[#F8F9FA] text-gray-900 p-6 md:p-8 -m-4 md:-m-8 min-h-[calc(100vh-4rem)] lg:min-h-screen font-sans flex flex-col gap-6">

      {/* Main Header Row */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{header.gymName} — Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {header.dateText} <span className="text-gray-300 mx-1.5">·</span> {DASHBOARD_TEXTS.LAST_ACCESS} {header.lastAccess}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 shadow-sm transition-colors">
            <Bell className="w-4 h-4 text-gray-400" />
            <span className="bg-[#FF3B30] text-white font-extrabold px-1.5 py-0.5 rounded text-[10px]">3</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 shadow-sm transition-colors">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>{DASHBOARD_TEXTS.BTN_REPORTS}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 shadow-sm transition-colors">
            <Plus className="w-4 h-4 text-gray-400" />
            <span>{DASHBOARD_TEXTS.BTN_NEW_STUDENT}</span>
          </button>
        </div>
      </div> */}

      {/* Métricas Clave Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{DASHBOARD_TEXTS.METRICS_TITLE}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Alumnos Activos */}
          <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{DASHBOARD_TEXTS.KPIS.ACTIVE_STUDENTS}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1.5">{kpis.alumnosActivos.value}</h3>
            </div>
            <div className="mt-4">
              <span className="text-xs font-bold text-[#34C759] flex items-center gap-1">
                ↗ {kpis.alumnosActivos.changeText}
              </span>
            </div>
          </div>

          {/* Card 2: Ingresos del Mes */}
          <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{DASHBOARD_TEXTS.KPIS.MONTHLY_INCOME}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1.5">{kpis.ingresosMes.valueText}</h3>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#34C759] rounded-full"
                  style={{ width: `${kpis.ingresosMes.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 font-semibold">{kpis.ingresosMes.metaText}</p>
            </div>
          </div>

          {/* Card 3: Retención Mensual */}
          <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{DASHBOARD_TEXTS.KPIS.MONTHLY_RETENTION}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1.5">{kpis.retencionMensual.valueText}</h3>
            </div>
            <div className="mt-4">
              <span className={`text-xs font-bold flex items-center gap-1 ${kpis.retencionMensual.isPositive ? 'text-[#34C759]' : 'text-[#FF3B30]'
                }`}>
                {kpis.retencionMensual.isPositive ? '↗' : '↘'} {kpis.retencionMensual.changeText}
              </span>
            </div>
          </div>

          {/* Card 4: Pagos Pendientes */}
          <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{DASHBOARD_TEXTS.KPIS.PENDING_PAYMENTS}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1.5">{kpis.pagosPendientes.valueText}</h3>
            </div>
            <div className="mt-4">
              <span className="text-xs font-bold text-[#FF3B30] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 fill-[#FF3B30]/5 text-[#FF3B30]" />
                {kpis.pagosPendientes.warningText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      {/* <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{DASHBOARD_TEXTS.QUICK_ACTIONS_TITLE}</h4>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-semibold shadow-sm transition-all cursor-pointer">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span>{DASHBOARD_TEXTS.ACTIONS.REGISTER_PAYMENT}</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-semibold shadow-sm transition-all cursor-pointer">
            <CheckSquare className="w-4 h-4 text-gray-400" />
            <span>{DASHBOARD_TEXTS.ACTIONS.MANUAL_CHECKIN}</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-semibold shadow-sm transition-all cursor-pointer">
            <Send className="w-4 h-4 text-gray-400" />
            <span>{DASHBOARD_TEXTS.ACTIONS.MESSAGE_INACTIVE}</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-semibold shadow-sm transition-all cursor-pointer">
            <Plus className="w-4 h-4 text-gray-400" />
            <span>{DASHBOARD_TEXTS.ACTIONS.NEW_CLASS}</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-semibold shadow-sm transition-all cursor-pointer">
            <Download className="w-4 h-4 text-gray-400" />
            <span>{DASHBOARD_TEXTS.ACTIONS.EXPORT_COLLECTIONS}</span>
          </button>
        </div>
      </div> */}

      {/* Middle Grid: Alertas de hoy & Clases de hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Card: Alertas de Hoy */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">{DASHBOARD_TEXTS.WIDGETS.TODAYS_ALERTS}</h3>
              <a href="#" className="text-sm font-semibold text-[#007AFF] hover:underline flex items-center gap-1 transition-colors">
                {DASHBOARD_TEXTS.LINKS.VIEW_ALL} <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              {alertasHoy.length > 0 ? (
                alertasHoy.map((alert: any) => (
                  <div key={alert.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.type === 'danger' ? 'bg-[#FF3B30]' : alert.type === 'warning' ? 'bg-[#FF9500]' : 'bg-[#34C759]'
                      }`} />
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-gray-900 leading-normal">{alert.message}</p>
                      <p className="text-xs text-gray-400 font-semibold">{alert.subtext}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                  <span className="text-3xl mb-2">✨</span>
                  <p className="text-sm font-semibold text-gray-900">{DASHBOARD_TEXTS.EMPTY_STATES.ALERTS_TITLE}</p>
                  <p className="text-xs text-gray-400 mt-1">{DASHBOARD_TEXTS.EMPTY_STATES.ALERTS_DESC}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card: Clases de Hoy */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">{DASHBOARD_TEXTS.WIDGETS.TODAYS_CLASSES}</h3>
              <a href="#" className="text-sm font-semibold text-[#007AFF] hover:underline flex items-center gap-1 transition-colors">
                {DASHBOARD_TEXTS.LINKS.VIEW_WEEK} <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              {clasesHoy.length > 0 ? (
                clasesHoy.map((cls: any) => {
                  const style = getClassOccupancyStyle(cls.percentage);
                  return (
                    <div key={cls.id} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-400 w-10 shrink-0">{cls.time}</span>
                        <span className="text-sm font-semibold text-gray-950 truncate max-w-[120px] md:max-w-[200px]">{cls.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="h-1.5 w-24 md:w-32 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${style.barFill}`}
                            style={{ width: `${cls.percentage}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-12 text-right ${style.textClass}`}>
                          {cls.bookings}/{cls.capacity}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                  <span className="text-3xl mb-2">🗓️</span>
                  <p className="text-sm font-semibold text-gray-900">{DASHBOARD_TEXTS.EMPTY_STATES.CLASSES_TITLE}</p>
                  <p className="text-xs text-gray-400 mt-1">{DASHBOARD_TEXTS.EMPTY_STATES.CLASSES_DESC}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Alumnos en riesgo, Altas y bajas, Ocupación promedio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Card 1: Alumnos en riesgo */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">{DASHBOARD_TEXTS.WIDGETS.RISK_STUDENTS}</h3>
              <a href="#" className="text-sm font-semibold text-[#007AFF] hover:underline flex items-center gap-1 transition-colors">
                {DASHBOARD_TEXTS.LINKS.VIEW_ALL_PLURAL} <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3.5">
              {alumnosRiesgo.length > 0 ? (
                alumnosRiesgo.map((student: any) => {
                  const colors = getRiskColors(student.color);
                  return (
                    <div key={student.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${colors.avatarBg}`}>
                          {student.initials}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 truncate">{student.name}</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${colors.badgeBg}`}>
                        {student.days} {DASHBOARD_TEXTS.RISK.DAYS}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                  <span className="text-3xl mb-2">💪</span>
                  <p className="text-sm font-semibold text-gray-900">{DASHBOARD_TEXTS.EMPTY_STATES.RISK_TITLE}</p>
                  <p className="text-xs text-gray-400 mt-1">{DASHBOARD_TEXTS.EMPTY_STATES.RISK_DESC}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Altas y bajas del mes */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">{DASHBOARD_TEXTS.WIDGETS.GROWTH_CHURN}</h3>
            </div>

            <div className="divide-y divide-gray-100 text-sm">
              <div className="flex items-center justify-between py-3.5 first:pt-0">
                <span className="text-gray-500 font-semibold">{DASHBOARD_TEXTS.GROWTH.NEW_STUDENTS}</span>
                <span className="font-bold text-gray-900">+{altasBajas.nuevosAlumnos}</span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="text-gray-500 font-semibold">{DASHBOARD_TEXTS.GROWTH.CONFIRMED_CHURN}</span>
                <span className="font-bold text-gray-900">{altasBajas.bajasConfirmadas}</span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="text-gray-500 font-semibold">{DASHBOARD_TEXTS.GROWTH.NET_GROWTH}</span>
                <span className="font-bold text-gray-900">+{altasBajas.crecimientoNeto}</span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="text-gray-500 font-semibold">{DASHBOARD_TEXTS.GROWTH.EXPIRING_CONTRACTS}</span>
                <span className="font-bold text-[#FF9500]">{altasBajas.contratosVencer}</span>
              </div>
              <div className="flex items-center justify-between py-3.5 last:pb-0">
                <span className="text-gray-500 font-semibold">{DASHBOARD_TEXTS.GROWTH.AVERAGE_TICKET}</span>
                <span className="font-bold text-gray-900">${altasBajas.ticketPromedio.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-center mt-5">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div> */}
        </div>

        {/* Card 3: Ocupación promedio / clase */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">{DASHBOARD_TEXTS.WIDGETS.AVERAGE_OCCUPANCY}</h3>
            </div>

            <div className="divide-y divide-gray-100 text-sm">
              {ocupacionPromedio.length > 0 ? (
                ocupacionPromedio.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <span className="text-gray-500 font-semibold">{item.className}</span>
                    <span className={`font-bold flex items-center gap-1 ${item.warning ? 'text-[#FF9500]' : 'text-gray-900'}`}>
                      {item.percentage}% {item.warning && '⚠️'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                  <span className="text-3xl mb-2">📊</span>
                  <p className="text-sm font-semibold text-gray-900">{DASHBOARD_TEXTS.EMPTY_STATES.OCCUPANCY_TITLE}</p>
                  <p className="text-xs text-gray-400 mt-1">{DASHBOARD_TEXTS.EMPTY_STATES.OCCUPANCY_DESC}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
