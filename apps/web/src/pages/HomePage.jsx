
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import KPICard from '@/components/common/KPICard.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/Table.jsx';
import Button from '@/components/common/Button.jsx';
import Badge from '@/components/common/Badge.jsx';
import { DollarSign, ShoppingCart, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { formatCurrency, formatTime } from '@/utils/formatters.js';

const HomePage = () => {
  const kpiData = [
    {
      title: 'Ventas hoy',
      value: formatCurrency(8247.50),
      change: '+12.3% vs ayer',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Transacciones',
      value: '47',
      change: '+8 vs ayer',
      changeType: 'positive',
      icon: ShoppingCart
    },
    {
      title: 'Ticket promedio',
      value: formatCurrency(175.48),
      change: '+4.2% vs ayer',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Clientes atendidos',
      value: '38',
      change: '+6 vs ayer',
      changeType: 'positive',
      icon: Users
    }
  ];

  const recentTransactions = [
    { id: 'TXN-1247', time: '14:32', items: 5, total: 247.80, method: 'Efectivo', status: 'completed' },
    { id: 'TXN-1246', time: '14:18', items: 3, total: 89.50, method: 'Tarjeta', status: 'completed' },
    { id: 'TXN-1245', time: '13:54', items: 8, total: 412.30, method: 'Digital', status: 'completed' },
    { id: 'TXN-1244', time: '13:41', items: 2, total: 56.00, method: 'Efectivo', status: 'completed' },
    { id: 'TXN-1243', time: '13:27', items: 6, total: 198.75, method: 'Tarjeta', status: 'completed' }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - MINISUPER POS</title>
        <meta name="description" content="Panel de control del sistema de punto de venta MINISUPER" />
      </Helmet>

      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Resumen de ventas del día</p>
          </div>
          <Link to="/caja">
            <Button size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Abrir Caja
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transacciones recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Artículos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.time}</TableCell>
                    <TableCell>{transaction.items}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatCurrency(transaction.total)}
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      <Badge variant="success">Completada</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HomePage;
