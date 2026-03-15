
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDailySummary } from '@/services/summaryService.js';
import { FileText, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters.js';

const SummaryPanel = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await generateDailySummary();
      setSummary(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border/50 h-full bg-gradient-to-b from-card to-muted/10">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          {summary.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Desempeño
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Ventas</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(summary.metrics.salesTotal)}</p>
            </div>
            <div className="bg-background p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Tickets</p>
              <p className="text-lg font-bold">{summary.metrics.ticketCount}</p>
            </div>
          </div>
        </div>

        {summary.highlights && summary.highlights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Top Productos</h4>
            <ul className="space-y-2">
              {summary.highlights.map((p, i) => (
                <li key={i} className="flex justify-between text-sm items-center">
                  <span className="font-medium truncate pr-2">{p.name}</span>
                  <span className="text-muted-foreground shrink-0">{p.quantity} uds</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
          <h4 className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Recomendación IA
          </h4>
          <p className="text-sm text-primary/80 leading-relaxed">
            {summary.recommendation}
          </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default SummaryPanel;
