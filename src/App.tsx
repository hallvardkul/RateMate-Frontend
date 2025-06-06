import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductDashboardPage from './pages/ProductDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BrandLoginPage from './pages/BrandLoginPage';
import BrandRegisterPage from './pages/BrandRegisterPage';
import BrandDashboardPage from './pages/BrandDashboardPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ApiTest from './components/ApiTest';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<ProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id/dashboard" element={<ProductDashboardPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requireAuth={false}>
                  <RegisterPage />
                </ProtectedRoute>
              } />

              {/* Brand routes */}
              <Route path="/brand/login" element={<BrandLoginPage />} />
              <Route path="/brand/register" element={<BrandRegisterPage />} />
              <Route path="/brand/dashboard" element={<BrandDashboardPage />} />

              {/* Protected routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Additional routes */}
              <Route path="/api-test" element={<ApiTest />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
