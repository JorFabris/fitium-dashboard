import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import MainLayout from './layouts/MainLayout';
import { ROUTES } from './routes/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<Login />} />
        
        {/* Rutas protegidas dentro del MainLayout */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          {/* Aquí irán las otras rutas */}
          <Route path={ROUTES.students} element={<Students />} />
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
