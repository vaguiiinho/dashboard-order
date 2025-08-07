import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/services/auth.service';
import {
  User,
  LoginCredentials,
  AuthContextType,
} from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verifica se o usuário está autenticado
   */
  const checkAuth = async () => {
    setIsLoading(true);
    
    try {
      // Primeiro verifica se existe dados salvos localmente
      const savedUser = authService.getUserData();
      if (savedUser) {
        setUser(savedUser);
      }

      // Depois valida o token no servidor
      const validatedUser = await authService.validateToken();
      setUser(validatedUser);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza login do usuário
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      const authResponse = await authService.login(credentials);
      setUser(authResponse.user);
      
      // Redireciona para dashboard ou página anterior
      const redirectTo = (router.query.redirect as string) || '/dashboard';
      router.push(redirectTo);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza logout do usuário
   */
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  /**
   * Atualiza dados do usuário
   */
  const refreshUser = async () => {
    try {
      const updatedUser = await authService.refreshUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      // Em caso de erro, força logout
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

/**
 * Hook para verificar permissões
 */
export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isManager = (): boolean => {
    return hasRole('manager');
  };

  const isSupervisor = (): boolean => {
    return hasRole('supervisor');
  };

  const isManagerOrAdmin = (): boolean => {
    return hasAnyRole(['admin', 'manager']);
  };

  const canManageUsers = (): boolean => {
    return isAdmin();
  };

  const canManageOrders = (): boolean => {
    return hasAnyRole(['admin', 'manager', 'supervisor']);
  };

  const canViewDashboard = (): boolean => {
    return hasAnyRole(['admin', 'manager', 'supervisor']);
  };

  const canEditOrder = (order?: { created_by?: number; assigned_to?: number }): boolean => {
    if (isManagerOrAdmin()) return true;
    if (!order || !user) return false;
    
    // Usuário pode editar orders que criou ou que foram atribuídas a ele
    return order.created_by === user.id || order.assigned_to === user.id;
  };

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isSupervisor,
    isManagerOrAdmin,
    canManageUsers,
    canManageOrders,
    canViewDashboard,
    canEditOrder,
  };
}

export default AuthContext;
