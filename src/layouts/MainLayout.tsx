import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Calendar,
  ClipboardList,
  Trophy,
  CreditCard,
  Receipt,
  Package,
  FileBarChart,
  Settings,
  Building2,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { ROUTES } from '../routes/routes';
import isologo from '../assets/isologo.png';

const MainLayout: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch(e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate(ROUTES.login);
  };
  const navItems = [
    { name: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
    { name: 'Alumnos', path: ROUTES.students, icon: Users },
    { name: 'Coaches', path: '/coaches', icon: UserSquare2 },
    { name: 'Clases', path: ROUTES.classes, icon: Calendar },
    { name: 'Rutinas', path: '/routines', icon: ClipboardList },
    { name: 'Competencias', path: '/competitions', icon: Trophy },
    { name: 'Pagos', path: ROUTES.payments, icon: CreditCard },
    { name: 'Gastos', path: '/expenses', icon: Receipt },
    { name: 'Productos', path: '/products', icon: Package },
    { name: 'Reportes', path: '/reports', icon: FileBarChart },
    { name: 'Configuración', path: ROUTES.settings, icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all">
        {/* Logo area */}
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-2">
            <img src={isologo} alt="Fitium Logo" className="h-15 object-contain" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section: Box & User */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <Building2 className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">Fitium Box</p>
                <p className="text-xs text-gray-500">Cambiar box</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </div>

          <div className="flex items-center justify-between px-2 cursor-pointer group">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
                alt={user ? `${user.firstName} ${user.lastName}` : "Usuario"}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {user ? `${user.firstName} ${user.lastName}` : 'Cargando...'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors" title="Cerrar sesión">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
