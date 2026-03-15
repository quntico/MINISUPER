
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QueryResult = ({ result, onClose }) => {
  if (!result) return null;

  const renderContent = () => {
    if (result.format === 'table' && Array.isArray(result.data)) {
      if (result.data.length === 0) return <p className="text-muted-foreground">No hay datos para mostrar.</p>;
      
      const columns = Object.keys(result.data[0]).filter(k => k !== 'id' && k !== 'collectionId' && k !== 'collectionName');
      
      return (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col} className="capitalize">{col.replace(/([A-Z])/g, ' $1').trim()}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map(col => {
                    const val = row[col];
                    const isMoney = typeof val === 'number' && (col.toLowerCase().includes('revenue') || col.toLowerCase().includes('price') || col.toLowerCase().includes('cost') || col.toLowerCase().includes('total'));
                    return (
                      <TableCell key={col}>
                        {isMoney ? `$${val.toFixed(2)}` : val}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    // Text or Summary format
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-base leading-relaxed whitespace-pre-wrap">{result.message}</p>
      </div>
    );
  };

  return (
    <Card className="shadow-lg border-primary/20 bg-primary/5 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Bot className="w-5 h-5" />
          Respuesta de IA
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default QueryResult;
