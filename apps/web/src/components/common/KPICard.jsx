
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const KPICard = ({ icon: Icon, title, value, trend, trendColor = 'neutral', bgColor = 'bg-primary' }) => {
  const trendColors = {
    green: 'text-emerald-500',
    red: 'text-red-500',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="number-display">{value}</div>
          </div>
          <div className={cn("p-3 rounded-xl text-white", bgColor)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={cn("font-medium", trendColors[trendColor] || trendColors.neutral)}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
