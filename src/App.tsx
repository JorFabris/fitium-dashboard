import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Coaches from './pages/Coaches';
import Routines from './pages/Routines';
import Classes from './pages/Classes';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import MainLayout from './layouts/MainLayout';
import { ROUTES } from './routes/routes';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to={ROUTES.login} replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<PublicRoute><Login /></PublicRoute>} />
        
        {/* Rutas protegidas dentro del MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          {/* Aquí irán las otras rutas */}
          <Route path={ROUTES.students} element={<Students />} />
          <Route path={ROUTES.coaches} element={<Coaches />} />
          <Route path={ROUTES.routines} element={<Routines />} />
          <Route path={ROUTES.classes} element={<Classes />} />
          <Route path={ROUTES.payments} element={<Payments />} />
          <Route path={ROUTES.expenses} element={<Expenses />} />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;
