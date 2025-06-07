
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface DriverFilters {
  status: string;
  maxDistance: number;
  minWorkHours: number;
  maxWorkHours: number;
  searchLocation: string;
}

interface DriverFiltersProps {
  filters: DriverFilters;
  onFiltersChange: (filters: DriverFilters) => void;
  onResetFilters: () => void;
}

export const DriverFiltersComponent: React.FC<DriverFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters
}) => {
  const updateFilter = (key: keyof DriverFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-right text-lg">סינון נהגים</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-right block">סינון לפי זמינות</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="בחר סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="available">פנוי</SelectItem>
              <SelectItem value="on-trip">בנסיעה</SelectItem>
              <SelectItem value="on-break">בהפסקה</SelectItem>
              <SelectItem value="offline">לא מחובר</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Distance Filter */}
        <div className="space-y-2">
          <Label className="text-right block">מרחק מקסימלי (ק"מ)</Label>
          <Input
            type="number"
            value={filters.maxDistance}
            onChange={(e) => updateFilter('maxDistance', Number(e.target.value))}
            placeholder="הזן מרחק מקסימלי"
            className="text-right"
            dir="rtl"
            min="0"
            max="100"
          />
        </div>

        {/* Search Location */}
        <div className="space-y-2">
          <Label className="text-right block">סינון לפי מיקום יחסי</Label>
          <Input
            type="text"
            value={filters.searchLocation}
            onChange={(e) => updateFilter('searchLocation', e.target.value)}
            placeholder="הזן כתובת או אזור"
            className="text-right"
            dir="rtl"
          />
        </div>

        {/* Work Hours Filter */}
        <div className="space-y-3">
          <Label className="text-right block">סינון לפי שעות עבודה</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-right block text-sm">מינימום</Label>
              <Input
                type="number"
                value={filters.minWorkHours}
                onChange={(e) => updateFilter('minWorkHours', Number(e.target.value))}
                placeholder="0"
                className="text-right"
                dir="rtl"
                min="0"
                max="24"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-right block text-sm">מקסימום</Label>
              <Input
                type="number"
                value={filters.maxWorkHours}
                onChange={(e) => updateFilter('maxWorkHours', Number(e.target.value))}
                placeholder="24"
                className="text-right"
                dir="rtl"
                min="0"
                max="24"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="space-y-2">
          <Label className="text-right block text-sm">מסננים פעילים:</Label>
          <div className="flex flex-wrap gap-2 justify-end">
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                סטטוס: {filters.status === 'available' ? 'פנוי' : 
                        filters.status === 'on-trip' ? 'בנסיעה' : 
                        filters.status === 'on-break' ? 'בהפסקה' : 'לא מחובר'}
              </Badge>
            )}
            {filters.maxDistance > 0 && (
              <Badge variant="secondary" className="text-xs">
                מרחק: עד {filters.maxDistance} ק"מ
              </Badge>
            )}
            {filters.searchLocation && (
              <Badge variant="secondary" className="text-xs">
                מיקום: {filters.searchLocation}
              </Badge>
            )}
            {(filters.minWorkHours > 0 || filters.maxWorkHours < 24) && (
              <Badge variant="secondary" className="text-xs">
                שעות: {filters.minWorkHours}-{filters.maxWorkHours}
              </Badge>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={onResetFilters}
          className="w-full"
          size="sm"
        >
          איפוס מסננים
        </Button>
      </CardContent>
    </Card>
  );
};
