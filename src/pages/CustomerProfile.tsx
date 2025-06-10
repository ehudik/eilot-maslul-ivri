
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, User, Phone, Mail, MapPin, Calendar, CreditCard, TrendingUp, Star, Car } from "lucide-react";
import { mockCustomers } from "@/data/mockCustomers";
import { mockTrips, getStatusInHebrew, getStatusColor } from "@/data/mockTrips";

const CustomerProfile = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const customer = mockCustomers.find(c => c.customer_id === customerId);
  const customerTrips = mockTrips.filter(t => t.customer_id === customerId);

  const stats = useMemo(() => {
    const completedTrips = customerTrips.filter(t => t.status === 'completed');
    const totalSpent = completedTrips.reduce((sum, t) => sum + t.price, 0);
    const avgTripCost = completedTrips.length > 0 ? totalSpent / completedTrips.length : 0;
    const totalDistance = completedTrips.reduce((sum, t) => sum + t.distance_km, 0);
    
    return {
      totalTrips: customerTrips.length,
      completedTrips: completedTrips.length,
      totalSpent,
      avgTripCost,
      totalDistance
    };
  }, [customerTrips]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center" dir="rtl">
        <Card className="enhanced-card max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">לקוח לא נמצא</h2>
            <p className="text-muted-foreground mb-4">הלקוח המבוקש אינו קיים במערכת</p>
            <Button onClick={() => navigate('/trip-control-center')} className="enhanced-button">
              <ArrowRight className="h-4 w-4 ml-2" />
              חזור למרכז הבקרה
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Button 
              variant="outline" 
              onClick={() => navigate('/trip-control-center')}
              className="enhanced-button"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              חזור למרכז הבקרה
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">פרופיל לקוח - {customer.name}</h1>
                <p className="text-sm text-muted-foreground">מידע מפורט על הלקוח והיסטוריית נסיעות</p>
              </div>
            </div>
          </div>
          {customer.vip_status && (
            <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
              <Star className="h-4 w-4 ml-1" />
              לקוח VIP
            </Badge>
          )}
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Customer Information Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Basic Information */}
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  פרטים אישיים
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 p-6 rounded-full w-fit mx-auto mb-3">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {customer.customer_id}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      נרשם: {new Date(customer.registration_date).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  {customer.preferred_vehicle_type && (
                    <div className="flex items-center gap-3">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">סוג רכב מועדף: {customer.preferred_vehicle_type}</span>
                    </div>
                  )}
                </div>

                {customer.notes && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">הערות:</div>
                    <div className="text-sm bg-muted/50 p-3 rounded-lg">{customer.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  סטטיסטיקות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalTrips}</div>
                    <div className="text-sm text-muted-foreground">סה״כ נסיעות</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completedTrips}</div>
                    <div className="text-sm text-muted-foreground">הושלמו</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">סה״כ הוצא</span>
                    <span className="font-bold text-lg">₪{stats.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ממוצע לנסיעה</span>
                    <span className="font-medium">₪{Math.round(stats.avgTripCost)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">סה״כ ק״מ</span>
                    <span className="font-medium">{stats.totalDistance.toFixed(1)} ק״מ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trip History */}
          <div className="xl:col-span-2">
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  היסטוריית נסיעות ({customerTrips.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right">מספר נסיעה</TableHead>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">נהג</TableHead>
                        <TableHead className="text-right">מוצא</TableHead>
                        <TableHead className="text-right">יעד</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">מרחק</TableHead>
                        <TableHead className="text-right">מחיר</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerTrips.map((trip) => (
                        <TableRow key={trip.trip_id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto font-semibold text-primary hover:underline"
                              onClick={() => navigate(`/trip-details/${trip.trip_id}`)}
                            >
                              {trip.trip_id}
                            </Button>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(trip.planned_start_time).toLocaleDateString('he-IL')}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-foreground hover:text-primary hover:underline"
                              onClick={() => navigate(`/driver-details/${trip.driver_id}`)}
                            >
                              {trip.driver_name}
                            </Button>
                          </TableCell>
                          <TableCell className="text-sm max-w-32 truncate" title={trip.origin_address}>
                            {trip.origin_address}
                          </TableCell>
                          <TableCell className="text-sm max-w-32 truncate" title={trip.destination_address}>
                            {trip.destination_address}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(trip.status)}>
                              {getStatusInHebrew(trip.status)}
                            </Badge>
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
                {customerTrips.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    אין נסיעות רשומות עבור לקוח זה
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
