import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CssBaseline } from "@mui/material";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";
import CreateExpediente from "./pages/CreateExpediente";
import ExpedienteDetail from "./pages/ExpedienteDetail";
import Reportes from "./pages/Reportes";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-expediente"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateExpediente />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expedientes/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ExpedienteDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Reportes />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
