import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Coaches from './pages/Coaches';
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
          <Route path={ROUTES.classes} element={<div className="p-8">Sección de Clases en construcción</div>} />
          <Route path={ROUTES.payments} element={<div className="p-8">Sección de Pagos en construcción</div>} />
          <Route path={ROUTES.settings} element={<div className="p-8">Sección de Configuración en construcción</div>} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;
