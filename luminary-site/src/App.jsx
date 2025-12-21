// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './components/Login';
import HomeDashboard from './components/HomeDashboard';

// Pages
import Operations from './components/Operations';
import Network from './components/Network';
import SectionPage from './components/SectionPage';
import ClientHub from './components/ClientHub';
import LabourSection from './components/LabourSection';
import IndustrialOperations from './components/IndustrialOperations'; // <--- NEW IMPORT
import MailHelper from './components/MailHelper'; // <--- NEW IMPORT
import Advisement from './components/Advisement'; // <--- NEW IMPORT

// Tools
import InvoiceGenerator from './components/InvoiceGenerator';
import LedgerDashboard from './components/LedgerDashboard';
import ChallanManager from './components/ChallanManager';
import QuotationBuilder from './components/QuotationBuilder';

// Specialized Invoices (NEW IMPORTS)
import InvoiceLVFoods from './components/invoices/InvoiceLVFoods';
import InvoiceSrikar from './components/invoices/InvoiceSrikar';
import InvoiceRutam from './components/invoices/InvoiceRutam';
import InvoiceHatsun from './components/invoices/InvoiceHatsun';
import InvoiceJVS from './components/invoices/InvoiceJVS';
import InvoiceJK from './components/invoices/InvoiceJK';

// ... (existing code)


// ... (existing code)

const translations = {
  en: {
    heroTitle: "Luminary",
    heroSubtitle: "Industrial Biomass & Firewood",
    readMore: "View Network Map",
  },
  // ... other languages
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

function App() {
  const [language, setLanguage] = useState('en');
  const currentText = translations[language] || translations['en'];

  return (
    <Router>
      <AuthProvider>
        <div className="font-sans antialiased text-stone-900 bg-[#FAF9F6] min-h-screen">
          <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

          <Navbar currentLang={language} onLanguageChange={setLanguage} />

          <Routes>
            <Route path="/login" element={<Login />} />

            {/* 1. HOME: Hero + Recent Activity Only */}
            <Route path="/" element={
              <div className="animate-fade-in">
                <Hero text={currentText} />
                <HomeDashboard />
              </div>
            } />

            {/* 2. NETWORK & CLIENTS */}
            <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />

            {/* SPECIAL ROUTE: Labour Dashboard (Must be before generic /:type) */}
            <Route path="/network/labour" element={<ProtectedRoute><LabourSection /></ProtectedRoute>} />
            <Route path="/network/operations" element={<ProtectedRoute><IndustrialOperations /></ProtectedRoute>} />

            {/* Generic Sector Page (Operations, etc.) */}
            <Route path="/network/:type" element={<ProtectedRoute><SectionPage /></ProtectedRoute>} />
            <Route path="/company/:id" element={<ProtectedRoute><ClientHub /></ProtectedRoute>} />

            {/* 3. TOOLS HUB */}
            <Route path="/operations" element={<ProtectedRoute><Operations /></ProtectedRoute>} />

            {/* --- INVOICING SUITE --- */}
            {/* Specialized Client Templates */}
            <Route path="/invoice/lv-foods" element={<ProtectedRoute><InvoiceLVFoods /></ProtectedRoute>} />
            <Route path="/invoice/srikar" element={<ProtectedRoute><InvoiceSrikar /></ProtectedRoute>} />
            <Route path="/invoice/rutam" element={<ProtectedRoute><InvoiceRutam /></ProtectedRoute>} />

            {/* Industrial Operations Invoices */}
            <Route path="/invoice/hatsun" element={<ProtectedRoute><InvoiceHatsun /></ProtectedRoute>} />
            <Route path="/invoice/jvs" element={<ProtectedRoute><InvoiceJVS /></ProtectedRoute>} />
            <Route path="/invoice/jk" element={<ProtectedRoute><InvoiceJK /></ProtectedRoute>} />

            {/* Generic Invoice Generator */}
            <Route path="/invoice" element={<ProtectedRoute><InvoiceGenerator onExit={() => window.history.back()} /></ProtectedRoute>} />

            {/* Other Tools */}
            <Route path="/ledger" element={<ProtectedRoute><LedgerDashboard onExit={() => window.history.back()} /></ProtectedRoute>} />
            <Route path="/ledger/:clientId" element={<ProtectedRoute><LedgerDashboard onExit={() => window.history.back()} /></ProtectedRoute>} />
            <Route path="/challan" element={<ProtectedRoute><ChallanManager onExit={() => window.history.back()} /></ProtectedRoute>} />
            <Route path="/quotation" element={<ProtectedRoute><QuotationBuilder onExit={() => window.history.back()} /></ProtectedRoute>} />
            <Route path="/mail-helper" element={<ProtectedRoute><MailHelper /></ProtectedRoute>} />
            <Route path="/advisement" element={<ProtectedRoute><Advisement /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;