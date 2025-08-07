import React from 'react';
import { LucideIcon } from 'lucide-react';
import Card from '@/components/UI/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  description,
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50',
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      lightBg: 'bg-green-50',
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      lightBg: 'bg-yellow-50',
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      lightBg: 'bg-red-50',
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50',
    },
    gray: {
      bg: 'bg-gray-500',
      text: 'text-gray-600',
      lightBg: 'bg-gray-50',
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colors.lightBg}`}>
            <Icon className={`h-6 w-6 ${colors.text}`} />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-secondary-600">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-secondary-900">
                {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
              </p>
              {trend && (
                <span
                  className={`ml-2 text-sm font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-secondary-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
