import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/UI/Card';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { ChartData } from '@/types';

interface BarChartProps {
  title: string;
  data?: ChartData[];
  isLoading?: boolean;
  error?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  data = [],
  isLoading = false,
  error,
  height = 300,
  color = '#3B82F6',
  showGrid = true,
  showLegend = false,
}) => {
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
            <RechartsBarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />}
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickLine={{ stroke: '#CBD5E1' }}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickLine={{ stroke: '#CBD5E1' }}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <Tooltip content={renderTooltip} />
              {showLegend && <Legend />}
              <Bar
                dataKey="value"
                fill={color}
                radius={[4, 4, 0, 0]}
                name="Quantidade"
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default BarChart;
