import React from 'react';
import { Link } from 'react-router-dom';
import { ProductWithStats as Product } from '../../types/Product';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const renderRatingStars = (rating: number = 0) => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-amber-400" aria-hidden="true" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-amber-400" aria-hidden="true" />);
      } else {
        stars.push(<StarOutlineIcon key={i} className="h-4 w-4 text-amber-400" aria-hidden="true" />);
      }
    }

    return stars;
  };

  const average = parseFloat(product.average_rating);

  return (
    <Link to={`/products/${product.product_id}/dashboard`} className="group block">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="aspect-w-1 aspect-h-1 w-full bg-slate-100">
          {/* image placeholder */}
          <div className="h-full w-full flex items-center justify-center text-slate-400">
            No image
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:underline">
            {product.product_name}
          </h3>
          {product.description && (
            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{product.description}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderRatingStars(average)}
            </div>
            <p className="text-xs text-slate-500">
              {product.total_reviews} {parseInt(product.total_reviews) === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {product.brand_name && (
            <p className="mt-2 text-xs text-slate-500">Brand: {product.brand_name}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 