import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="batches" element={<Batches />} />
          <Route path="batches/:id" element={<BatchDetails />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="expiry" element={<ExpiryAlerts />} />
          <Route path="returns" element={<Returns />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="destruction" element={<Destruction />} />
          <Route path="fraud" element={<FraudDetection />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;