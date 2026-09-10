import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { POSProvider } from './context/POSContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import ManufacturerLayout from './layouts/ManufacturerLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';

// Regulator / Admin pages
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import BatchDetails from './pages/BatchDetails';
import Scanner from './pages/Scanner';
import ExpiryAlerts from './pages/ExpiryAlerts';
import Returns from './pages/Returns';
import Logistics from './pages/Logistics';
import Destruction from './pages/Destruction';
import FraudDetection from './pages/FraudDetection';
import AuditTrail from './pages/AuditTrail';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';

// Manufacturer pages
import MfrDashboard from './pages/manufacturer/Dashboard';
import MfrBatches from './pages/manufacturer/MedicineBatches';
import MfrAddBatch from './pages/manufacturer/AddBatch';
import MfrQrGenerator from './pages/manufacturer/QrGenerator';
import MfrInventoryStock from './pages/manufacturer/InventoryStock';
import MfrDistribution from './pages/manufacturer/Distribution';
import MfrScanVerify from './pages/manufacturer/ScanVerify';
import MfrExpiryAlerts from './pages/manufacturer/ExpiryAlerts';
import MfrSalesActivity from './pages/manufacturer/SalesActivity';
import MfrReports from './pages/manufacturer/Reports';
import MfrNotifications from './pages/manufacturer/Notifications';
import MfrCompanyProfile from './pages/manufacturer/CompanyProfile';
import MfrSettings from './pages/manufacturer/Settings';

function App() {
  return (
    <AuthProvider>
      <POSProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Manufacturer Routes */}
            <Route path="/manufacturer" element={<ProtectedRoute allowedRoles={['manufacturer']} />}>
              <Route element={<ManufacturerLayout />}>
                <Route index element={<Navigate to="/manufacturer/dashboard" replace />} />
                <Route path="dashboard" element={<MfrDashboard />} />
                <Route path="batches" element={<MfrBatches />} />
                <Route path="add-batch" element={<MfrAddBatch />} />
                <Route path="qr-generator" element={<MfrQrGenerator />} />
                <Route path="inventory" element={<MfrInventoryStock />} />
                <Route path="distribution" element={<MfrDistribution />} />
                <Route path="scan-verify" element={<MfrScanVerify />} />
                <Route path="expiry-alerts" element={<MfrExpiryAlerts />} />
                <Route path="activity" element={<MfrSalesActivity />} />
                <Route path="reports" element={<MfrReports />} />
                <Route path="notifications" element={<MfrNotifications />} />
                <Route path="profile" element={<MfrCompanyProfile />} />
                <Route path="settings" element={<MfrSettings />} />
              </Route>
            </Route>

            {/* Distributor Routes */}
            <Route path="/distributor" element={<ProtectedRoute allowedRoles={['distributor']} />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/distributor/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="batches" element={<Batches />} />
                <Route path="batches/:id" element={<BatchDetails />} />
                <Route path="scanner" element={<Scanner />} />
                <Route path="expiry" element={<ExpiryAlerts />} />
                <Route path="returns" element={<Returns />} />
                <Route path="logistics" element={<Logistics />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Route>

            {/* Pharmacy Routes */}
            <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={['pharmacy']} />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/pharmacy/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="batches" element={<Batches />} />
                <Route path="batches/:id" element={<BatchDetails />} />
                <Route path="scanner" element={<Scanner />} />
                <Route path="expiry" element={<ExpiryAlerts />} />
                <Route path="returns" element={<Returns />} />
                <Route path="logistics" element={<Logistics />} />
                <Route path="billing" element={<Billing />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </POSProvider>
    </AuthProvider>
  );
}

export default App;
