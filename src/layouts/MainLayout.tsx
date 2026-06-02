import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Calendar,
  ClipboardList,
  CreditCard,
  Receipt,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ROUTES } from '../routes/routes';
import isologo from '../assets/isologo.png';
import { EditUserSidebar } from '../components/EditUserSidebar';
import { usersService } from '../services/users.service';

const MainLayout: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) { }
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate(ROUTES.login);
  };

  const handleEditUserSubmit = async (data: any) => {
    if (!user?._id) return;
    try {
      const response = await usersService.update(user._id, data);

      // Update local state and localStorage with the returned updated user data
      // If the backend returns the user in response.user or similar, adjust this.
      // Assuming it returns the updated user object directly or we merge it.
      const updatedUser = { ...user, ...data };
      if (response && response.user) {
        Object.assign(updatedUser, response.user);
      }
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error al actualizar usuario', error);
      // You could add a toast notification here
      throw error; // Rethrow to let the sidebar handle the loading state
    }
  };

  const navItems = [
    { name: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
    { name: 'Alumnos', path: ROUTES.students, icon: Users },
    { name: 'Coaches', path: ROUTES.coaches, icon: UserSquare2 },
    { name: 'Clases', path: ROUTES.classes, icon: Calendar },
    { name: 'Rutinas', path: '/routines', icon: ClipboardList },
    // { name: 'Competencias', path: '/competitions', icon: Trophy },
    { name: 'Pagos', path: ROUTES.payments, icon: CreditCard },
    { name: 'Gastos', path: '/expenses', icon: Receipt },
    // { name: 'Productos', path: '/products', icon: Package },
    // { name: 'Reportes', path: '/reports', icon: FileBarChart },
    // { name: 'Configuración', path: ROUTES.settings, icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo area */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <img src={isologo} alt="Fitium Logo" className="h-8 lg:h-10 object-contain" />
          </div>
          <button
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
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
        <div className="p-4 border-t border-gray-100 flex flex-col gap-4 shrink-0 bg-white">
          {/* <div className="flex items-center justify-between px-2 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                <Building2 className="w-4 h-4 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight truncate">Fitium Box</p>
                <p className="text-xs text-gray-500 truncate">Cambiar box</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
          </div> */}

          <div
            className="flex items-center justify-between px-2 cursor-pointer group"
            onClick={() => setIsEditUserOpen(true)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
                alt={user ? `${user.firstName} ${user.lastName}` : "Usuario"}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'Cargando...'}
                </p>
                <p className="text-xs text-gray-500 capitalize truncate">{user?.role || 'User'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors shrink-0" title="Cerrar sesión">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <img src={isologo} alt="Fitium" className="h-8 object-contain" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>

      <EditUserSidebar
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        onSubmit={handleEditUserSubmit}
        userData={user}
      />
    </div>
  );
};

export default MainLayout;
