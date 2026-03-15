
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  Wallet, 
  AlertTriangle,
  ShoppingCart,
  PackagePlus,
  Truck,
  UserPlus,
  FileText,
  Loader2
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import KPICard from '@/components/common/KPICard.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters.js';
import { getExecutiveSummary } from '@/services/executiveService.js';
import { getSalesByDateRange } from '@/services/analytics/salesAnalytics.js';

const COLORS = ['#16a34a', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getExecutiveSummary();
        setSummary(data);

        // Generate last 7 days data
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        
        const sales = await getSalesByDateRange(sevenDaysAgo, today);
        
        // Group by day
        const days = {};
        for (let i = 0; i < 7; i++) {
          const d = new Date(sevenDaysAgo);
          d.setDate(d.getDate() + i);
          days[d.toISOString().split('T')[0]] = 0;
        }
        
        sales.forEach(s => {
          const dateStr = s.created.split(' ')[0];
          if (days[dateStr] !== undefined) {
            days[dateStr] += s.total;
          }
        });
        
        const formattedChartData = Object.entries(days).map(([date, total]) => ({
          date: date.substring(5), // MM-DD
          sales: total
        }));
        
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - MINISUPER</title>
      </Helmet>

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Resumen de operaciones del día</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard icon={DollarSign} title="Ventas del Día" value={formatCurrency(summary?.todaySales || 0)} trend="Hoy" trendColor="green" bgColor="bg-primary" />
          <KPICard icon={Receipt} title="Tickets Generados" value={summary?.ticketCount || 0} trend="Hoy" trendColor="green" bgColor="bg-blue-500" />
          <KPICard icon={TrendingUp} title="Ticket Promedio" value={formatCurrency(summary?.averageTicket || 0)} trend="Hoy" trendColor="green" bgColor="bg-amber-500" />
          <KPICard icon={PackagePlus} title="Prod. en Stock" value={summary?.inventoryStatus?.inStock || 0} trend="Total" trendColor="neutral" bgColor="bg-purple-500" />
          <KPICard icon={AlertTriangle} title="Alertas Stock" value={(summary?.alerts?.lowStockCount || 0) + (summary?.alerts?.outOfStockCount || 0)} trend="Requiere atención" trendColor="red" bgColor="bg-destructive" />
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link to="/caja" className="block">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 bg-card hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm rounded-xl">
              <ShoppingCart className="w-6 h-6" />
              <span>Ir a Caja</span>
            </Button>
          </Link>
          <Link to="/inventario" className="block">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 bg-card hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm rounded-xl">
              <PackagePlus className="w-6 h-6" />
              <span>Inventario</span>
            </Button>
          </Link>
          <Link to="/control-caja" className="block">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 bg-card hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm rounded-xl">
              <Wallet className="w-6 h-6" />
              <span>Control Caja</span>
            </Button>
          </Link>
          <Link to="/reportes" className="block">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 bg-card hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm rounded-xl">
              <FileText className="w-6 h-6" />
              <span>Reportes</span>
            </Button>
          </Link>
          <Link to="/inteligencia" className="block">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 bg-card hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm rounded-xl">
              <TrendingUp className="w-6 h-6" />
              <span>Inteligencia</span>
            </Button>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Ventas Últimos 7 Días</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} 
                    formatter={(value) => [formatCurrency(value), 'Ventas']}
                  />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Top 5 Productos (Hoy)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col justify-center">
              {summary?.topProducts?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">No hay ventas hoy</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
