
import React, { useState } from 'react';
import { Search, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SUGGESTIONS = [
  "¿Cuánto vendí hoy?",
  "¿Cuáles son los productos más vendidos?",
  "¿Qué productos tienen inventario bajo?",
  "Dame un resumen ejecutivo"
];

const QueryInput = ({ onQuery, loading, history }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onQuery(query);
    }
  };

  return (
    <Card className="p-6 shadow-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">Asistente de Inteligencia</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="relative flex items-center w-full mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pregunta sobre ventas, inventario, productos..."
          className="pl-12 pr-24 h-14 text-base rounded-2xl bg-background border-primary/20 focus-visible:ring-primary shadow-inner"
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !query.trim()} 
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-xl px-4"
        >
          {loading ? "Pensando..." : "Preguntar"}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sugerencias</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setQuery(s); onQuery(s); }}
                className="text-sm bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 px-3 py-1.5 rounded-lg transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        {history && history.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Consultas Recientes
            </p>
            <div className="space-y-2">
              {history.slice(0, 3).map((h) => (
                <button
                  key={h.id}
                  onClick={() => { setQuery(h.question); onQuery(h.question); }}
                  className="w-full text-left text-sm text-muted-foreground hover:text-foreground flex items-center justify-between group"
                >
                  <span className="truncate pr-4">{h.question}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QueryInput;
