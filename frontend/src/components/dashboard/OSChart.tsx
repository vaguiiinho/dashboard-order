'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

interface ChartDataItem {
  name: string;
  value: number;
  id: string;
}

interface OSPieChartProps {
  data: ChartDataItem[];
  title: string;
  loading?: boolean;
}

interface OSBarChartProps {
  data: ChartDataItem[];
  title: string;
  loading?: boolean;
}

interface OSCardProps {
  title: string;
  value: number;
  loading?: boolean;
  icon?: React.ReactNode;
}

// Componente de Loading
function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}

// Custom Legend Component para melhor formatação
function CustomLegend({ payload }: any) {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5 text-xs min-w-0">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: entry.color }}
          />
          <span 
            className="text-gray-700 font-medium truncate-with-tooltip max-w-[140px]" 
            title={entry.value}
          >
            {entry.value}
          </span>
          <span className="text-gray-500 font-normal whitespace-nowrap">
            ({entry.payload?.value || 0})
          </span>
        </div>
      ))}
    </div>
  );
}

// Gráfico de Pizza
export function OSPieChart({ data, title, loading = false }: OSPieChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <ChartSkeleton />
      </div>
    );
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Não mostra label se menor que 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={11}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-900 break-words">{data.name}</p>
          <p className="text-blue-600">
            Quantidade: <span className="font-bold">{data.value}</span>
          </p>
          <p className="text-gray-600">
            Percentual: <span className="font-bold">{((data.value / data.payload.total) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className="bg-white p-4 rounded-lg shadow chart-card pie-chart-container">
      <h3 className="text-lg font-medium text-gray-900 mb-3 text-center">{title}</h3>
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 min-h-[300px]">
          Nenhum dado encontrado para o período selecionado
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Container principal com gráfico e legenda lado a lado */}
          <div className="flex items-center justify-between gap-4 min-h-[280px]">
            {/* Container do gráfico */}
            <div className="flex-1 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={dataWithTotal}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={renderTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legenda à direita */}
            <div className="w-1/3 flex flex-col justify-center">
              <div className="space-y-2">
                {dataWithTotal.map((item, index) => (
                  <div key={`legend-${index}`} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-sm flex-shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <span 
                        className="text-gray-700 font-medium block truncate" 
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="text-gray-500 font-normal">
                        ({item.value})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Gráfico de Barras
export function OSBarChart({ data, title, loading = false }: OSBarChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <ChartSkeleton />
      </div>
    );
  }

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-900 break-words">{label}</p>
          <p className="text-blue-600">
            Quantidade: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Ordenar dados por valor decrescente e adicionar cores
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const dataWithColors = sortedData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow chart-card bar-chart-container">
      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">{title}</h3>
      {data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          Nenhum dado encontrado para o período selecionado
        </div>
      ) : (
        <div className="flex-1">
          {/* Container do gráfico sem labels no eixo X */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={dataWithColors} 
                margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                maxBarSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  tick={false}
                  axisLine={false}
                  height={20}
                />
                <YAxis 
                  fontSize={12}
                  stroke="#6B7280"
                  tickFormatter={(value) => value.toString()}
                />
                <Tooltip content={renderTooltip} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {dataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legenda sempre visível com cores correspondentes */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Referência:</p>
            <div className="reference-grid">
              {dataWithColors.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-gray-700 truncate-with-tooltip" title={item.name}>
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Card de Estatísticas
export function OSCard({ title, value, loading = false, icon }: OSCardProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        {icon && (
          <div className="flex-shrink-0 mr-4">
            <div className="w-8 h-8 text-blue-600">
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </h3>
          {/* Guard locale-dependent formatting to avoid SSR/client mismatch */}
          <p className="mt-2 text-3xl font-bold text-gray-900" suppressHydrationWarning>
            {typeof window === 'undefined' ? value : Number(value).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}
