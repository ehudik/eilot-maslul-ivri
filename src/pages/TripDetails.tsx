
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapComponent, MapComponentRef } from '@/components/MapComponent';
import { ArrowRight, MapPin, Clock, User, Car, Phone, DollarSign, Navigation } from "lucide-react";
import { mockTrips, getStatusInHebrew, getStatusColor } from "@/data/mockTrips";
import { mockDrivers } from "@/data/mockDrivers";
import { mockCustomers } from "@/data/mockCustomers";

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<MapComponentRef>(null);

  const trip = mockTrips.find(t => t.trip_id === tripId);
  const driver = trip ? mockDrivers.find(d => d.driver_id === trip.driver_id) : null;
  const customer = trip ? mockCustomers.find(c => c.customer_id === trip.customer_id) : null;

  useEffect(() => {
    if (trip && mapRef.current) {
      mapRef.current.fitBoundsToContent();
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center" dir="rtl">
        <Card className="enhanced-card max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">נסיעה לא נמצאה</h2>
            <p className="text-muted-foreground mb-4">הנסיעה המבוקשת אינה קיימת במערכת</p>
            <Button onClick={() => navigate('/trip-control-center')} className="enhanced-button">
              <ArrowRight className="h-4 w-4 ml-2" />
              חזור למרכז הבקרה
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rideDetails = {
    origin_coords: trip.origin_coords,
    destination_coords: trip.destination_coords,
    ride_polyline_coords: trip.polyline_coords || [
      trip.origin_coords,
      trip.destination_coords
    ]
  };

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
                <Navigation className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">פרטי נסיעה {trip.trip_id}</h1>
                <p className="text-sm text-muted-foreground">מידע מפורט על הנסיעה והמסלול</p>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(trip.status) + " text-lg px-4 py-2"}>
            {getStatusInHebrew(trip.status)}
          </Badge>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Trip Information Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Trip Overview */}
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  פרטי נסיעה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">נקודת מוצא</div>
                      <div className="font-medium">{trip.origin_address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">יעד</div>
                      <div className="font-medium">{trip.destination_address}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{trip.distance_km}</div>
                    <div className="text-sm text-muted-foreground">ק"מ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{trip.estimated_duration_minutes}</div>
                    <div className="text-sm text-muted-foreground">דקות</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Information */}
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  זמנים
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">שעת התחלה מתוכננת</span>
                  <span className="font-medium">
                    {new Date(trip.planned_start_time).toLocaleString('he-IL')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">שעת סיום מתוכננת</span>
                  <span className="font-medium">
                    {new Date(trip.planned_end_time).toLocaleString('he-IL')}
                  </span>
                </div>
                {trip.actual_start_time && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">שעת התחלה בפועל</span>
                    <span className="font-medium text-green-600">
                      {new Date(trip.actual_start_time).toLocaleString('he-IL')}
                    </span>
                  </div>
                )}
                {trip.actual_end_time && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">שעת סיום בפועל</span>
                    <span className="font-medium text-green-600">
                      {new Date(trip.actual_end_time).toLocaleString('he-IL')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver Information */}
            {driver && (
              <Card className="enhanced-card">
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    פרטי נהג
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">שם הנהג</span>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-semibold"
                      onClick={() => navigate(`/driver-details/${driver.driver_id}`)}
                    >
                      {driver.driver_name}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">סטטוס</span>
                    <Badge variant={driver.status === 'available' ? 'default' : 'secondary'}>
                      {driver.status === 'available' ? 'זמין' : 
                       driver.status === 'busy' ? 'עסוק' : 
                       driver.status === 'on-trip' ? 'בנסיעה' :
                       driver.status === 'on-break' ? 'בהפסקה' : 'לא זמין'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">סוג רכב</span>
                    <span className="font-medium">{driver.vehicle?.type || 'לא מוגדר'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">קיבולת</span>
                    <span className="font-medium">{driver.vehicle?.capacity || 0} נוסעים</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Information */}
            {customer && (
              <Card className="enhanced-card">
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    פרטי לקוח
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">שם הלקוח</span>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-semibold"
                      onClick={() => navigate(`/customer-profile/${customer.customer_id}`)}
                    >
                      {customer.name}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">טלפון</span>
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">מספר נוסעים</span>
                    <span className="font-medium">{trip.num_passengers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">מחיר</span>
                    <span className="font-bold text-lg text-primary">₪{trip.price}</span>
                  </div>
                  {customer.vip_status && (
                    <div className="flex justify-center">
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        לקוח VIP
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Section */}
          <div className="xl:col-span-2">
            <Card className="enhanced-card h-full">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  מפת מסלול
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100vh-12rem)]">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <MapComponent 
                    ref={mapRef}
                    drivers={driver ? [driver] : []}
                    rideDetails={rideDetails}
                    showRouteMode={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
