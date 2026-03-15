
import React, { Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { CashRegisterProvider } from '@/store/cashRegisterStore.jsx';
import { Toaster } from '@/components/ui/sonner';

// Core Contexts
import { AuthProvider } from '@/modules/core/contexts/AuthContext.jsx';
import { CompanyProvider } from '@/modules/core/contexts/CompanyContext.jsx';
import { BranchProvider } from '@/modules/core/contexts/BranchContext.jsx';
import { PermissionsProvider } from '@/modules/core/contexts/PermissionsContext.jsx';
import { EditorProvider } from '@/modules/core/contexts/EditorContext.jsx';

// Shared Components
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary.jsx';
import { ProtectedRoute } from '@/modules/shared/components/ProtectedRoute.jsx';
import { Layout } from '@/modules/shared/components/Layout.jsx';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';

// Pages
import LoginPage from '@/modules/auth/pages/LoginPage.jsx';
import RegisterPage from '@/modules/auth/pages/RegisterPage.jsx';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage.jsx';
import PosPage from '@/modules/pos/pages/PosPage.jsx';
import ProductsPage from '@/modules/products/pages/ProductsPage.jsx';
import InventoryPage from '@/modules/inventory/pages/InventoryPage.jsx';
import SalesPage from '@/modules/sales/pages/SalesPage.jsx';
import ReportsPage from '@/modules/reports/pages/ReportsPage.jsx';
import ConfigurationPage from '@/modules/configuration/pages/ConfigurationPage.jsx';
import SystemDiagnosticPage from '@/modules/configuration/pages/SystemDiagnosticPage.jsx';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <CompanyProvider>
              <BranchProvider>
                <PermissionsProvider>
                  <EditorProvider>
                    <CashRegisterProvider>
                    <ScrollToTop />
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Redirect root to dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        {/* Protected Routes wrapped in Layout */}
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Layout>
                              <DashboardPage />
                            </Layout>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/pos" element={
                          <ProtectedRoute>
                            <Layout>
                              <PosPage />
                            </Layout>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/products" element={
                          <ProtectedRoute>
                            <Layout>
                              <ProductsPage />
                            </Layout>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/inventory" element={
                          <ProtectedRoute>
                            <Layout>
                              <InventoryPage />
                            </Layout>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/sales" element={
                          <ProtectedRoute>
                            <Layout>
                              <SalesPage />
                            </Layout>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/reports" element={
                          <ProtectedRoute>
                            <Layout>
                              <ReportsPage />
                            </Layout>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/configuration" element={
                          <ProtectedRoute>
                            <Layout>
                              <ConfigurationPage />
                            </Layout>
                          </ProtectedRoute>
                        } />

                        <Route path="/diagnostic" element={
                          <ProtectedRoute>
                            <Layout>
                              <SystemDiagnosticPage />
                            </Layout>
                          </ProtectedRoute>
                        } />

                        {/* Legacy routes mapping to new structure */}
                        <Route path="/caja" element={<Navigate to="/pos" replace />} />
                        <Route path="/productos" element={<Navigate to="/products" replace />} />
                        <Route path="/inventario" element={<Navigate to="/inventory" replace />} />
                        <Route path="/reportes" element={<Navigate to="/reports" replace />} />
                        <Route path="/configuracion" element={<Navigate to="/configuration" replace />} />

                        {/* 404 Fallback - Redirect to dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Suspense>
                    <Toaster position="top-right" richColors />
                    </CashRegisterProvider>
                  </EditorProvider>
                </PermissionsProvider>
              </BranchProvider>
            </CompanyProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
