
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass = "text-primary", bgClass = "bg-primary/10" }) => {
  
  const renderTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-destructive" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-black tracking-tight">{value}</h3>
          </div>
          <div className={`p-2.5 rounded-xl ${bgClass}`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
        </div>
        
        {trendValue && (
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
            {renderTrendIcon()}
            <span className={trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}>
              {trendValue}
            </span>
            <span className="text-muted-foreground font-normal ml-1">vs periodo anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
