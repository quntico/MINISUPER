
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/core/contexts/AuthContext.jsx';
import { useCompany } from '@/modules/core/contexts/CompanyContext.jsx';
import { useBranch } from '@/modules/core/contexts/BranchContext.jsx';
import pb from '@/lib/pocketbase.js';
import { 
  TrendingUp, 
  Receipt, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  AlertCircle,
  Boxes,
  CreditCard
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { company, isLoading: companyLoading } = useCompany();
  const { branch, isLoading: branchLoading } = useBranch();

  const [stats, setStats] = useState({
    salesToday: 0,
    ticketsToday: 0,
    avgTicket: 0,
    productsSold: 0,
    totalProducts: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!company) {
        setIsLoadingStats(false);
        return;
      }

      setIsLoadingStats(true);
      setError(null);

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().replace('T', ' ').substring(0, 19);

        let baseFilter = `company_id = "${company.id}" && created >= "${todayStr}"`;
        if (branch) {
          baseFilter += ` && branch_id = "${branch.id}"`;
        }

        // Fetch sales
        const salesData = await pb.collection('sales').getFullList({
          filter: baseFilter,
          $autoCancel: false
        });

        const revenue = salesData.reduce((sum, sale) => sum + (sale.total || 0), 0);
        const tickets = salesData.length;
        const avgTicket = tickets > 0 ? revenue / tickets : 0;

        // Fetch sale items for products sold today
        const saleItemsData = await pb.collection('sale_items').getFullList({
          filter: `company_id = "${company.id}" && created >= "${todayStr}"`,
          $autoCancel: false
        });
        const productsSold = saleItemsData.reduce((sum, item) => sum + (item.quantity || 0), 0);

        // Fetch total products
        const productsData = await pb.collection('products').getList(1, 1, {
          filter: `company_id = "${company.id}"`,
          $autoCancel: false
        });

        setStats({
          salesToday: revenue,
          ticketsToday: tickets,
          avgTicket: avgTicket,
          productsSold: productsSold,
          totalProducts: productsData.totalItems
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('No se pudieron cargar las estadísticas del dashboard.');
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchDashboardData();
  }, [company, branch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  if (companyLoading || branchLoading) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const quickActions = [
    { icon: ShoppingCart, label: 'Punto de Venta', path: '/pos', color: 'bg-emerald-500 hover:bg-emerald-600' },
    { icon: Package, label: 'Productos', path: '/products', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Boxes, label: 'Inventario', path: '/inventory', color: 'bg-amber-500 hover:bg-amber-600' },
    { icon: Receipt, label: 'Ventas', path: '/sales', color: 'bg-violet-500 hover:bg-violet-600' },
    { icon: BarChart3, label: 'Reportes', path: '/reports', color: 'bg-indigo-500 hover:bg-indigo-600' },
    { icon: Settings, label: 'Configuración', path: '/configuration', color: 'bg-slate-600 hover:bg-slate-700' },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Hola, {user?.name || user?.email?.split('@')[0] || 'Usuario'}
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            {company?.name || 'Sin empresa'} • {branch?.name || 'Sin sucursal'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* System Status */}
      {!company || !branch ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">Configuración Incompleta</h3>
            <p className="text-sm text-amber-700 mt-1">
              Necesitas seleccionar una empresa y una sucursal para ver los datos y operar el sistema.
            </p>
          </div>
        </div>
      ) : stats.totalProducts === 0 && !isLoadingStats ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-800">Sistema Listo</h3>
            <p className="text-sm text-blue-700 mt-1">
              Tu sistema está configurado. Comienza agregando productos para poder realizar ventas.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
              onClick={() => navigate('/products')}
            >
              Ir a Productos
            </Button>
          </div>
        </div>
      ) : null}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ventas Hoy</p>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-32 mt-1" />
              ) : (
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {formatCurrency(stats.salesToday)}
                </h3>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                <Receipt className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tickets Hoy</p>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20 mt-1" />
              ) : (
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {stats.ticketsToday}
                </h3>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-100 text-violet-600">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ticket Promedio</p>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {formatCurrency(stats.avgTicket)}
                </h3>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Productos Vendidos</p>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20 mt-1" />
              ) : (
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {stats.productsSold}
                </h3>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 active:scale-95`}
            >
              <action.icon className="w-8 h-8" />
              <span className="font-medium text-sm text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
