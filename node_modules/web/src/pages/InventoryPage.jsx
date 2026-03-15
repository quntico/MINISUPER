
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Package, Upload, Download, Search, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters.js';
import { getInventoryStatus, getInventoryValue } from '@/services/analytics/inventoryAnalytics.js';
import { downloadInventoryTemplate, importInventoryFromExcel } from '@/services/importService.js';
import { exportInventoryToExcel } from '@/services/exportService.js';
import pb from '@/lib/pocketbase.js';
import { toast } from 'sonner';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState({ totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [value, setValue] = useState({ totalCost: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await pb.collection('products').getFullList({ sort: 'name', $autoCancel: false });
      setProducts(prods);
      setFilteredProducts(prods);
      
      const stat = await getInventoryStatus();
      setStatus(stat);
      
      const val = await getInventoryValue();
      setValue(val);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }
    const lower = search.toLowerCase();
    setFilteredProducts(products.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      (p.sku && p.sku.toLowerCase().includes(lower))
    ));
  }, [search, products]);

  const handleExport = () => {
    exportInventoryToExcel(products);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const result = await importInventoryFromExcel(file);
      toast.success(`Importación exitosa: ${result.created} creados, ${result.updated} actualizados.`);
      if (result.errors > 0) {
        toast.warning(`Hubo ${result.errors} errores. Revisa la consola.`);
        console.warn('Errores de importación:', result.errorDetails);
      }
      loadData();
    } catch (error) {
      toast.error('Error al importar el archivo. Verifica el formato.');
      console.error(error);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Helmet>
        <title>Inventario - MINISUPER</title>
      </Helmet>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
            <p className="text-muted-foreground">Gestión de productos y existencias</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadInventoryTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Plantilla
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2 text-emerald-600" />
              Exportar
            </Button>
            <Button onClick={handleImportClick} disabled={importing}>
              {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Importar
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <p className="text-sm text-muted-foreground mb-1">Total Productos</p>
              <p className="text-2xl font-bold">{status.totalProducts}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <p className="text-sm text-muted-foreground mb-1">En Stock</p>
              <p className="text-2xl font-bold text-emerald-600">{status.inStock}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <p className="text-sm text-muted-foreground mb-1">Bajo Stock</p>
              <p className="text-2xl font-bold text-amber-500">{status.lowStock}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <p className="text-sm text-muted-foreground mb-1">Agotados</p>
              <p className="text-2xl font-bold text-destructive">{status.outOfStock}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50 bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <p className="text-sm text-primary font-medium mb-1">Valor Inventario</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(value.totalPrice)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="p-4 border-b border-border/50">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre o SKU..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Costo</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(p => (
                      <TableRow key={p.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatCurrency(p.cost || 0)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(p.price)}</TableCell>
                        <TableCell className="text-right font-bold">{p.stock}</TableCell>
                        <TableCell className="text-center">
                          {p.stock <= 0 ? (
                            <Badge variant="destructive">Agotado</Badge>
                          ) : p.stock <= 5 ? (
                            <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-500/10">Bajo</Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-500/10">OK</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No se encontraron productos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InventoryPage;
