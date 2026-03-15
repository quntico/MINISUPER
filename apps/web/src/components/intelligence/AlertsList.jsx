
import React, { useState } from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle2, Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const AlertsList = ({ alerts, onMarkAsRead }) => {
  const [filter, setFilter] = useState('all');

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  const unreadCount = alerts.filter(a => !a.read).length;

  const getIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getBgColor = (severity, read) => {
    if (read) return 'bg-muted/30 border-border/50 opacity-70';
    switch (severity) {
      case 'critical': return 'bg-destructive/5 border-destructive/20';
      case 'warning': return 'bg-amber-500/5 border-amber-500/20';
      case 'info': return 'bg-blue-500/5 border-blue-500/20';
      default: return 'bg-card border-border';
    }
  };

  return (
    <Card className="shadow-sm border-border/50 h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            Alertas Activas
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
        <div className="flex gap-2 mt-4">
          <Badge 
            variant={filter === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setFilter('all')}
          >
            Todas
          </Badge>
          <Badge 
            variant={filter === 'critical' ? 'destructive' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setFilter('critical')}
          >
            Críticas
          </Badge>
          <Badge 
            variant={filter === 'warning' ? 'default' : 'outline'} 
            className={`cursor-pointer ${filter === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
            onClick={() => setFilter('warning')}
          >
            Advertencias
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-[300px] px-6 pb-6">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 mb-2 opacity-20" />
              <p>No hay alertas activas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-xl border transition-all ${getBgColor(alert.severity, alert.read)}`}
                >
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0 mt-0.5">
                      {getIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${alert.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {alert.message}
                      </p>
                      {!alert.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 mt-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => onMarkAsRead(alert.id)}
                        >
                          Marcar como leída
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertsList;
