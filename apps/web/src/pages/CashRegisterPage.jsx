
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Wallet, Lock, Unlock, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/utils/formatters.js';
import { useCashRegister } from '@/store/cashRegisterStore.jsx';
import { toast } from 'sonner';

const CashRegisterPage = () => {
  const { currentCashRegister, isOpen, isLoading, openCashRegister, closeCashRegister, getPartialCut } = useCashRegister();
  
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [partialCut, setPartialCut] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadPartialCut();
    }
  }, [isOpen]);

  const loadPartialCut = async () => {
    const cut = await getPartialCut();
    setPartialCut(cut);
  };

  const handleOpen = async () => {
    if (!openingAmount || isNaN(openingAmount) || parseFloat(openingAmount) < 0) {
      toast.error('Ingresa un monto de apertura válido');
      return;
    }
    await openCashRegister(openingAmount);
    setOpeningAmount('');
  };

  const handleClose = async () => {
    if (!closingAmount || isNaN(closingAmount) || parseFloat(closingAmount) < 0) {
      toast.error('Ingresa el monto contado en caja');
      return;
    }
    await closeCashRegister(closingAmount, notes);
    setClosingAmount('');
    setNotes('');
    setPartialCut(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Cargando estado de caja...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Control de Caja - MINISUPER</title>
      </Helmet>

      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Control de Caja</h1>
            <p className="text-muted-foreground">Apertura, cortes y cierre de turno</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${isOpen ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
            {isOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isOpen ? 'CAJA ABIERTA' : 'CAJA CERRADA'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Actions */}
          <div className="space-y-6">
            {!isOpen ? (
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    Apertura de Caja
                  </CardTitle>
                  <CardDescription>Ingresa el fondo inicial para comenzar el turno</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Monto Inicial (Fondo de Caja)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={openingAmount}
                      onChange={(e) => setOpeningAmount(e.target.value)}
                      className="text-2xl h-14 font-bold"
                    />
                  </div>
                  <Button className="w-full h-12 text-lg font-bold" onClick={handleOpen}>
                    Abrir Caja
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-border/50 border-t-4 border-t-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-destructive" />
                    Cierre de Caja
                  </CardTitle>
                  <CardDescription>Realiza el conteo final para cerrar el turno</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Efectivo Contado en Caja</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={closingAmount}
                      onChange={(e) => setClosingAmount(e.target.value)}
                      className="text-2xl h-14 font-bold"
                    />
                  </div>
                  
                  {closingAmount && partialCut && (
                    <div className={`p-4 rounded-lg border ${parseFloat(closingAmount) === partialCut.expectedAmountInDrawer ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700' : 'bg-amber-500/10 border-amber-500/30 text-amber-700'}`}>
                      <div className="flex justify-between items-center font-bold">
                        <span>Diferencia:</span>
                        <span>{formatCurrency(parseFloat(closingAmount) - partialCut.expectedAmountInDrawer)}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Notas / Observaciones</Label>
                    <Textarea 
                      placeholder="Justificación de diferencias, retiros, etc." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                  <Button variant="destructive" className="w-full h-12 text-lg font-bold" onClick={handleClose}>
                    Cerrar Caja
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Summary */}
          <div className="space-y-6">
            <Card className="shadow-sm border-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Resumen de Turno
                  </CardTitle>
                  <CardDescription>
                    {isOpen ? 'Corte parcial en tiempo real' : 'Abre la caja para ver el resumen'}
                  </CardDescription>
                </div>
                {isOpen && (
                  <Button variant="outline" size="sm" onClick={loadPartialCut}>
                    Actualizar
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isOpen && partialCut ? (
                  <div className="space-y-6 mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fondo Inicial</span>
                        <span className="font-medium">{formatCurrency(partialCut.openingAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ventas en Efectivo</span>
                        <span className="font-medium text-emerald-600">+{formatCurrency(partialCut.cashSales)}</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Efectivo Esperado en Caja</span>
                        <span className="text-primary">{formatCurrency(partialCut.expectedAmountInDrawer)}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                      <h4 className="font-semibold text-sm mb-2">Otras Formas de Pago</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tarjetas</span>
                        <span className="font-medium">{formatCurrency(partialCut.cardSales)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transferencias</span>
                        <span className="font-medium">{formatCurrency(partialCut.transferSales)}</span>
                      </div>
                      <div className="h-px bg-border/50 my-1" />
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total Ventas Turno</span>
                        <span>{formatCurrency(partialCut.totalSales)}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-center pt-4">
                      Abierta: {new Date(partialCut.openedAt).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-50">
                    <Wallet className="w-16 h-16 mb-4" />
                    <p>No hay información disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CashRegisterPage;
