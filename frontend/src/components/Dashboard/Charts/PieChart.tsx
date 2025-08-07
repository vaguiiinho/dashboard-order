import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '@/components/UI/Card';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { ChartData } from '@/types';

interface PieChartProps {
  title: string;
  data?: ChartData[];
  isLoading?: boolean;
  error?: string;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
}

const defaultColors = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
];

const PieChart: React.FC<PieChartProps> = ({
  title,
  data = [],
  isLoading = false,
  error,
  height = 300,
  showLegend = true,
  colors = defaultColors,
}) => {
  const renderCustomizedLabel = (entry: any) => {
    const percentage = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return `${percentage}%`;
  };

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-white p-3 border border-secondary-200 rounded-lg shadow-lg">
          <p className="font-medium text-secondary-900">{data.name}</p>
          <p className="text-sm text-secondary-600">
            Quantidade: <span className="font-medium">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
      </Card.Header>
      <Card.Body>
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-red-500" style={{ height }}>
            <p>{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center text-secondary-500" style={{ height }}>
            <p>Nenhum dado disponível</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              )}
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default PieChart;
