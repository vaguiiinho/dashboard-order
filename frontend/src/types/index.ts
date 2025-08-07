// Tipos gerais da aplicação

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'user';
  department?: string;
  city?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  manager_id?: number;
  manager?: User;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Structure {
  id: number;
  name: string;
  type?: string;
  location?: string;
  department_id?: number;
  department?: Department;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceOrder {
  id: number;
  external_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category_id?: number;
  category?: Category;
  department_id?: number;
  department?: Department;
  structure_id?: number;
  structure?: Structure;
  assigned_to?: number;
  assignee?: User;
  created_by?: number;
  creator?: User;
  city?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceOrderComment {
  id: number;
  service_order_id: number;
  user_id: number;
  user?: User;
  comment: string;
  is_internal: boolean;
  created_at: string;
}

export interface ServiceOrderAttachment {
  id: number;
  service_order_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by: number;
  uploader?: User;
  created_at: string;
}

// Tipos para autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  expires_in: number;
}

// Tipos para dashboard/gráficos
export interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  byCategory: ChartData[];
  byDepartment: ChartData[];
  byCity: ChartData[];
  byCollaborator: ChartData[];
  byStructure: ChartData[];
  byStatus: ChartData[];
  byPriority: ChartData[];
  monthlyTrend: TrendData[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface TrendData {
  month: string;
  total: number;
  completed: number;
  pending: number;
  in_progress: number;
}

// Tipos para filtros
export interface DashboardFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: number[];
  departments?: number[];
  cities?: string[];
  status?: string[];
  priority?: string[];
  assignees?: number[];
}

// Tipos para paginação
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para formulários
export interface CreateServiceOrderData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category_id?: number;
  department_id?: number;
  structure_id?: number;
  assigned_to?: number;
  city?: string;
  estimated_hours?: number;
}

export interface UpdateServiceOrderData extends Partial<CreateServiceOrderData> {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  actual_hours?: number;
  completion_date?: string;
}

// Tipos para API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Tipos para contextos
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Tipos para componentes
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Status e prioridades com labels
export const STATUS_LABELS = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
} as const;

export const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
} as const;

export const ROLE_LABELS = {
  admin: 'Administrador',
  manager: 'Gerente',
  supervisor: 'Supervisor',
  user: 'Usuário',
} as const;
