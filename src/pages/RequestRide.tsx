
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle, MapPin, Clock, Users, Car, CheckCircle, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapComponent, MapComponentRef } from '@/components/MapComponent';
import { Driver, RideDetails } from '@/types/driver';
import { SidebarTrigger } from "@/components/ui/sidebar";

const RequestRidePage: React.FC = () => {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [requiredArrivalTime, setRequiredArrivalTime] = useState('');
  const [numPassengers, setNumPassengers] = useState('');
  const [clientName, setClientName] = useState('');
  const [requestResults, setRequestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriverForMap, setSelectedDriverForMap] = useState<Driver | null>(null);
  const [isAssigningRide, setIsAssigningRide] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  // Autocomplete states
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const mapRef = useRef<MapComponentRef>(null);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchAddressSuggestions = async (query: string, setSuggestions: (suggestions: string[]) => void) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/autocomplete_address?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchAddressSuggestions, 300),
    []
  );

  const handleOriginAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOriginAddress(value);
    debouncedFetchSuggestions(value, setOriginSuggestions);
    setShowOriginSuggestions(true);
  };

  const handleDestinationAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationAddress(value);
    debouncedFetchSuggestions(value, setDestinationSuggestions);
    setShowDestinationSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string, isOrigin: boolean) => {
    if (isOrigin) {
      setOriginAddress(suggestion);
      setShowOriginSuggestions(false);
    } else {
      setDestinationAddress(suggestion);
      setShowDestinationSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.address-input-container')) {
        setShowOriginSuggestions(false);
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/request_ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_address: originAddress,
          destination_address: destinationAddress,
          required_arrival_time: requiredArrivalTime,
          num_passengers: parseInt(numPassengers),
          client_name: clientName,
          is_recurring: false,
          recurring_days: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request ride');
      }

      const data = await response.json();
      setRequestResults(data);
    } catch (error) {
      console.error('Error requesting ride:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRide = async () => {
    if (!selectedDriverForMap) return;

    setIsAssigningRide(true);
    try {
      // Simulate API call to assign ride
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAssignmentSuccess(true);
      
      setTimeout(() => {
        setRequestResults(null);
        setAssignmentSuccess(false);
        setSelectedDriverForMap(null);
        // Reset form
        setOriginAddress('');
        setDestinationAddress('');
        setRequiredArrivalTime('');
        setNumPassengers('');
        setClientName('');
      }, 3000);
    } catch (error) {
      console.error('Error assigning ride:', error);
      setError('שגיאה בשיבוץ הנסיעה');
    } finally {
      setIsAssigningRide(false);
    }
  };

  useEffect(() => {
    if (requestResults && mapRef.current) {
      mapRef.current.fitBoundsToContent();
    }
  }, [requestResults]);

  if (assignmentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center" dir="rtl">
        <Card className="enhanced-card max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="bg-green-100 p-4 rounded-full mx-auto w-fit mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">הנסיעה נקבעה בהצלחה!</h2>
            <p className="text-muted-foreground mb-4">
              הנסיעה שובצה לנהג {selectedDriverForMap?.driver_name} ונוספה למערכת
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>מוצא:</strong> {originAddress}<br/>
                <strong>יעד:</strong> {destinationAddress}<br/>
                <strong>זמן הגעה:</strong> {requiredArrivalTime}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">בקשת נסיעה חדשה</h1>
          </div>
        </div>
      </header>

      <div className="p-8">
        {!requestResults ? (
          // Form Card
          <Card className="enhanced-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-right text-xl">פרטי הנסיעה</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origin Address */}
                <div className="address-input-container relative">
                  <Label htmlFor="origin" className="text-right block mb-2">כתובת מוצא</Label>
                  <Input
                    id="origin"
                    value={originAddress}
                    onChange={handleOriginAddressChange}
                    placeholder="הזן כתובת מוצא"
                    dir="rtl"
                    className="w-full modern-input"
                  />
                  {showOriginSuggestions && originSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {originSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-100 cursor-pointer text-right border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion, true)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Address */}
                <div className="address-input-container relative">
                  <Label htmlFor="destination" className="text-right block mb-2">כתובת יעד</Label>
                  <Input
                    id="destination"
                    value={destinationAddress}
                    onChange={handleDestinationAddressChange}
                    placeholder="הזן כתובת יעד"
                    dir="rtl"
                    className="w-full modern-input"
                  />
                  {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {destinationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-100 cursor-pointer text-right border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion, false)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTime" className="text-right block mb-2">שעת הגעה נדרשת</Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      value={requiredArrivalTime}
                      onChange={(e) => setRequiredArrivalTime(e.target.value)}
                      className="modern-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="passengers" className="text-right block mb-2">מספר נוסעים</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      value={numPassengers}
                      onChange={(e) => setNumPassengers(e.target.value)}
                      className="modern-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="clientName" className="text-right block mb-2">שם לקוח</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="הזן שם לקוח"
                    dir="rtl"
                    className="modern-input"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full enhanced-button h-12 text-lg"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="ml-2" />
                      מחפש נהגים זמינים...
                    </>
                  ) : (
                    <>
                      <Route className="h-5 w-5 ml-2" />
                      חפש נהגים ומסלול
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Results Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            {/* Driver Selection Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Summary Header */}
              <Card className="enhanced-card">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      {requestResults.ride_details?.estimated_travel_time_seconds 
                        ? `זמן נסיעה: ${Math.round(requestResults.ride_details.estimated_travel_time_seconds / 60)} דקות`
                        : 'טוען...'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {originAddress} ← {destinationAddress}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setRequestResults(null)}
                      className="enhanced-button"
                    >
                      בקשת נסיעה חדשה
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Available Drivers */}
              <Card className="enhanced-card">
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    נהגים זמינים ({requestResults.suggested_drivers?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {requestResults.suggested_drivers?.map((driver: Driver) => (
                    <div 
                      key={driver.driver_id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all enhanced-card
                        ${selectedDriverForMap?.driver_id === driver.driver_id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border/30 hover:border-primary/50 hover:shadow-sm'}`}
                      onClick={() => setSelectedDriverForMap(driver)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-semibold">{driver.driver_name}</span>
                        </div>
                        <Badge variant="outline" className="text-primary">
                          {driver.time_to_start_minutes} דקות
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>מרחק למוצא: {driver.distance_to_start_km} ק"מ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>זמן הגעה: {driver.time_to_start_minutes} דקות</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full mt-3 enhanced-button"
                        variant={selectedDriverForMap?.driver_id === driver.driver_id ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDriverForMap(driver);
                        }}
                      >
                        {selectedDriverForMap?.driver_id === driver.driver_id 
                          ? 'נהג נבחר' 
                          : 'בחר נהג'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Assign Ride Button */}
              {selectedDriverForMap && (
                <Card className="enhanced-card border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <Button 
                      onClick={handleAssignRide}
                      disabled={isAssigningRide}
                      className="w-full enhanced-button h-12 text-lg bg-primary hover:bg-primary/90"
                    >
                      {isAssigningRide ? (
                        <>
                          <LoadingSpinner size="sm" className="ml-2" />
                          משבץ נסיעה...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 ml-2" />
                          שבץ נסיעה לנהג {selectedDriverForMap.driver_name}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="enhanced-card h-full">
                <CardHeader>
                  <CardTitle className="text-right">מפת מסלול ונהגים</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-4rem)]">
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <MapComponent 
                      ref={mapRef}
                      rideDetails={requestResults.ride_details}
                      drivers={requestResults.suggested_drivers}
                      selectedDriver={selectedDriverForMap}
                      showRouteMode={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 mt-6 max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestRidePage;
