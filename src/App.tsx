import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  // Only redirect non-admins away from admin pages
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route 
      path="/" 
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin" 
      element={
        <ProtectedRoute adminOnly>
          <Admin />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element = {<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="harshits-notebook-theme" attribute="class">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;