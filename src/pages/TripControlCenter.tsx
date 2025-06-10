
import React, { useState, useMemo } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Clock, MapPin, Users, Filter, Search, Plus, Calendar, TrendingUp } from "lucide-react";
import { mockTrips, getStatusInHebrew, getStatusColor, Trip } from "@/data/mockTrips";
import { useNavigate } from 'react-router-dom';

const TripControlCenter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');

  // Filter trips based on search and filters
  const filteredTrips = useMemo(() => {
    return mockTrips.filter(trip => {
      const matchesSearch = 
        trip.trip_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.origin_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination_address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
      const matchesDriver = driverFilter === 'all' || trip.driver_name === driverFilter;

      return matchesSearch && matchesStatus && matchesDriver;
    });
  }, [searchTerm, statusFilter, dateFilter, driverFilter]);

  // Calculate KPIs
  const totalTrips = mockTrips.length;
  const activeTrips = mockTrips.filter(t => t.status === 'active').length;
  const completedTripsToday = mockTrips.filter(t => t.status === 'completed').length;
  const openTrips = mockTrips.filter(t => t.status === 'open').length;
  const totalRevenue = mockTrips.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.price, 0);

  const uniqueDrivers = Array.from(new Set(mockTrips.map(t => t.driver_name)));

  const handleTripClick = (tripId: string) => {
    navigate(`/trip-details/${tripId}`);
  };

  const handleDriverClick = (driverId: string) => {
    navigate(`/driver-details/${driverId}`);
  };

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customer-profile/${customerId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">מרכז בקרת נסיעות</h1>
                <p className="text-sm text-muted-foreground">ניהול וניטור כל הנסיעות במערכת</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5">
              <Clock className="h-4 w-4 ml-1 text-primary" />
              {new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
            <Button onClick={() => navigate('/request-ride')} className="enhanced-button">
              <Plus className="h-4 w-4 ml-2" />
              נסיעה חדשה
            </Button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card className="enhanced-card border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalTrips}</div>
                  <div className="text-sm text-muted-foreground">סה״כ נסיעות</div>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{activeTrips}</div>
                  <div className="text-sm text-muted-foreground">נסיעות פעילות</div>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{openTrips}</div>
                  <div className="text-sm text-muted-foreground">נסיעות פתוחות</div>
                </div>
                <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{completedTripsToday}</div>
                  <div className="text-sm text-muted-foreground">הושלמו היום</div>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">₪{totalRevenue}</div>
                  <div className="text-sm text-muted-foreground">הכנסות היום</div>
                </div>
                <div className="bg-indigo-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 pb-4">
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              חיפוש ומסננים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש נסיעות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 modern-input"
                  dir="rtl"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="modern-input">
                  <SelectValue placeholder="סטטוס נסיעה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="active">בדרך</SelectItem>
                  <SelectItem value="completed">הושלמה</SelectItem>
                  <SelectItem value="planned">מתוכננת</SelectItem>
                  <SelectItem value="open">פתוחה</SelectItem>
                  <SelectItem value="cancelled">בוטלה</SelectItem>
                </SelectContent>
              </Select>

              <Select value={driverFilter} onValueChange={setDriverFilter}>
                <SelectTrigger className="modern-input">
                  <SelectValue placeholder="נהג" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הנהגים</SelectItem>
                  {uniqueDrivers.map(driver => (
                    <SelectItem key={driver} value={driver}>{driver}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="modern-input">
                  <SelectValue placeholder="תאריך" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל התאריכים</SelectItem>
                  <SelectItem value="today">היום</SelectItem>
                  <SelectItem value="yesterday">אתמול</SelectItem>
                  <SelectItem value="week">השבוע</SelectItem>
                  <SelectItem value="month">החודש</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || statusFilter !== 'all' || driverFilter !== 'all' || dateFilter !== 'all') && (
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm text-muted-foreground">
                  מציג {filteredTrips.length} מתוך {totalTrips} נסיעות
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDriverFilter('all');
                    setDateFilter('all');
                  }}
                  className="enhanced-button"
                >
                  נקה מסננים
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trips Table */}
      <div className="px-6 pb-6">
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="text-right">רשימת נסיעות</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-right">מספר נסיעה</TableHead>
                    <TableHead className="text-right">נהג</TableHead>
                    <TableHead className="text-right">לקוח</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-right">שעת התחלה</TableHead>
                    <TableHead className="text-right">שעת סיום</TableHead>
                    <TableHead className="text-right">מוצא</TableHead>
                    <TableHead className="text-right">יעד</TableHead>
                    <TableHead className="text-right">מרחק</TableHead>
                    <TableHead className="text-right">מחיר</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrips.map((trip) => (
                    <TableRow key={trip.trip_id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-semibold text-primary hover:underline"
                          onClick={() => handleTripClick(trip.trip_id)}
                        >
                          {trip.trip_id}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-foreground hover:text-primary hover:underline"
                          onClick={() => handleDriverClick(trip.driver_id)}
                        >
                          {trip.driver_name}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-foreground hover:text-primary hover:underline"
                          onClick={() => handleCustomerClick(trip.customer_id)}
                        >
                          {trip.customer_name}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(trip.status)}>
                          {getStatusInHebrew(trip.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(trip.planned_start_time).toLocaleTimeString('he-IL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(trip.planned_end_time).toLocaleTimeString('he-IL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                      <TableCell className="text-sm max-w-32 truncate" title={trip.origin_address}>
                        {trip.origin_address}
                      </TableCell>
                      <TableCell className="text-sm max-w-32 truncate" title={trip.destination_address}>
                        {trip.destination_address}
                      </TableCell>
                      <TableCell className="text-sm">
                        {trip.distance_km} ק"מ
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        ₪{trip.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripControlCenter;
