import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Driver } from '@/types/driver';
import { DriverFiltersComponent, DriverFilters } from '@/components/DriverFilters';
import { LoadingSpinner, SkeletonLoader } from '@/components/ui/loading-spinner';
import { Car, MapPin, Clock, Route } from 'lucide-react';

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
    const seed = driver.driver_id.charCodeAt(0) + driver.driver_id.charCodeAt(1);
    return Math.floor((seed % 30) + 1);
  };

  // Mock function to get work hours
  const getMockWorkHours = (driver: Driver): number => {
    const seed = driver.driver_id.charCodeAt(0) * 3;
    return Math.floor((seed % 12) + 4);
  };

  // Filter drivers based on current filters
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      if (filters.driverNameSearch) {
        const searchTerm = filters.driverNameSearch.toLowerCase();
        const driverName = driver.driver_name.toLowerCase();
        if (!driverName.includes(searchTerm)) {
          return false;
        }
      }

      if (filters.status !== 'all' && driver.status !== filters.status) {
        return false;
      }

      const distance = calculateMockDistance(driver);
      if (distance > filters.maxDistance) {
        return false;
      }

      const workHours = getMockWorkHours(driver);
      if (workHours < filters.minWorkHours || workHours > filters.maxWorkHours) {
        return false;
      }

      if (filters.searchLocation) {
        const searchTerm = filters.searchLocation.toLowerCase();
        const driverAddress = driver.address?.toLowerCase() || '';
        if (!driverAddress.includes(searchTerm)) {
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
      available: { label: 'פנוי', className: 'status-available', icon: '🟢' },
      'on-trip': { label: 'בנסיעה', className: 'status-on-trip', icon: '🔵' },
      'on-break': { label: 'בהפסקה', className: 'status-on-break', icon: '🟡' },
      offline: { label: 'לא מחובר', className: 'status-offline', icon: '⚫' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.offline;
    
    return (
      <Badge className={`${statusInfo.className} transition-all duration-300 hover:scale-105`}>
        {statusInfo.icon} {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Filters Section */}
      <DriverFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
      />

      {/* Driver List */}
      <Card className="flex-1">
        <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
          <CardTitle className="text-right flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
            </div>
            רשימת נהגים
          </CardTitle>
          <p className="text-sm text-muted-foreground text-right">
            מציג {filteredDrivers.length} מתוך {drivers.length} נהגים
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-500px)]">
            <div className="space-y-3 p-4">
              {drivers.length === 0 ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="driver-card">
                      <SkeletonLoader className="h-6 mb-2" />
                      <SkeletonLoader className="h-4 mb-1" />
                      <SkeletonLoader className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : (
                filteredDrivers.map((driver, index) => {
                  const distance = calculateMockDistance(driver);
                  const workHours = getMockWorkHours(driver);
                  
                  return (
                    <div
                      key={driver.driver_id}
                      className={`driver-card animate-fade-in ${
                        selectedDriver?.driver_id === driver.driver_id ? 'driver-card-active' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => onDriverSelect(driver)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(driver.status)}
                          {driver.polyline_to_origin_coords && driver.polyline_to_origin_coords.length > 0 && (
                            <Badge variant="outline" className="text-xs rounded-full border-primary/30 text-primary">
                              <Route className="h-3 w-3 ml-1" />
                              {driver.polyline_to_origin_coords.length} תחנות
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-right">{driver.driver_name}</h3>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">מספר נהג:</span>
                          <span className="text-primary font-semibold">{driver.driver_id}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium">סוג רכב:</span>
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            <span>{driver.vehicle?.type}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium">מרחק:</span>
                          <span className="text-blue-600 font-semibold">{distance} ק"מ</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium">שעות עבודה:</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{workHours} שעות</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium">מיקום:</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{driver.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
