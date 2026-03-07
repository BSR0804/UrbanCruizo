import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VehicleListingPage from './pages/VehicleListingPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import CaravanListingPage from './pages/CaravanListingPage';
import CaravanDetailsPage from './pages/CaravanDetailsPage';
import DealerVehiclesPage from './pages/DealerVehiclesPage';
import DashboardPage from './pages/DashboardPage';
import DealerDashboard from './pages/DealerDashboard';
import AdminPage from './pages/AdminPage';
import HelpCenterPage from './pages/HelpCenterPage';
import RentalPolicyPage from './pages/RentalPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PartnerLanding from './pages/PartnerLanding';
import DestinationGateway from './pages/DestinationGateway';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return <Navigate to="/destination-gateway" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CityProvider>
          <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Toaster position="top-center" />
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/vehicles" element={<VehicleListingPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
                <Route path="/dealers/:id/vehicles" element={<DealerVehiclesPage />} />
                <Route path="/caravans" element={<ProtectedRoute><CaravanListingPage /></ProtectedRoute>} />
                <Route path="/caravans/:id" element={<ProtectedRoute><CaravanDetailsPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/partner" element={<PartnerLanding />} />
                <Route path="/dealer/dashboard" element={<DealerDashboard />} />
                <Route path="/destination-gateway" element={<DestinationGateway />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/help-center" element={<HelpCenterPage />} />
                <Route path="/rental-policy" element={<RentalPolicyPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
