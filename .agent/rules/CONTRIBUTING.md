---
trigger: always_on
---

# Fitium Dashboard Rules - React JS

## 🚀 Reglas Obligatorias

### 1. Gestor de Paquetes

> [!IMPORTANT]
> SIEMPRE utilizar **PNPM** para instalar, actualizar o eliminar dependencias.

```bash
pnpm install
pnpm add package-name
pnpm remove package-name

❌ No usar npm
❌ No usar yarn

📁 Arquitectura del Proyecto
2. Estructura Base
src/
│
├── assets/
├── components/
├── constants/
├── features/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
├── types/
├── utils/
└── App.tsx
🧩 Componentización
3. Componentes
Mantener componentes pequeños y reutilizables.
Un componente = una responsabilidad.
Evitar componentes gigantes.
Si supera ~250 líneas, dividirlo.
Separar lógica y presentación.
4. Componentes reutilizables obligatorios

Crear componentes compartidos para:

Button
Input
Select
Card
Modal
Drawer
Table
Badge
EmptyState
Loader
Pagination
ConfirmDialog
PageHeader
🔷 TypeScript
5. Reglas de TypeScript
Usar TypeScript en toda la app.
Evitar any.
Tipar props, servicios, estados y respuestas.
Centralizar interfaces.

Ejemplo:

export interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
}
🎨 Diseño y Estilos
6. Paleta Oficial
export const COLORS = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  primary: '#0D6EFD',
  secondary: '#6C757D',
};
7. Reglas de estilos
No hardcodear colores.
No hardcodear tamaños repetidos.
Mantener spacing consistente.
Mantener border-radius consistente.
Mantener sombras suaves.
Usar diseño limpio y minimalista.
8. Estilo visual esperado

Inspiración visual:

Stripe
Linear
Notion
Supabase
Vercel
Clerk
🌎 Internacionalización y Textos
9. Textos centralizados y Obligatorios

> [!IMPORTANT]
> TODOS los textos visibles en la UI (títulos, botones, placeholders, mensajes de error, tooltips, opciones de menú, etc.) DEBEN estar obligatoriamente extraídos y definidos como constantes en el archivo `src/constants/texts.ts`. Está estrictamente prohibido hardcodear cadenas de texto directamente en los componentes de React o en las vistas (`.tsx`).

Estructura requerida:
- Crear o actualizar: `src/constants/texts.ts`
- Agrupar por vista/contexto (ej. `COMMON_TEXTS`, `LOGIN_TEXTS`, `STUDENTS_TEXTS`).

Ejemplo de uso:

```typescript
// src/constants/texts.ts
export const DASHBOARD_TEXTS = {
  TITLE: 'Dashboard',
  SUBTITLE: 'Resumen general del box',
  BUTTON_ADD_STUDENT: 'Agregar alumno',
};
```

```tsx
// src/pages/Dashboard.tsx
import { DASHBOARD_TEXTS } from '@/constants/texts';

<h1>{DASHBOARD_TEXTS.TITLE}</h1>
```
🌐 Axios y Servicios
10. Axios centralizado
src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
11. Servicios separados
services/
├── auth.service.ts
├── students.service.ts
├── classes.service.ts
├── payments.service.ts
12. Reglas de llamadas HTTP (Servicios)
Toda llamada a la API debe estar obligatoriamente centralizada en `src/services/{nombrePantalla}.service.ts`.
Cada endpoint debe ser una función independiente dentro del objeto o clase del servicio.
Usar siempre rutas relativas (ej. `/api/v1/users`) y NUNCA URLs absolutas (`http://localhost:5001/...`). El baseURL de Axios ya lo maneja.
Nunca consumir Axios directamente en componentes visuales ni en los hooks. Los hooks deben llamar a las funciones del servicio correspondiente.
Manejar errores de red correctamente.
Tipar parámetros de entrada y responses de salida.
🔔 Toasts
13. Toastify

Usar siempre react-toastify.

❌ No usar alert().

Ejemplo:

toast.success('Alumno creado correctamente');
toast.error('Ocurrió un error');
📋 Formularios
14. Reglas de formularios
Validar todos los campos.
Mostrar errores claros.
Deshabilitar submit mientras carga.
Evitar doble submit.
Mostrar feedback visual.
Limpiar formularios cuando corresponda.
📊 Dashboard
15. Home Dashboard

La home debe mostrar información útil para el dueño del box:

Ingresos mensuales
Gastos mensuales
Ganancia neta
Alumnos activos
Mensualidades vencidas
Clases del día
Reservas
Stock bajo
Alertas importantes
Top alumnos
KPIs generales
16. Widgets recomendados
Revenue chart
Attendance chart
Occupancy chart
Alerts panel
Quick actions
Upcoming classes
Payment summary
Student growth
📦 Estados de UI
17. Estados obligatorios

Cada pantalla debe contemplar:

Loading state
Error state
Empty state
Success state
Data state

Ejemplo:

if (isLoading) return <Loader />;
if (error) return <ErrorState />;
if (!data.length) return <EmptyState />;
📑 Tablas
18. Reglas para tablas
No mostrar campos innecesarios.
Priorizar legibilidad.
Usar badges para estados.
Agregar acciones claras.

Ejemplo:

Editar
Eliminar
Ver detalle
Activar/desactivar
🧠 Hooks
19. Lógica en Hooks (Separation of Concerns)

> [!IMPORTANT]
> Prohibido tener lógica compleja de negocio o llamadas a la API directamente dentro de las pantallas (pages) o componentes de presentación.
> TODA la lógica de estado, fetch de datos y funciones manejadoras (handlers) debe extraerse a un Custom Hook dedicado.

Ejemplo de estructura esperada:
```tsx
// ❌ INCORRECTO: Todo en el componente
const Login = () => {
  const [email, setEmail] = useState('');
  const handleLogin = async () => { /* ... */ };
  return <form onSubmit={handleLogin}>...</form>;
}

// ✅ CORRECTO: Lógica extraída
const Login = () => {
  const { email, setEmail, handleLogin } = useLogin();
  return <form onSubmit={handleLogin}>...</form>;
}
```

Estructura de hooks recomendada:
hooks/
├── useAuth.ts
├── useLogin.ts
├── useStudents.ts
├── useDebounce.ts
└── usePagination.ts
🛣️ Rutas
20. Centralización de rutas
src/routes/routes.ts
export const ROUTES = {
  home: '/',
  students: '/students',
  classes: '/classes',
  payments: '/payments',
  settings: '/settings',
};

❌ No hardcodear rutas.

🔐 Seguridad
21. Seguridad Frontend
No exponer secretos.
Validar roles.
Ocultar acciones sin permisos.
Manejar expiración de sesión.
Validar autenticación.
22. Roles
export type UserRole =
  | 'owner'
  | 'admin'
  | 'coach'
  | 'receptionist';
⚡ Performance
23. Optimización
Evitar renders innecesarios.
Usar paginación.
Usar lazy loading.
Debounce en búsquedas.
Memoización cuando tenga sentido.
Evitar traer data innecesaria.
🧹 Clean Code
24. Buenas prácticas
Nombres descriptivos.
Evitar lógica duplicada.
Evitar componentes gigantes.
Evitar nesting excesivo.
Evitar JSX complejo.
Mantener código legible.
🧪 Testing
25. Testing recomendado
Unit testing
Integration testing
Component testing

Herramientas sugeridas:

Jest
React Testing Library
📱 Responsive
26. Responsive obligatorio

El dashboard debe funcionar correctamente en:

Desktop
Tablet
Mobile
📈 Escalabilidad
27. Escalabilidad

El sistema debe estar preparado para:

Multi-box
Multi-roles
Multi-sucursal
Multi-coach
Feature flags
Internacionalización
🛑 Código prohibido
28. No permitido

❌ console.log en producción
❌ any innecesarios
❌ hardcodeo de textos
❌ hardcodeo de colores
❌ lógica HTTP en componentes
❌ componentes gigantes
❌ estilos inconsistentes
❌ duplicación de lógica
❌ rutas hardcodeadas

✅ Objetivo del Dashboard

Fitium debe sentirse:

Profesional
Moderno
Limpio
Minimalista
Escalable
Premium
Rápido
Intuitivo
SaaS de alta calidad