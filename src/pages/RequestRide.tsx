import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapComponent, MapComponentRef } from '@/components/MapComponent';
import { Driver, RideDetails } from '@/types/driver';

const RequestRidePage: React.FC = () => {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [requiredArrivalTime, setRequiredArrivalTime] = useState('');
  const [numPassengers, setNumPassengers] = useState('');
  const [clientName, setClientName] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [requestResults, setRequestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriverForMap, setSelectedDriverForMap] = useState<Driver | null>(null);

  // Add these new states for autocomplete
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const mapRef = useRef<MapComponentRef>(null);

  // Debounce function to limit API calls
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch address suggestions
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

  // Debounced version of fetchAddressSuggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchAddressSuggestions, 300),
    []
  );

  // Handle origin address input changes
  const handleOriginAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOriginAddress(value);
    debouncedFetchSuggestions(value, setOriginSuggestions);
    setShowOriginSuggestions(true);
  };

  // Handle destination address input changes
  const handleDestinationAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationAddress(value);
    debouncedFetchSuggestions(value, setDestinationSuggestions);
    setShowDestinationSuggestions(true);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string, isOrigin: boolean) => {
    if (isOrigin) {
      setOriginAddress(suggestion);
      setShowOriginSuggestions(false);
    } else {
      setDestinationAddress(suggestion);
      setShowDestinationSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
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
          is_recurring: isRecurring,
          recurring_days: recurringDays,
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

  // Add useEffect for map bounds
  useEffect(() => {
    if (requestResults && mapRef.current) {
      mapRef.current.fitBoundsToContent();
    }
  }, [requestResults]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Form Card - Only show when no results */}
      {!requestResults && (
        <Card>
          <CardHeader>
            <CardTitle>בקשת נסיעה חדשה</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Origin Address with Autocomplete */}
              <div className="address-input-container relative">
                <Label htmlFor="origin">כתובת מוצא</Label>
                <Input
                  id="origin"
                  value={originAddress}
                  onChange={handleOriginAddressChange}
                  placeholder="הזן כתובת מוצא"
                  dir="rtl"
                  className="w-full"
                />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {originSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-right"
                        onClick={() => handleSuggestionClick(suggestion, true)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Address with Autocomplete */}
              <div className="address-input-container relative">
                <Label htmlFor="destination">כתובת יעד</Label>
                <Input
                  id="destination"
                  value={destinationAddress}
                  onChange={handleDestinationAddressChange}
                  placeholder="הזן כתובת יעד"
                  dir="rtl"
                  className="w-full"
                />
                {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {destinationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-right"
                        onClick={() => handleSuggestionClick(suggestion, false)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="arrivalTime">שעת הגעה נדרשת</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={requiredArrivalTime}
                  onChange={(e) => setRequiredArrivalTime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="passengers">מספר נוסעים</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  value={numPassengers}
                  onChange={(e) => setNumPassengers(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="clientName">שם לקוח</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="הזן שם לקוח"
                  dir="rtl"
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'שולח...' : 'שלח בקשה'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {requestResults && (
        <>
          {/* Summary Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-border/30">
            <div className="flex justify-between items-center">
              <div className="text-right">
                <h2 className="text-lg font-semibold">
                  {requestResults.ride_details?.estimated_travel_time_seconds 
                    ? `זמן נסיעה משוער: ${Math.round(requestResults.ride_details.estimated_travel_time_seconds / 60)} דקות`
                    : 'טוען...'}
                </h2>
                <p className="text-muted-foreground">
                  {originAddress} → {destinationAddress}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setRequestResults(null)}
              >
                בקשת נסיעה חדשה
              </Button>
            </div>
          </div>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>מפת מסלול</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-md">
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

          {/* Drivers List */}
          <Card>
            <CardHeader>
              <CardTitle>נהגים זמינים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requestResults.suggested_drivers?.map((driver: Driver) => (
                  <div 
                    key={driver.driver_id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedDriverForMap?.driver_id === driver.driver_id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/30 hover:border-primary/50'}`}
                    onClick={() => setSelectedDriverForMap(driver)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{driver.driver_name}</span>
                      </div>
                      <Badge variant="outline" className="text-primary">
                        {driver.time_to_start_minutes} דקות
                      </Badge>
                    </div>
                    
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>מרחק למוצא: {driver.distance_to_start_km} ק"מ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>זמן הגעה משוער: {driver.time_to_start_minutes} דקות</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-3"
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
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default RequestRidePage;
