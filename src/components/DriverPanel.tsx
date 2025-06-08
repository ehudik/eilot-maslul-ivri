
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
    const seed = driver.id.charCodeAt(0) + driver.id.charCodeAt(1);
    return Math.floor((seed % 30) + 1);
  };

  // Mock function to get work hours
  const getMockWorkHours = (driver: Driver): number => {
    const seed = driver.id.charCodeAt(0) * 3;
    return Math.floor((seed % 12) + 4);
  };

  // Mock function to get mock address
  const getMockAddress = (driver: Driver): string => {
    const addresses = [
      "רחוב הרצל 15, תל אביב",
      "שדרות רוטשילד 45, תל אביב", 
      "רחוב יפו 123, ירושלים",
      "שדרות בן גוריון 78, חיפה",
      "רחוב דיזנגוף 234, תל אביב"
    ];
    const seed = driver.id.charCodeAt(0);
    return addresses[seed % addresses.length];
  };

  // Filter drivers based on current filters
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      if (filters.driverNameSearch) {
        const searchTerm = filters.driverNameSearch.toLowerCase();
        const driverName = driver.name.toLowerCase();
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
      <Card className="enhanced-card flex-1">
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
                  const address = getMockAddress(driver);
                  
                  return (
                    <div
                      key={driver.id}
                      className={`driver-card animate-fade-in ${
                        selectedDriver?.id === driver.id ? 'driver-card-active' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => onDriverSelect(driver)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(driver.status)}
                          {driver.route && driver.route.length > 0 && (
                            <Badge variant="outline" className="text-xs rounded-full border-primary/30 text-primary">
                              <Route className="h-3 w-3 ml-1" />
                              {driver.route.length} תחנות
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-right">{driver.name}</h3>
                      </div>
                      
                      <div className="text-sm text-muted-foreground text-right space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">מספר נהג:</span>
                          <span className="text-primary font-semibold">{driver.id}</span>
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
                            <span className="text-xs">{address}</span>
                          </div>
                        </div>
                        
                        {driver.route && driver.route.length > 0 && (
                          <p className="text-emerald-600 font-medium">מסלול פעיל: {driver.route.length} נקודות</p>
                        )}
                      </div>

                      {selectedDriver?.id === driver.id && driver.route && (
                        <div className="mt-4 p-4 bg-gradient-to-l from-primary/5 to-transparent rounded-xl border border-primary/20 animate-fade-in">
                          <h4 className="font-semibold text-sm text-right mb-3 text-primary">סיכום מסלול:</h4>
                          <div className="text-xs text-muted-foreground text-right space-y-2">
                            <div className="flex justify-between">
                              <span>מרחק כולל:</span>
                              <span className="font-semibold text-blue-600">{Math.floor(Math.random() * 20) + 5} ק"מ</span>
                            </div>
                            <div className="flex justify-between">
                              <span>זמן נסיעה:</span>
                              <span className="font-semibold text-green-600">{Math.floor(Math.random() * 60) + 30} דקות</span>
                            </div>
                            <div className="flex justify-between">
                              <span>תחנות:</span>
                              <span className="font-semibold text-purple-600">{driver.route.length}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              
              {filteredDrivers.length === 0 && drivers.length > 0 && (
                <div className="text-center text-muted-foreground py-12">
                  <div className="bg-muted/30 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Car className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-2">לא נמצאו נהגים</p>
                  <p className="text-sm">אין נהגים המתאימים למסננים שנבחרו</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
