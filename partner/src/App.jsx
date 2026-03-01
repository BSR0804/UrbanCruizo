import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FleetDashboard from './pages/FleetDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col min-h-screen bg-background text-textPrimary antialiased">
                    <Toaster position="top-center" />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/fleet-dashboard" element={<FleetDashboard />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;

