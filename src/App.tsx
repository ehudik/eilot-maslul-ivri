
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Import all page components
import DriverMap from "./pages/DriverMap";
import DriverManagement from "./pages/DriverManagement";
import Reports from "./pages/Reports";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import RequestRide from "./pages/RequestRide";
import TripControlCenter from "./pages/TripControlCenter";
import TripDetails from "./pages/TripDetails";
import CustomerProfile from "./pages/CustomerProfile";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// Root layout component with sidebar on the right
const RootLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden" dir="rtl">
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20 relative">
          {/* Sidebar trigger button - always visible */}
          <div className="fixed top-4 right-4 z-50">
            <SidebarTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg border border-primary/20" />
          </div>
          <div className="h-full w-full">
            <Outlet />
          </div>
        </main>
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
};

// Auth layout for login/register pages
const AuthLayout = () => {
  return (
    <div className="h-screen w-screen">
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/trip-control-center",
        element: <TripControlCenter />
      },
      {
        path: "/trip-details/:tripId",
        element: <TripDetails />
      },
      {
        path: "/customer-profile/:customerId",
        element: <CustomerProfile />
      },
      {
        path: "/DriverMap",
        element: <DriverMap />
      },
      {
        path: "/driver-map",
        element: <DriverMap />
      },
      {
        path: "/DriverManagement", 
        element: <DriverManagement />
      },
      {
        path: "/driver-management", 
        element: <DriverManagement />
      },
      {
        path: "/driver-details/:driverId",
        element: <DriverManagement />
      },
      {
        path: "/Reports",
        element: <Reports />
      },
      {
        path: "/reports",
        element: <Reports />
      },
      {
        path: "/PerformanceAnalytics",
        element: <PerformanceAnalytics />
      },
      {
        path: "/performance-analytics",
        element: <PerformanceAnalytics />
      },
      {
        path: "/RequestRide",
        element: <RequestRide />
      },
      {
        path: "/request-ride",
        element: <RequestRide />
      }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
