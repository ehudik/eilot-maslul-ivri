import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Import all page components
import DriverMap from "./pages/DriverMap";
import TaskAssignment from "./pages/TaskAssignment";
import DriverManagement from "./pages/DriverManagement";
import Reports from "./pages/Reports";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import RequestRide from "./pages/RequestRide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Root layout component
const RootLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          <div className="h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <DriverMap />
      },
      {
        path: "/TaskAssignment",
        element: <TaskAssignment />
      },
      {
        path: "/DriverManagement",
        element: <DriverManagement />
      },
      {
        path: "/Reports",
        element: <Reports />
      },
      {
        path: "/PerformanceAnalytics",
        element: <PerformanceAnalytics />
      },
      {
        path: "/RequestRide",
        element: <RequestRide />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
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
