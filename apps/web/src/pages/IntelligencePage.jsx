
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BrainCircuit, DollarSign, Package, Receipt, TrendingUp } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

import { useAlerts } from '@/hooks/useAlerts.js';
import { useIntelligenceQuery } from '@/hooks/useIntelligenceQuery.js';
import { getSalesTrend, getTopProducts, getSalesToday, getInventoryValue } from '@/services/intelligence/queryService.js';
import { formatCurrency } from '@/utils/formatters.js';

import QueryInput from '@/components/intelligence/QueryInput.jsx';
import AlertsList from '@/components/intelligence/AlertsList.jsx';
import KPICard from '@/components/intelligence/KPICard.jsx';
import QueryResult from '@/components/intelligence/QueryResult.jsx';
import SummaryPanel from '@/components/intelligence/SummaryPanel.jsx';
import ExportButtons from '@/components/intelligence/ExportButtons.jsx';

const IntelligencePage = () => {
  const { alerts, markAsRead } = useAlerts();
  const { result, loading: queryLoading, queryHistory, askQuestion, clearResult } = useIntelligenceQuery();
  
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState({ trend: [], top: [] });

  useEffect(() => {
    const loadDashboardData = async () => {
      const [today, inv, trendData, topData] = await Promise.all([
        getSalesToday(),
        getInventoryValue(),
        getSalesTrend(7),
        getTopProducts(5)
      ]);

      setKpis({
        sales: today.total,
        tickets: today.ticketCount,
        average: today.averageTicket,
        inventory: inv.byCost
      });

      // Format trend data for chart
      const formattedTrend = trendData.map(d => ({
        date: d.date.substring(5), // MM-DD
        Ventas: d.total
      }));

      setCharts({ trend: formattedTrend, top: topData });
    };

    loadDashboardData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Centro de Inteligencia - MINISUPER</title>
      </Helmet>

      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-primary" />
              Centro de Inteligencia
            </h1>
            <p className="text-muted-foreground mt-1">Análisis avanzado, alertas y consultas en lenguaje natural</p>
          </div>
        </div>

        {/* SECTION 1 & 6: Query Input & Exports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QueryInput onQuery={askQuestion} loading={queryLoading} history={queryHistory} />
          </div>
          <div className="lg:col-span-1 flex flex-col justify-end">
            <ExportButtons />
          </div>
        </div>

        {/* Query Result Area */}
        {result && (
          <div className="mb-6">
            <QueryResult result={result} onClose={clearResult} />
          </div>
        )}

        {/* SECTION 3: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            title="Ventas Hoy" 
            value={formatCurrency(kpis?.sales || 0)} 
            icon={DollarSign} 
            trend="up" 
            trendValue="+12%" 
          />
          <KPICard 
            title="Tickets Hoy" 
            value={kpis?.tickets || 0} 
            icon={Receipt} 
            colorClass="text-blue-500" 
            bgClass="bg-blue-500/10" 
          />
          <KPICard 
            title="Ticket Promedio" 
            value={formatCurrency(kpis?.average || 0)} 
            icon={TrendingUp} 
            colorClass="text-amber-500" 
            bgClass="bg-amber-500/10" 
          />
          <KPICard 
            title="Valor Inventario" 
            value={formatCurrency(kpis?.inventory || 0)} 
            icon={Package} 
            colorClass="text-purple-500" 
            bgClass="bg-purple-500/10" 
          />
        </div>

        {/* SECTION 4: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4">Tendencia de Ventas (7 días)</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(value) => [formatCurrency(value), 'Ventas']}
                  />
                  <Line type="monotone" dataKey="Ventas" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4">Top 5 Productos</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.top} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: 'hsl(var(--muted))'}} 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="quantity" name="Cantidad" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 2 & 5: Alerts & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertsList alerts={alerts} onMarkAsRead={markAsRead} />
          </div>
          <div className="lg:col-span-1">
            <SummaryPanel />
          </div>
        </div>

      </div>
    </>
  );
};

export default IntelligencePage;
