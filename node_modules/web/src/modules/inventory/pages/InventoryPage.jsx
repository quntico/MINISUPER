
import React, { useState, useEffect, useRef } from 'react';
import { 
  Boxes, 
  Upload, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  X,
  Loader2,
  FileText,
  TrendingUp,
  Sparkles,
  Zap,
  BarChart3,
  History,
  Activity,
  Calendar,
  PieChart,
  RefreshCw,
  Truck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import pb from '@/lib/pocketbaseClient.js';
import { useCompany } from '@/modules/core/contexts/CompanyContext.jsx';
import { useBranch } from '@/modules/core/contexts/BranchContext.jsx';
import { useEditor } from '@/modules/core/contexts/EditorContext.jsx';

export default function InventoryPage() {
  const { company } = useCompany();
  const { branch } = useBranch();
  const { isEditMode } = useEditor();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importing, setImporting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'low', 'out', 'high_inv'
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [providerFilter, setProviderFilter] = useState('all');
  const [showMetrics, setShowMetrics] = useState(false);
  const [metricsData, setMetricsData] = useState({ 
    topSellers: [], 
    traffic: [], 
    slowRotation: [] 
  });
  const [exportFileName, setExportFileName] = useState(`Inventario_${new Date().toISOString().split('T')[0]}`);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadInventory();
  }, [branch]);

  const loadInventory = async () => {
    setLoading(true);
    console.log('--- INICIO CARGA INVENTARIO (API FILTER) ---');
    try {
      const companyId = company?.id || localStorage.getItem('company_id');
      console.log('Filtrando por Company ID:', companyId);

      // Usar filtro directo en la API (confirmado que funciona vía URL)
      // Agregamos product_id != "" para asegurar que no traiga huérfanos que rompan el expand
      const filter = companyId 
        ? `product_id != "" && product_id.company_id = "${companyId}"`
        : `product_id != ""`;

      let records = [];
      try {
        records = await pb.collection('inventory').getFullList({
          filter: filter,
          expand: 'product_id',
          sort: '-created',
          $autoCancel: false
        });
        console.log('Registros recuperados:', records.length);
      } catch (err) {
        console.error('Error en consulta filtrada:', err);
        // Fallback total si la consulta filtrada falla por alguna razón de reglas
        records = await pb.collection('inventory').getFullList({
          expand: 'product_id',
          $autoCancel: false
        });
      }

      // Asegurar que expand.product_id existe (doble verificación)
      const validItems = records.filter(item => item.expand?.product_id);
      console.log('Items válidos para mostrar:', validItems.length);

      setItems(validItems);
      
      if (records.length > 0) {
        toast.info(`Datos sincronizados: ${validItems.length} de ${records.length} productos cargados.`);
      } else {
        toast.info('No se encontraron registros de inventario en el servidor.');
      }

      const activeBranchId = branch?.id || localStorage.getItem('branch_id');
      if (validItems.length > 0) {
        calculateMetrics(validItems, activeBranchId);
      }
    } catch (error) {
      console.error('Error fatal detectado:', error);
      toast.error('Error de sincronización con el servidor');
    } finally {
      setLoading(false);
      console.log('--- FIN CARGA INVENTARIO (API FILTER) ---');
    }
  };

  const handleUpdateProvider = async (productId, newProvider) => {
    try {
      await pb.collection('products').update(productId, { provider: newProvider }, { $autoCancel: false });
      toast.success('Proveedor actualizado');
      // Actualizar estado local para feedback inmediato
      setItems(prev => prev.map(item => {
        if (item.product_id === productId) {
          return {
            ...item,
            expand: {
              ...item.expand,
              product_id: { ...item.expand.product_id, provider: newProvider }
            }
          };
        }
        return item;
      }));
    } catch (err) {
      console.error('Error actualizando proveedor:', err);
      toast.error('No se pudo actualizar el proveedor');
    }
  };

  const calculateMetrics = async (inventoryItems, branchId) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Solo intentar cargar si hay branchId
      if (!branchId) {
        console.log('No branchId for metrics, skipping sales fetch');
        return;
      }

      let sales = [];
      let saleItems = [];
      
      try {
        sales = await pb.collection('sales').getFullList({
          filter: `branch_id = "${branchId}" && created >= "${sevenDaysAgo.toISOString()}"`,
          $autoCancel: false
        });
      } catch(e) { console.warn('Sales collection might not exist yet'); }

      try {
        saleItems = await pb.collection('sale_items').getFullList({
          filter: `branch_id = "${branchId}" && created >= "${sevenDaysAgo.toISOString()}"`,
          expand: 'product_id',
          $autoCancel: false
        });
      } catch(e) { console.warn('Sale_items collection might not exist yet'); }

      // 1. Top Sellers
      const productSales = {};
      saleItems.forEach(item => {
        const name = item.expand?.product_id?.name || 'Desconocido';
        productSales[name] = (productSales[name] || 0) + item.quantity;
      });
      const topSellers = Object.entries(productSales)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

      // 2. Traffic (Sales per day)
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const trafficMap = {};
      sales.forEach(sale => {
        const dayName = days[new Date(sale.created).getDay()];
        trafficMap[dayName] = (trafficMap[dayName] || 0) + 1;
      });
      const traffic = days.map(day => ({ name: day, ventas: trafficMap[day] || 0 }));

      // 3. Slow Rotation (> 15 days)
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      
      const slowRotation = inventoryItems.filter(item => {
        const lastUpdate = new Date(item.last_update || item.updated);
        return lastUpdate < fifteenDaysAgo && item.stock > 0;
      }).slice(0, 10);

      setMetricsData({ topSellers, traffic, slowRotation });
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          toast.error('El archivo está vacío');
          return;
        }

        let fCompanyId = company?.id;
        let fBranchId = branch?.id;

        if (!fCompanyId || !fBranchId) {
          try {
            const firstBranch = await pb.collection('branches').getFirstListItem('', { $autoCancel: false });
            fCompanyId = firstBranch.company_id;
            fBranchId = firstBranch.id;
          } catch (e) {
            const firstComp = await pb.collection('companies').getFirstListItem('', { $autoCancel: false });
            fCompanyId = firstComp.id;
            fBranchId = "MAIN_BRANCH_FALLBACK"; 
          }
        }

        // --- OPTIMIZACIÓN: Carga masiva de datos existentes ---
        toast.info(`Iniciando procesamiento de ${data.length} registros...`);
        
        // 1. Obtener todos los productos y el inventario existente de una vez
        const [existingProducts, existingInventory] = await Promise.all([
          pb.collection('products').getFullList({ filter: `branch_id = "${fBranchId}"`, $autoCancel: false }),
          pb.collection('inventory').getFullList({ filter: `branch_id = "${fBranchId}"`, $autoCancel: false })
        ]);

        const productMap = new Map(existingProducts.map(p => [p.barcode, p]));
        const inventoryMap = new Map(existingInventory.map(i => [i.product_id, i]));

        let count = 0;
        const batchSize = 50; // Procesar de 50 en 50 para velocidad
        
        for (let i = 0; i < data.length; i += batchSize) {
          const chunk = data.slice(i, i + batchSize);
          
          await Promise.all(chunk.map(async (row) => {
            const barcode = String(row.barcode || row.CÓDIGO || row.Código || row.Codigo || '').trim();
            if (!barcode) return;

            const name = String(row.name || row.NOMBRE || row.Producto || 'Producto sin nombre');
            const price = parseFloat(String(row.price || row.PRECIO || row["P. Venta"] || 0).replace(/[$,]/g, '')) || 0;
            const cost = parseFloat(String(row.cost || row.COSTO || row["P. Costo"] || 0).replace(/[$,]/g, '')) || 0;
            
            // LÓGICA DE MAYOREO: Si es 0 o menor al costo, usar el precio de venta como respaldo
            let wholesale = parseFloat(String(row.wholesale || row["P. Mayoreo"] || row["P. MAYOREO"] || row["Precio Mayoreo"] || row.Mayoreo || 0).replace(/[$,]/g, '')) || 0;
            if (wholesale === 0 || wholesale < cost) {
              wholesale = price;
            }

            const category = String(row.category || row.CATEGORÍA || row.Departamento || 'General');
            const stock = parseFloat(row.stock || row.EXISTENCIA || row.Existencia || 0);

            const productData = {
              barcode, name, price, cost,
              wholesale_price: wholesale,
              category, company_id: fCompanyId, branch_id: fBranchId,
              is_active: true
            };

            try {
              let product = productMap.get(barcode);
              
              if (product) {
                // Actualizar solo si hay cambios significativos (opcional, pero mejor siempre actualizar)
                product = await pb.collection('products').update(product.id, productData);
              } else {
                product = await pb.collection('products').create(productData);
                productMap.set(barcode, product);
              }

              // Asegurar que stock nunca sea null/undefined (evita validation_required)
              const safeStock = parseInt(stock) >= 0 ? parseInt(stock) : 0;

              if (inv) {
                await pb.collection('inventory').update(inv.id, { 
                  stock: safeStock,
                  last_update: new Date()
                }, { $autoCancel: false });
              } else {
                const invData = {
                  product_id: product.id,
                  stock: safeStock,
                  min_stock: 5,
                  last_update: new Date()
                };
                if (fBranchId) invData.branch_id = fBranchId;
                await pb.collection('inventory').create(invData, { $autoCancel: false });
              }
              count++;
            } catch (err) {
              console.error('Fallo en registro:', barcode, err);
            }
          }));
          
          // Feedback de progreso suave
          if (i % 200 === 0) {
            toast.info(`Procesados ${Math.min(i + batchSize, data.length)} / ${data.length}...`);
          }
        }

        toast.success(`¡Éxito! Se sincronizaron ${count} productos correctamente.`);
        setShowImportDialog(false);
        loadInventory();
      } catch (err) {
        console.error('Import error:', err);
        toast.error('Error al procesar el archivo Excel');
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };
  
  const handleExportExcel = () => {
    try {
      const dataToExport = filteredItems.map(item => ({
        'CÓDIGO': item.expand?.product_id?.barcode || '',
        'PRODUCTO': item.expand?.product_id?.name || '',
        'CATEGORÍA': item.expand?.product_id?.category || 'General',
        'PRECIO VENTA': item.expand?.product_id?.price || 0,
        'P. MAYOREO': item.expand?.product_id?.wholesale_price || 0,
        'COSTO': item.expand?.product_id?.cost || 0,
        'EXISTENCIA': item.stock || 0
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventario");
      
      XLSX.writeFile(wb, `${exportFileName}.xlsx`);
      toast.success('Excel exportado correctamente');
      setShowExportOptions(false);
    } catch (error) {
      toast.error('Error al exportar Excel');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.text("Reporte de Inventario", 14, 22);
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Empresa: ${company?.name || 'Mi Negocio'}`, 14, 35);

      const tableData = filteredItems.map(item => [
        item.expand?.product_id?.barcode || 'N/A',
        item.expand?.product_id?.name || '',
        item.expand?.product_id?.category || 'General',
        item.expand?.product_id?.provider || 'S/P',
        `$${(item.expand?.product_id?.price || 0).toFixed(2)}`,
        item.stock.toString()
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['Código', 'Producto', 'Categoría', 'Proveedor', 'Precio', 'Stock']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillStyle: '#1e293b', textColor: '#ffffff' }
      });

      doc.save(`${exportFileName}.pdf`);
      toast.success('PDF exportado correctamente');
      setShowExportOptions(false);
    } catch (error) {
      console.error(error);
      toast.error('Error al exportar PDF');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.expand?.product_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.expand?.product_id?.barcode?.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || item.expand?.product_id?.category === categoryFilter;
    const matchesProvider = providerFilter === 'all' || item.expand?.product_id?.provider === providerFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'low') matchesStatus = item.stock > 0 && item.stock <= (item.min_stock || 5);
    if (statusFilter === 'out') matchesStatus = item.stock <= 0;
    
    return matchesSearch && matchesCategory && matchesProvider && matchesStatus;
  }).sort((a, b) => {
    if (statusFilter === 'high_inv') {
      const invA = (a.stock * (a.expand?.product_id?.cost || 0));
      const invB = (b.stock * (b.expand?.product_id?.cost || 0));
      return invB - invA;
    }
    return 0;
  });

  const lowStockCount = items.filter(i => i.stock > 0 && i.stock <= (i.min_stock || 5)).length;
  const outOfStockCount = items.filter(i => i.stock <= 0).length;

  const categories = ['all', ...new Set(items.map(item => item.expand?.product_id?.category).filter(Boolean))];
  const providers = ['all', ...new Set(items.map(item => item.expand?.product_id?.provider).filter(Boolean))];
  
  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Cálculos de totales del inventario
  const stats = items.reduce((acc, item) => {
    const product = item.expand?.product_id;
    if (product) {
      acc.totalCost += (item.stock * (product.cost || 0));
      acc.totalRetail += (item.stock * (product.price || 0));
      acc.totalWholesale += (item.stock * (product.wholesale_price || 0));
      if (item.stock <= (item.min_stock || 5)) acc.lowStock++;
    }
    return acc;
  }, { totalCost: 0, totalRetail: 0, totalWholesale: 0, lowStock: 0 });

  return (
    <div className="space-y-6">
      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200/60 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Boxes className="w-8 h-8 text-blue-600" />
              Gestión de Inventario
            </h1>
            <p className="text-slate-500 mt-1">Control financiero y existencias de productos.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2 border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 shadow-sm rounded-xl transition-all border-2"
              onClick={() => setShowImportDialog(true)}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Importar Excel
            </Button>
            <Button 
              variant="outline"
              className="gap-2 border-purple-200 bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-800 shadow-sm rounded-xl transition-all border-2"
              onClick={() => setShowMetrics(true)}
            >
              <BarChart3 className="w-4 h-4 text-purple-600" />
              Métricas
            </Button>
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 rounded-xl"
              onClick={() => loadInventory()}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Actualizar
            </Button>
            <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md rounded-xl">
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Totales del Inventario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Inversión Total (Costo)</p>
            <div className="text-2xl font-black text-slate-900">${stats.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Valor Venta (Tienda)</p>
            <div className="text-2xl font-black text-blue-600">${stats.totalRetail.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-amber-200 transition-all">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Valor Venta (Mayoreo)</p>
            <div className="text-2xl font-black text-amber-600">${stats.totalWholesale.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-orange-200 transition-all">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Productos Stock Bajo</p>
            <div className="text-2xl font-black text-orange-600">{stats.lowStock}</div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button 
            onClick={() => setStatusFilter('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2",
              statusFilter === 'all' 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
            )}
          >
            Todos ({items.length})
          </button>
          
          <button 
            onClick={() => setStatusFilter('low')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2",
              statusFilter === 'low' 
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200" 
                : "bg-white border-orange-100 text-orange-400 hover:border-orange-200"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", statusFilter === 'low' ? "bg-white animate-pulse" : "bg-orange-400")} />
            Stock Bajo ({lowStockCount})
          </button>

          <button 
            onClick={() => setStatusFilter('out')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2",
              statusFilter === 'out' 
                ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200" 
                : "bg-white border-red-100 text-red-400 hover:border-red-200"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", statusFilter === 'out' ? "bg-white animate-pulse" : "bg-red-400")} />
            Agotados ({outOfStockCount})
          </button>

          <button 
            onClick={() => setStatusFilter('high_inv')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2",
              statusFilter === 'high_inv' 
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-white border-blue-100 text-blue-400 hover:border-blue-200"
            )}
          >
            <TrendingUp className="w-3 h-3" />
            Mayor Inversión
          </button>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden rounded-3xl">
        <div className="p-4 border-b border-border bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre o código..." 
              className="pl-10 bg-white text-slate-900 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="default" 
              size="icon" 
              onClick={() => setShowCategoryMenu(true)}
              className={cn(
                "shrink-0 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all",
                showCategoryMenu && "ring-2 ring-blue-500 ring-offset-2"
              )}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button 
              variant="default" 
              className="gap-2 shrink-0 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
              onClick={() => setShowExportOptions(true)}
            >
              <Download className="w-4 h-4" /> Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 group/header transition-all duration-300">
              <TableRow className="hover:bg-blue-600 transition-colors border-none">
                <TableHead className="font-bold group-hover/header:text-white transition-colors">Producto</TableHead>
                <TableHead className="font-bold group-hover/header:text-white transition-colors">Categoría</TableHead>
                <TableHead className="font-bold group-hover/header:text-white transition-colors">Proveedor</TableHead>
                <TableHead className="font-bold text-right group-hover/header:text-white transition-colors">Precio</TableHead>
                <TableHead className="font-bold text-center group-hover/header:text-white transition-colors">Existencia</TableHead>
                <TableHead className="font-bold group-hover/header:text-white transition-colors">Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <span className="text-slate-500 font-medium">Cargando inventario...</span>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Boxes className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-500">No se encontraron productos.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const product = item.expand?.product_id;
                  const isLowStock = item.stock <= (item.min_stock || 5);

                  return (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{product?.name || 'S/N'}</span>
                          <span className="text-xs text-slate-500 font-mono tracking-tighter">{product?.barcode || 'Sin código'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium bg-slate-100 text-slate-600 border-none">
                          {product?.category || 'General'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <Input 
                            className="h-8 text-sm font-medium bg-white border-blue-200 focus:ring-blue-500 rounded-lg"
                            defaultValue={product?.provider || ''}
                            onBlur={(e) => {
                              if (e.target.value !== (product?.provider || '')) {
                                handleUpdateProvider(product.id, e.target.value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur();
                              }
                            }}
                          />
                        ) : (
                          <span className="text-sm font-medium text-slate-600">
                            {product?.provider || 'S/P'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900">
                        ${product?.price?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className={cn(
                            "text-base font-black px-3 py-1 rounded-full",
                            isLowStock ? "text-orange-600 bg-orange-50" : "text-green-600 bg-green-50"
                          )}>
                            {item.stock}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Stock Bajo
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Normal
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Smart Category Command Center */}
      <Dialog open={showCategoryMenu} onOpenChange={setShowCategoryMenu}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-[#0A122A]/30 border-white/20 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(30,58,138,0.3)]">
          <div className="p-8 bg-white rounded-[3rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Centro de Comando</DialogTitle>
                <DialogDescription className="text-slate-600 font-medium">¿Qué departamento o sección estás buscando hoy?</DialogDescription>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <Input 
                  autoFocus
                  placeholder="Escriba aquí (Ej: 'Vinos y licores' o 'Lo más vendido')..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-12 h-16 bg-slate-50 border-slate-200 text-xl text-slate-900 rounded-2xl focus:ring-blue-500 placeholder:text-slate-400 font-bold border-2 transition-all"
                />
              </div>
            </div>

            <div className="mt-8 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border-b border-white/10 pb-6 mb-6">
              <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/60 mb-4">Filtrar por Categoría</p>
              
              {filteredCategories.length > 0 ? (
                filteredCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group",
                      categoryFilter === cat 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                    )}
                  >
                    <span className="font-bold uppercase tracking-wider text-xs">
                      {cat === 'all' ? 'Todas las Categorías' : cat}
                    </span>
                    {categoryFilter === cat && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                ))
              ) : null}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60 mb-4">Filtrar por Proveedor</p>
              
              {providers.map(prov => (
                <button
                  key={prov}
                  onClick={() => {
                    setProviderFilter(prov);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group",
                    providerFilter === prov 
                      ? "bg-emerald-600 text-white shadow-lg" 
                      : "text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Truck className={cn("w-4 h-4", providerFilter === prov ? "text-white" : "text-slate-400")} />
                    <span className="font-bold uppercase tracking-wider text-xs">
                      {prov === 'all' ? 'Todos los Proveedores' : prov}
                    </span>
                  </div>
                  {providerFilter === prov && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 flex justify-between items-center border-t border-white/10">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-4">ENTER para seleccionar • ESC para cerrar</span>
            <Button variant="ghost" onClick={() => setShowCategoryMenu(false)} className="text-slate-400 hover:text-white rounded-full px-6">
              Ocultar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-3xl font-black text-white tracking-tight">Importar Inventario</DialogTitle>
            <DialogDescription className="text-slate-300 text-base">
              Sube un archivo Excel (.xlsx o .xls) con las columnas: <br/>
              <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md mt-2 inline-block">barcode, name, price, cost, stock, category</span>
            </DialogDescription>
          </DialogHeader>

          <div 
            className={cn(
              "mt-4 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300",
              importing ? "opacity-50 pointer-events-none" : "hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer"
            )}
            onClick={() => !importing && fileInputRef.current?.click()}
          >
            {importing ? (
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            ) : (
              <Upload className="w-12 h-12 text-slate-400" />
            )}
            <div className="text-center">
              <p className="font-black text-white uppercase tracking-wider text-sm">Haz clic para buscar archivo</p>
              <p className="text-xs text-slate-400 mt-1">Formatos soportados: .xlsx, .xls</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".xlsx,.xls" 
              onChange={handleImportExcel}
            />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button variant="ghost" onClick={() => setShowImportDialog(false)} disabled={importing} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl">
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Options Dialog */}
      <Dialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <DialogContent className="sm:max-w-[480px] p-8">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-3xl font-black text-white tracking-tight">Exportar Inventario</DialogTitle>
            <DialogDescription className="text-slate-300 text-base">
              Personaliza el nombre del archivo y elige el formato de descarga.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            <div className="space-y-3">
              <label className="text-xs uppercase font-black text-slate-400 tracking-widest ml-1">Nombre del Archivo</label>
              <Input 
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                className="rounded-2xl border-white/20 bg-white/5 text-white h-12 px-5 font-bold focus:ring-blue-500 shadow-inner placeholder:text-slate-600"
                placeholder="Ej. Inventario_Marzo_2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={handleExportExcel}
                className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all group relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-white/90">Excel (XLSX)</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all group relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <FileText className="w-8 h-8" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-white/90">Documento PDF</span>
              </button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowExportOptions(false)} className="rounded-xl text-slate-400 hover:text-white hover:bg-white/10 font-bold">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Advanced Metrics Dashboard */}
      <Dialog open={showMetrics} onOpenChange={setShowMetrics}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto p-0 bg-[#0A122A]/40 border-white/20 backdrop-blur-3xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="p-10">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">Radiografía del Inventario</DialogTitle>
                  <DialogDescription className="text-slate-500 text-lg uppercase tracking-widest font-bold mt-1">Análisis de rendimiento y rotación</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowMetrics(false)} className="text-slate-500 hover:text-white rounded-full">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col gap-2">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <PieChart className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Valorización Total</span>
                </div>
                <div className="text-3xl font-black text-white">${stats.totalRetail.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                <div className="text-sm text-slate-500 font-bold">Capital en piso de venta</div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col gap-2">
                <div className="flex items-center gap-3 text-orange-400 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Alerta de Stock</span>
                </div>
                <div className="text-3xl font-black text-white">{stats.lowStock} Productos</div>
                <div className="text-sm text-slate-500 font-bold">Requieren atención inmediata</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col gap-2">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <History className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Sin Rotación</span>
                </div>
                <div className="text-3xl font-black text-white">{metricsData.slowRotation.length} SKUs</div>
                <div className="text-sm text-slate-500 font-bold">+15 días sin movimiento</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traffic Chart */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Tráfico Semanal</h3>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metricsData.traffic}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A122A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Sellers Chart */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Top 5 Vendidos</h3>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData.topSellers} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#fff" fontSize={11} width={120} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0A122A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                      />
                      <Bar dataKey="qty" fill="#f59e0b" radius={[0, 10, 10, 0]}>
                        {metricsData.topSellers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#f59e0b', '#fbbf24', '#fcd34d', '#fb923c', '#f97316'][index % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Slow Rotation Detail */}
            <div className="mt-10 bg-white/5 border border-white/10 p-8 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-6">
                <History className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Productos sin rotación (&gt;15 días)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metricsData.slowRotation.length > 0 ? metricsData.slowRotation.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">{item.expand?.product_id?.name}</span>
                      <span className="text-slate-500 text-xs uppercase tracking-widest">{item.expand?.product_id?.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-black">{item.stock} pza</div>
                      <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Estancado</div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 py-8 text-center text-slate-500 font-bold uppercase tracking-widest">Excelente flujo de inventario</div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
