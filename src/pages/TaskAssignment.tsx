import React, { useState, useRef, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ClipboardList, Zap, Users, Route, MapPin, Clock, AlertCircle } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in Next.js
const iconUrl = '/images/marker-icon.png';
const iconShadowUrl = '/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Task {
    id: string;
    address: string;
    service_duration_minutes: number;
}

interface Driver {
    id: string;
    name: string;
    start_address: string;
    end_address?: string;
    max_daily_hours: number;
    is_available: boolean;
    current_work_hours_today?: number;
}

interface OptimizationResult {
    drivers_assigned_routes: Array<{
        driver_id: string;
        driver_name: string;
        route_polyline_coords: Array<[number, number]>;
        assigned_task_ids_sequence: string[];
        total_distance_km: number;
        total_duration_minutes: number;
    }>;
    unassigned_task_ids: string[];
}

const TaskAssignment = () => {
    // State management
    const [tasksInput, setTasksInput] = useState("");
    const [driversInput, setDriversInput] = useState("");
    const [maxWorkHours, setMaxWorkHours] = useState(8);
    const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationError, setOptimizationError] = useState<string | null>(null);
    
    // Map reference
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Example JSON for placeholders
    const exampleTasksJson = `[
  {
    "id": "task1",
    "address": "רחוב דיזנגוף 100, תל אביב",
    "service_duration_minutes": 15
  },
  {
    "id": "task2",
    "address": "רחוב אלנבי 50, תל אביב",
    "service_duration_minutes": 20
  }
]`;

    const exampleDriversJson = `[
  {
    "id": "driverA",
    "name": "נהג א'",
    "start_address": "רחוב דיזנגוף 100, תל אביב",
    "end_address": "רחוב דיזנגוף 100, תל אביב",
    "max_daily_hours": 8,
    "is_available": true
  },
  {
    "id": "driverB",
    "name": "נהג ב'",
    "start_address": "רחוב יפו 200, ירושלים",
    "end_address": "רחוב יפו 200, ירושלים",
    "max_daily_hours": 8,
    "is_available": true
  }
]`;

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [31.5, 34.8], // Center of Israel
                zoom: 8,
                zoomControl: true
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Update map when optimization results change
    useEffect(() => {
        if (!mapRef.current || !optimizationResults) return;

        // Clear existing layers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                mapRef.current?.removeLayer(layer);
            }
        });

        const allLayers: L.Layer[] = [];
        const colors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c']; // Blue, Green, Red, Purple, Orange

        optimizationResults.drivers_assigned_routes.forEach((route, index) => {
            const color = colors[index % colors.length];
            
            // Draw route polyline
            if (route.route_polyline_coords.length > 1) {
                const polyline = L.polyline(route.route_polyline_coords, {
                    color: color,
                    weight: 5,
                    opacity: 0.7
                }).addTo(mapRef.current!);
                allLayers.push(polyline);

                // Add markers for each point in the route
                route.route_polyline_coords.forEach((coord, pointIndex) => {
                    const marker = L.marker(coord).addTo(mapRef.current!);
                    if (pointIndex === 0) {
                        marker.bindPopup(`נהג: ${route.driver_name} (התחלה)`);
                    } else if (pointIndex === route.route_polyline_coords.length - 1) {
                        marker.bindPopup(`נהג: ${route.driver_name} (סיום)`);
                    }
                    allLayers.push(marker);
                });
            }
        });

        // Fit map to show all routes
        if (allLayers.length > 0) {
            const group = L.featureGroup(allLayers);
            mapRef.current.fitBounds(group.getBounds().pad(0.1));
        }
    }, [optimizationResults]);

    const handleOptimizeSchedule = async () => {
        setIsOptimizing(true);
        setOptimizationError(null);

        try {
            // Parse input JSON
            const tasks = JSON.parse(tasksInput || exampleTasksJson);
            const drivers = JSON.parse(driversInput || exampleDriversJson);

            // Call backend API
            const response = await fetch('http://localhost:5000/api/optimize_schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks, drivers }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'שגיאה בתקשורת עם השרת');
            }

            const data = await response.json();
            setOptimizationResults(data);
        } catch (error) {
            console.error('Optimization error:', error);
            setOptimizationError(error instanceof Error ? error.message : 'שגיאה לא צפויה');
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            <header className="border-b border-border/30 p-6 bg-card/50 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-6">
                    <SidebarTrigger className="enhanced-button" />
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl shadow-lg">
                            <ClipboardList className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">שיבוץ משימות</h1>
                            <p className="text-muted-foreground mt-1">אופטימיזציה חכמה של מסלולי נהגים</p>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="flex h-[calc(100vh-120px)] gap-6 p-6">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Input Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        {/* Tasks Input */}
                        <Card className="enhanced-card">
                            <CardHeader className="bg-gradient-to-l from-blue-50 to-transparent border-b border-border/30">
                                <CardTitle className="text-right flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <ClipboardList className="h-5 w-5 text-blue-600" />
                                    </div>
                                    הזנת משימות
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-3">
                                    <Label className="text-right block font-semibold">רשימת משימות (JSON)</Label>
                                    <Textarea
                                        value={tasksInput}
                                        onChange={(e) => setTasksInput(e.target.value)}
                                        placeholder={exampleTasksJson}
                                        className="modern-input min-h-[200px] text-right font-mono text-sm resize-none"
                                        dir="rtl"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Drivers Input */}
                        <Card className="enhanced-card">
                            <CardHeader className="bg-gradient-to-l from-green-50 to-transparent border-b border-border/30">
                                <CardTitle className="text-right flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Users className="h-5 w-5 text-green-600" />
                                    </div>
                                    הזנת נהגים
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-3">
                                    <Label className="text-right block font-semibold">רשימת נהגים (JSON)</Label>
                                    <Textarea
                                        value={driversInput}
                                        onChange={(e) => setDriversInput(e.target.value)}
                                        placeholder={exampleDriversJson}
                                        className="modern-input min-h-[200px] text-right font-mono text-sm resize-none"
                                        dir="rtl"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Optimization Button */}
                    <div className="flex justify-center">
                        <Button 
                            onClick={handleOptimizeSchedule}
                            disabled={isOptimizing}
                            className="enhanced-button w-full max-w-md bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg py-3"
                            size="lg"
                        >
                            {isOptimizing ? (
                                <>
                                    <LoadingSpinner size="sm" className="ml-2" />
                                    מבצע שיבוץ אופטימלי...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-5 w-5 ml-2" />
                                    בצע שיבוץ אופטימלי
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Error Display */}
                    {optimizationError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-red-600">{optimizationError}</p>
                        </div>
                    )}

                    {/* Results Section */}
                    {optimizationResults && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                            {/* Map Display */}
                            <Card className="enhanced-card">
                                <CardHeader className="bg-gradient-to-l from-purple-50 to-transparent border-b border-border/30">
                                    <CardTitle className="text-right flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <MapPin className="h-5 w-5 text-purple-600" />
                                        </div>
                                        מפת מסלולים מאופטמים
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-[400px] p-0">
                                    <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
                                </CardContent>
                            </Card>

                            {/* Assignment Summary */}
                            <Card className="enhanced-card">
                                <CardHeader className="bg-gradient-to-l from-orange-50 to-transparent border-b border-border/30">
                                    <CardTitle className="text-right flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <Route className="h-5 w-5 text-orange-600" />
                                        </div>
                                        סיכום שיבוץ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg text-right border-b border-border/30 pb-2">פירוט לפי נהגים:</h4>
                                        {optimizationResults.drivers_assigned_routes.map((route, index) => (
                                            <div key={index} className="enhanced-card p-4 space-y-3 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                                                <div className="flex justify-between items-center">
                                                    <Badge variant="outline" className="rounded-full border-primary/50 text-primary font-semibold">
                                                        {route.driver_id}
                                                    </Badge>
                                                    <h5 className="font-bold text-lg">{route.driver_name}</h5>
                                                </div>
                                                <div className="text-sm text-muted-foreground text-right bg-muted/30 p-3 rounded-lg">
                                                    <div className="font-semibold mb-2">משימות מוקצות:</div>
                                                    {route.assigned_task_ids_sequence.join(' → ')}
                                                </div>
                                                <div className="flex justify-between text-sm bg-gradient-to-l from-primary/5 to-transparent p-3 rounded-lg">
                                                    <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{route.total_duration_minutes} דקות</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{route.total_distance_km} ק"מ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {optimizationResults.unassigned_task_ids.length > 0 && (
                                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <h5 className="font-semibold text-yellow-800 mb-2">משימות שלא שובצו:</h5>
                                                <div className="text-sm text-yellow-700">
                                                    {optimizationResults.unassigned_task_ids.join(', ')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskAssignment;
