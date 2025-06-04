import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { Product } from '../../types';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else {
        stars.push(<StarOutlineIcon key={i} className="h-5 w-5 text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image */}
          <div className="flex flex-col">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">{product.description}</div>
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <div className="flex items-center">
                  {renderRatingStars(product.averageRating)}
                </div>
                <p className="ml-3 text-sm text-gray-500">
                  {product.totalReviews} reviews
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Category Ratings</h3>
              <div className="mt-4 space-y-4">
                {Object.entries(product.categoryRatings).map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <div className="flex items-center">
                      {renderRatingStars(rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 