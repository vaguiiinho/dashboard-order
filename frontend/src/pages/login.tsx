import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Redireciona se já está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await login(data);
      // O redirecionamento é feito automaticamente no contexto
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" text="Redirecionando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900">
            Faça login em sua conta
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Sistema de Gerenciamento de Ordens de Serviço
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-secondary-200">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`form-input ${errors.email ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="seu@email.com"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input pr-10 ${errors.password ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Sua senha"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-secondary-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-secondary-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            {/* Erro geral */}
            {error && (
              <div className="alert-danger">
                {error}
              </div>
            )}

            {/* Botão de login */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Links adicionais */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-500"
              onClick={() => {
                // TODO: Implementar recuperação de senha
                alert('Funcionalidade em desenvolvimento');
              }}
            >
              Esqueceu sua senha?
            </button>
          </div>
        </div>

        {/* Informações de demonstração */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-800 mb-2">
            Dados para demonstração:
          </h3>
          <div className="text-sm text-primary-700 space-y-1">
            <p><strong>Email:</strong> admin@dashboard.com</p>
            <p><strong>Senha:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
