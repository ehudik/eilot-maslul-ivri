
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Driver } from '@/types/driver';

interface DriverPanelProps {
  drivers: Driver[];
  selectedDriver: Driver | null;
  onDriverSelect: (driver: Driver) => void;
}

export const DriverPanel: React.FC<DriverPanelProps> = ({
  drivers,
  selectedDriver,
  onDriverSelect,
}) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      available: { label: 'פנוי', className: 'status-available' },
      'on-trip': { label: 'בנסיעה', className: 'status-on-trip' },
      'on-break': { label: 'בהפסקה', className: 'status-on-break' },
      offline: { label: 'לא מחובר', className: 'status-offline' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.offline;
    
    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-right">רשימת נהגים</CardTitle>
        <p className="text-sm text-muted-foreground text-right">
          סה"כ {drivers.length} נהגים
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2 p-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedDriver?.id === driver.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onDriverSelect(driver)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(driver.status)}
                    {driver.route && driver.route.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {driver.route.length} תחנות
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-right">{driver.name}</h3>
                </div>
                
                <div className="text-sm text-muted-foreground text-right space-y-1">
                  <p>מספר נהג: {driver.id}</p>
                  <p>מיקום: {driver.location.lat.toFixed(4)}, {driver.location.lng.toFixed(4)}</p>
                  {driver.route && driver.route.length > 0 && (
                    <p>מסלול פעיל: {driver.route.length} נקודות</p>
                  )}
                </div>

                {selectedDriver?.id === driver.id && driver.route && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm text-right mb-2">סיכום מסלול:</h4>
                    <div className="text-xs text-muted-foreground text-right space-y-1">
                      <p>מרחק כולל: {Math.floor(Math.random() * 20) + 5} ק"מ</p>
                      <p>זמן נסיעה: {Math.floor(Math.random() * 60) + 30} דקות</p>
                      <p>תחנות: {driver.route.length}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
