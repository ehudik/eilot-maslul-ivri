
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Driver } from '@/types/driver';
import { DriverFiltersComponent, DriverFilters } from '@/components/DriverFilters';

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
  const [filters, setFilters] = useState<DriverFilters>({
    status: 'all',
    maxDistance: 50,
    minWorkHours: 0,
    maxWorkHours: 24,
    searchLocation: '',
    driverNameSearch: ''
  });

  // Mock function to calculate distance (in real app, this would use actual coordinates)
  const calculateMockDistance = (driver: Driver): number => {
    // Generate consistent mock distance based on driver ID
    const seed = driver.id.charCodeAt(0) + driver.id.charCodeAt(1);
    return Math.floor((seed % 30) + 1); // 1-30 km
  };

  // Mock function to get work hours (in real app, this would come from database)
  const getMockWorkHours = (driver: Driver): number => {
    const seed = driver.id.charCodeAt(0) * 3;
    return Math.floor((seed % 12) + 4); // 4-16 hours
  };

  // Filter drivers based on current filters
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      // Driver name search filter
      if (filters.driverNameSearch) {
        const searchTerm = filters.driverNameSearch.toLowerCase();
        const driverName = driver.name.toLowerCase();
        if (!driverName.includes(searchTerm)) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && driver.status !== filters.status) {
        return false;
      }

      // Distance filter
      const distance = calculateMockDistance(driver);
      if (distance > filters.maxDistance) {
        return false;
      }

      // Work hours filter
      const workHours = getMockWorkHours(driver);
      if (workHours < filters.minWorkHours || workHours > filters.maxWorkHours) {
        return false;
      }

      // Location search filter (simple text match)
      if (filters.searchLocation) {
        const searchTerm = filters.searchLocation.toLowerCase();
        const driverName = driver.name.toLowerCase();
        if (!driverName.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [drivers, filters]);

  const resetFilters = () => {
    setFilters({
      status: 'all',
      maxDistance: 50,
      minWorkHours: 0,
      maxWorkHours: 24,
      searchLocation: '',
      driverNameSearch: ''
    });
  };

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
    <div className="h-full flex flex-col">
      {/* Filters Section */}
      <DriverFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
      />

      {/* Driver List */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-right">רשימת נהגים</CardTitle>
          <p className="text-sm text-muted-foreground text-right">
            מציג {filteredDrivers.length} מתוך {drivers.length} נהגים
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-450px)]">
            <div className="space-y-2 p-4">
              {filteredDrivers.map((driver) => {
                const distance = calculateMockDistance(driver);
                const workHours = getMockWorkHours(driver);
                
                return (
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
                      <p>סוג רכב: {driver.vehicle?.type}</p>
                      <p>מרחק: {distance} ק"מ</p>
                      <p>שעות עבודה: {workHours} שעות</p>
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
                );
              })}
              
              {filteredDrivers.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p>לא נמצאו נהגים המתאימים למסננים שנבחרו</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
