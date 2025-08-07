import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-card',
    lg: 'shadow-lg',
  };

  const classes = clsx(
    'bg-white rounded-lg border border-secondary-200',
    paddingClasses[padding],
    shadowClasses[shadow],
    hover && 'hover:shadow-card-hover transition-shadow duration-200',
    className
  );

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-4 border-b border-secondary-200', className)}>
      {children}
    </div>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-4', className)}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-lg', className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
