import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminPage from './pages/AdminPage';
import HelpCenterPage from './pages/HelpCenterPage';
import RentalPolicyPage from './pages/RentalPolicyPage';

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
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/vehicles" element={<VehicleListingPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
                <Route path="/dealers/:id/vehicles" element={<DealerVehiclesPage />} />
                <Route path="/caravans" element={<CaravanListingPage />} />
                <Route path="/caravans/:id" element={<CaravanDetailsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/help-center" element={<HelpCenterPage />} />
                <Route path="/rental-policy" element={<RentalPolicyPage />} />
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
