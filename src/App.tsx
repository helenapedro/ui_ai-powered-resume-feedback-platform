import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import FeaturedPost from "./pages/FeaturedPost";
import MyResumes from "./pages/MyResumes";
import Upload from "./pages/Upload";
import ResumeDetails from "./pages/ResumeDetails";
import SharedResume from "./pages/SharedResume";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <Routes>
                  <Route path="/" element={<Auth />} />
                  <Route path="/about" element={<Navigate to="/#about" replace />} />
                  <Route path="/featured" element={<FeaturedPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/share/:token" element={<SharedResume />} />
                  <Route
                    path="/my-resumes"
                    element={
                      <ProtectedRoute>
                        <MyResumes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <Upload />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/resume/:id"
                    element={
                      <ProtectedRoute>
                        <ResumeDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
