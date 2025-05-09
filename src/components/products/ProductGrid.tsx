import React from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-lg h-[360px]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products yet — be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid; 