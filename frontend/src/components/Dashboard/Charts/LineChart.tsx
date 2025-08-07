import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/UI/Card';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { TrendData } from '@/types';

interface LineChartProps {
  title: string;
  data?: TrendData[];
  isLoading?: boolean;
  error?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  data = [],
  isLoading = false,
  error,
  height = 300,
  showGrid = true,
  showLegend = true,
}) => {
  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-white p-3 border border-secondary-200 rounded-lg shadow-lg">
          <p className="font-medium text-secondary-900 mb-2">{data.month}</p>
          {props.payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-secondary-600">
              <span style={{ color: entry.color }}>●</span> {entry.name}: {' '}
              <span className="font-medium">{entry.value}</span>
            </p>
          ))}
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
            <RechartsLineChart
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
                dataKey="month"
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
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                name="Total"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                name="Concluídas"
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                name="Pendentes"
              />
              <Line
                type="monotone"
                dataKey="in_progress"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                name="Em Andamento"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default LineChart;
