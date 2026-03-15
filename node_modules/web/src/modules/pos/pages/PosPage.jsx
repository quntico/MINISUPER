
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/modules/core/contexts/AuthContext.jsx';
import { useCompany } from '@/modules/core/contexts/CompanyContext.jsx';
import { useBranch } from '@/modules/core/contexts/BranchContext.jsx';
import pb from '@/lib/pocketbase.js';
import { 
  Search, Trash2, Plus, Minus, ShoppingCart, CreditCard, 
  Clock, User, Printer, CalendarDays, ArrowDownToLine, 
  ArrowUpFromLine, Layers, CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PosPage() {
  const { user } = useAuth();
  const { company } = useCompany();
  const { branch } = useBranch();
  
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !company) return;

    setIsSearching(true);
    try {
      const result = await pb.collection('products').getList(1, 10, {
        filter: `company_id = "${company.id}" && (barcode = "${searchQuery}" || sku = "${searchQuery}" || name ~ "${searchQuery}")`,
        $autoCancel: false
      });

      if (result.items.length === 1) {
        addToCart(result.items[0]);
        setSearchQuery('');
      } else if (result.items.length > 1) {
        toast.info(`Se encontraron ${result.items.length} productos. Por favor sea más específico.`);
      } else {
        toast.error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error al buscar el producto');
    } finally {
      setIsSearching(false);
      if (searchInputRef.current) searchInputRef.current.focus();
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity: parseInt(newQuantity) || 1 } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount || 0);
  };

  const totalItems = cart.length;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0; 
  const total = subtotal + tax;
  
  const payment = parseFloat(paymentAmount) || 0;
  const change = payment >= total ? payment - total : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    if (payment < total && paymentAmount !== '') {
      toast.error('El pago es menor al total');
      return;
    }
    if (!company) {
      toast.error('No hay empresa seleccionada');
      return;
    }

    setIsProcessing(true);
    try {
      // Create Sale Record
      const sale = await pb.collection('sales').create({
        company_id: company.id,
        branch_id: branch?.id || null,
        user_id: user?.id || null,
        subtotal: subtotal,
        tax_total: tax,
        total: total,
        payment_method: 'Efectivo',
        status: 'completed',
        cashier: user?.name || 'Cajero'
      }, { $autoCancel: false });

      // Create Sale Items
      for (const item of cart) {
        await pb.collection('sale_items').create({
          sale_id: sale.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          line_total: item.price * item.quantity,
          company_id: company.id
        }, { $autoCancel: false });

        // Update stock (optional, if stock tracking is strict)
        if (item.stock !== undefined) {
          await pb.collection('products').update(item.id, {
            stock: Math.max(0, item.stock - item.quantity)
          }, { $autoCancel: false });
        }
      }

      toast.success('Venta procesada correctamente');
      setCart([]);
      setPaymentAmount('');
      setSearchQuery('');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error al procesar la venta');
    } finally {
      setIsProcessing(false);
      if (searchInputRef.current) searchInputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">{company?.name || 'Empresa'}</span>
          <span className="text-slate-600">|</span>
          <span>{branch?.name || 'Sucursal Principal'}</span>
          <span className="text-slate-600">|</span>
          <span>Caja 1</span>
        </div>
        <div>
          {new Date().toLocaleString('es-MX')}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Cart & Search */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
          
          {/* Search & Quick Actions */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-2">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Código de barras, SKU o descripción..."
                  className="pl-10 h-12 text-lg border-slate-300 focus-visible:ring-blue-500"
                  disabled={isSearching || isProcessing}
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={isSearching || isProcessing}>
                Enter
              </Button>
            </form>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
            <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300 h-10 whitespace-nowrap">
              <Search className="w-4 h-4 mr-2 text-blue-500" /> Buscar (F10)
            </Button>
            <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300 h-10 whitespace-nowrap">
              <ArrowDownToLine className="w-4 h-4 mr-2 text-emerald-500" /> Entradas
            </Button>
            <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300 h-10 whitespace-nowrap">
              <ArrowUpFromLine className="w-4 h-4 mr-2 text-rose-500" /> Salidas
            </Button>
            <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300 h-10 whitespace-nowrap">
              <Layers className="w-4 h-4 mr-2 text-purple-500" /> Mayoreo
            </Button>
            <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300 h-10 whitespace-nowrap">
              <CheckCircle className="w-4 h-4 mr-2 text-amber-500" /> Verificador
            </Button>
          </div>

          {/* Cart Table */}
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 w-32">Código</th>
                  <th className="p-3 font-semibold text-slate-700 border-b border-slate-200">Descripción</th>
                  <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 text-right w-28">Precio</th>
                  <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 text-center w-32">Cant.</th>
                  <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 text-right w-32">Importe</th>
                  <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 text-center w-20">Stock</th>
                  <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 text-center w-16"></th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-lg">El ticket está vacío</p>
                      <p className="text-sm">Escanee un producto o use el buscador</p>
                    </td>
                  </tr>
                ) : (
                  cart.map((item, index) => (
                    <tr key={`${item.id}-${index}`} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-600 font-mono text-sm">{item.barcode || item.sku || item.id.substring(0,8)}</td>
                      <td className="p-3 font-medium text-slate-900">{item.name}</td>
                      <td className="p-3 text-right text-slate-700">{formatCurrency(item.price)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                            className="w-12 h-8 text-center border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                            min="1"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</td>
                      <td className="p-3 text-center text-slate-500 text-sm">{item.stock || 0}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL - Summary & Payment */}
        <div className="w-96 bg-slate-50 flex flex-col border-l border-slate-200">
          
          {/* Totals Card */}
          <div className="p-6 bg-white border-b border-slate-200 shadow-sm z-10">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Artículos:</span>
                <span className="font-medium">{totalItems} ({totalQuantity} pzas)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Impuestos:</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-slate-800">Total:</span>
                <span className="text-5xl font-black text-blue-600 tracking-tight">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pago con:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-bold">$</span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-16 pl-10 pr-4 text-3xl font-bold text-right border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                  placeholder="0.00"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="bg-slate-200 rounded-xl p-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-700">Cambio:</span>
              <span className={`text-3xl font-bold ${change > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {formatCurrency(change)}
              </span>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isProcessing}
              className="w-full h-20 text-2xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 mt-auto transition-all active:scale-[0.98]"
            >
              {isProcessing ? 'PROCESANDO...' : 'COBRAR (F12)'}
            </Button>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-3 gap-px bg-slate-200 border-t border-slate-200">
            <button className="bg-white p-3 flex flex-col items-center justify-center gap-1 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-medium">Tarjeta</span>
            </button>
            <button className="bg-white p-3 flex flex-col items-center justify-center gap-1 text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-colors">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-medium">Pendiente</span>
            </button>
            <button 
              onClick={() => setCart([])}
              className="bg-white p-3 flex flex-col items-center justify-center gap-1 text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-xs font-medium">Cancelar</span>
            </button>
            <button className="bg-white p-3 flex flex-col items-center justify-center gap-1 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Cliente</span>
            </button>
            <button className="bg-white p-3 flex flex-col items-center justify-center gap-1 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Printer className="w-5 h-5" />
              <span className="text-xs font-medium">Reimprimir</span>
            </button>
            <button className="bg-white p-3 flex flex-col items-center justify-center gap-1 text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-colors">
              <CalendarDays className="w-5 h-5" />
              <span className="text-xs font-medium">Ventas Hoy</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
