import { useParams } from 'react-router-dom';
import MediaGallery from '../components/products/MediaGallery';
import { useProductMedia } from '../hooks/useProductMedia';
import { useProducts } from '../hooks/useProducts';
import { ProductWithStats as Product } from '../types/Product';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';

export default function ProductDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const product: Product | undefined = products.find(p => p.product_id.toString() === id);

  const { media, loading: mediaLoading } = useProductMedia(id);

  const { user } = useAuth();
  const {
    reviews,
    page,
    totalPages,
    loading: reviewsLoading,
    setPage,
    addReview,
  } = useReviews();

  if (!product) return <p className="p-8">Product not found.</p>;

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold">{product.product_name}</h1>

      {mediaLoading ? <p>Loading media…</p> : <MediaGallery media={media} />}

      <p className="mt-6">{product.description}</p>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        {user && (
          <ReviewForm productId={product.product_id} onSubmit={addReview} />
        )}
        {reviewsLoading ? (
          <p>Loading reviews…</p>
        ) : (
          <ReviewList
            reviews={reviews}
            total={reviews.length}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
} 