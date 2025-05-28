import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandAuth, products } from '../services/api';

interface BrandData {
  brand_id: number;
  brand_name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
}

interface DashboardStats {
  total_products: number;
  total_reviews: number;
  average_rating: number;
  recent_reviews: any[];
}

interface Product {
  product_id: number;
  product_name: string;
  product_category: string;
  description: string;
  average_rating: string;
  total_reviews: string;
  created_at: string;
}

const BrandDashboardPage: React.FC = () => {
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    product_category: '',
    description: '',
  });
  const [newProductFiles, setNewProductFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('brandToken');
    const storedBrandData = localStorage.getItem('brandData');
    
    if (!token || !storedBrandData) {
      navigate('/brand/login');
      return;
    }

    setBrandData(JSON.parse(storedBrandData));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const dashboardResponse = await brandAuth.dashboard();
      setDashboardStats(dashboardResponse.data);
      
      // Load brand products
      const productsResponse = await products.getBrandProducts();
      setBrandProducts(productsResponse.data.products || []);
      
    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createRes = await products.create(newProduct);
      const createdId = createRes.data.product?.product_id || createRes.data.product_id;
      // Upload media if any files selected
      if (newProductFiles.length > 0 && createdId) {
        try {
          await products.uploadMedia(createdId, newProductFiles);
        } catch (uploadErr: any) {
          console.error('Media upload error', uploadErr);
        }
      }
      setNewProduct({ product_name: '', product_category: '', description: '' });
      setNewProductFiles([]);
      loadDashboardData(); // Reload data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('brandToken');
    localStorage.removeItem('brandData');
    navigate('/brand/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {brandData?.brand_name} Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                {brandData?.is_verified ? '✅ Verified Brand' : '⏳ Pending Verification'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardStats.total_products}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Reviews</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardStats.total_reviews}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {dashboardStats.average_rating ? Number(dashboardStats.average_rating).toFixed(1) : '0.0'}⭐
              </p>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.product_name}
                      onChange={(e) => setNewProduct({...newProduct, product_name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      required
                      value={newProduct.product_category}
                      onChange={(e) => setNewProduct({...newProduct, product_category: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Media (images / pdf) optional</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf,video/*"
                    onChange={(e) => setNewProductFiles(e.target.files ? Array.from(e.target.files) : [])}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Create Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="px-6 py-4">
            {brandProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No products yet. Add your first product to get started!
              </p>
            ) : (
              <div className="space-y-4">
                {brandProducts.map((prod) => (
                  <div key={prod.product_id} className="border p-4 rounded mb-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{prod.product_name}</p>
                      <p className="text-sm text-gray-500">{prod.product_category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-indigo-700 text-sm">
                        Upload Media
                        <input
                          type="file"
                          multiple
                          accept="image/*,application/pdf,video/*"
                          hidden
                          onChange={async (e) => {
                            const files = e.target.files ? Array.from(e.target.files) : [];
                            if (files.length === 0) return;
                            try {
                              await products.uploadMedia(prod.product_id, files);
                              alert('Media uploaded');
                            } catch (err: any) {
                              alert('Upload failed');
                              console.error(err);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboardPage; 