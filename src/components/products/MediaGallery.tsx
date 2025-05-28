import React from 'react';
import { ProductMedia } from '../../hooks/useProductMedia';

interface Props {
  media: ProductMedia[];
}

const MediaGallery: React.FC<Props> = ({ media }) => {
  if (!media.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((m) => (
        <img
          key={m.media_id}
          src={m.file_url}
          alt="product media"
          className="w-full rounded-lg object-cover"
        />
      ))}
    </div>
  );
};

export default MediaGallery; 