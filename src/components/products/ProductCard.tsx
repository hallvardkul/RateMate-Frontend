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
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        );
      }
    }

    return stars;
  };

  return (
    <Link to={`/products/${product.product_id}/dashboard`} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        {/* image handling - backend may not supply */}
        {false ? (
          <img src="" alt="" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">{product.product_name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {renderRatingStars(parseFloat(product.average_rating))}
          </div>
          <p className="ml-2 text-sm text-gray-500">
            {product.total_reviews} {parseInt(product.total_reviews) === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        
        {product.brand_name && (
          <p className="mt-1 text-xs text-gray-500">Brand: {product.brand_name}</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard; 