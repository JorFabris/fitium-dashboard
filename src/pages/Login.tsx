import React from 'react';
import { Mail, Lock, Eye, EyeOff, Activity, Loader2, KeyRound } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import logo from '../assets/logo.png';
import { LOGIN_TEXTS } from '../constants/texts';
import { usersService } from '../services/users.service';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin
  } = useLogin();

  const [recoveryStep, setRecoveryStep] = React.useState<0 | 1 | 2>(0); // 0: Login, 1: Email, 2: Code & Reset
  const [recoveringEmail, setRecoveringEmail] = React.useState('');
  const [recoveryCode, setRecoveryCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [recoverLoading, setRecoverLoading] = React.useState(false);

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveringEmail) return;
    setRecoverLoading(true);
    try {
      const response = await usersService.recoverPassword(recoveringEmail);
      toast.success(response.message || 'Código enviado si el correo es válido.');
      setRecoveryStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al intentar recuperar la contraseña.');
    } finally {
      setRecoverLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCode || !newPassword) return;
    setRecoverLoading(true);
    try {
      const response = await usersService.resetPassword(recoveringEmail, recoveryCode, newPassword);
      toast.success(response.message || 'Contraseña actualizada exitosamente.');
      setRecoveryStep(0);
      setRecoveryCode('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Código inválido o expirado.');
    } finally {
      setRecoverLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Sidebar - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white text-gray-900 flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-white/95" />

        {/* Top Logo Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 space-y-4">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Fitium Logo" className="w-40 mb-2 object-contain" />
            <div className="flex items-center gap-4 mt-4">
              <div className="h-px bg-blue-600 w-16" />
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-gray-600 whitespace-nowrap">
                {LOGIN_TEXTS.BRAND_SUBTITLE}
              </p>
              <div className="h-px bg-blue-600 w-16" />
            </div>
          </div>
        </div>

        {/* Bottom Feature Callout */}
        <div className="relative z-10 mb-8 mt-auto max-w-md mx-auto w-full">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-blue-100/40 rounded-xl border border-blue-200/50 backdrop-blur-sm shrink-0">
              <Activity className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
                {LOGIN_TEXTS.FEATURE_TITLE_1}<br />{LOGIN_TEXTS.FEATURE_TITLE_2}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {LOGIN_TEXTS.FEATURE_DESC}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-500 text-center">
          {LOGIN_TEXTS.COPYRIGHT}
        </div>
      </div>

      {/* Right Content - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#FAFAFA]">
        <div className="w-full max-w-md space-y-8">

          {recoveryStep === 1 ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Recuperar contraseña</h2>
                <p className="text-sm text-gray-500">
                  Ingresa tu correo y te enviaremos un código.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleRecoverPassword}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      {LOGIN_TEXTS.LABEL_EMAIL}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" strokeWidth={2} />
                      </div>
                      <input
                        type="email"
                        value={recoveringEmail}
                        onChange={(e) => setRecoveringEmail(e.target.value)}
                        className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder={LOGIN_TEXTS.PLACEHOLDER_EMAIL}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={recoverLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#0066FF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {recoverLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar código'}
                </button>

                <div className="flex items-center justify-center">
                  <button 
                    type="button" 
                    onClick={() => setRecoveryStep(0)} 
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </form>
            </>
          ) : recoveryStep === 2 ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Verificar código</h2>
                <p className="text-sm text-gray-500">
                  Hemos enviado un código de 6 dígitos a <br/> <span className="font-semibold text-gray-700">{recoveringEmail}</span>
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Código de recuperación
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" strokeWidth={2} />
                      </div>
                      <input
                        type="text"
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value)}
                        className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-sm font-mono tracking-widest bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-center"
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" strokeWidth={2} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder="Ingresa tu nueva contraseña"
                        required
                        minLength={6}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" strokeWidth={2} />
                          ) : (
                            <Eye className="h-5 w-5" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={recoverLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#0066FF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {recoverLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cambiar contraseña'}
                </button>

                <div className="flex items-center justify-center">
                  <button 
                    type="button" 
                    onClick={() => setRecoveryStep(0)} 
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{LOGIN_TEXTS.FORM_TITLE}</h2>
                <p className="text-sm text-gray-500">
                  {LOGIN_TEXTS.FORM_SUBTITLE}
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      {LOGIN_TEXTS.LABEL_EMAIL}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" strokeWidth={2} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder={LOGIN_TEXTS.PLACEHOLDER_EMAIL}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      {LOGIN_TEXTS.LABEL_PASSWORD}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" strokeWidth={2} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder={LOGIN_TEXTS.PLACEHOLDER_PASSWORD}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" strokeWidth={2} />
                          ) : (
                            <Eye className="h-5 w-5" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                    {error}
                  </div>
                )}

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <button type="button" onClick={() => setRecoveryStep(1)} className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    {LOGIN_TEXTS.LINK_FORGOT_PASSWORD}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#0066FF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : LOGIN_TEXTS.BTN_SUBMIT}
                </button>
              </form>
            </>
          )}

          {/* Divider */}
          {/* <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#FAFAFA] text-gray-500 font-medium">
                  {LOGIN_TEXTS.DIVIDER_TEXT}
                </span>
              </div>
            </div> */}

          {/* Google Login */}
          {/* <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {LOGIN_TEXTS.BTN_GOOGLE}
            </button> */}

          {/* Footer */}
          <div className="pt-2 text-center">
            <p className="text-sm text-gray-600 font-medium">
              {LOGIN_TEXTS.FOOTER_TEXT}{' '}
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                {LOGIN_TEXTS.FOOTER_LINK}
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
