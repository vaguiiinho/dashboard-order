import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

// Componentes específicos para status e prioridades
interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  className?: string;
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    pending: { label: 'Pendente', variant: 'warning' as const },
    in_progress: { label: 'Em Andamento', variant: 'primary' as const },
    completed: { label: 'Concluída', variant: 'success' as const },
    cancelled: { label: 'Cancelada', variant: 'danger' as const },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const priorityConfig = {
    low: { label: 'Baixa', variant: 'secondary' as const },
    medium: { label: 'Média', variant: 'warning' as const },
    high: { label: 'Alta', variant: 'danger' as const },
    critical: { label: 'Crítica', variant: 'danger' as const },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;
