import api from './api';

/**
 * Upload a media file along with metadata to the /media endpoint.
 * @param file The file to upload
 * @param meta Additional metadata (productId, userId)
 * @returns The uploaded media response data
 */
export async function uploadMedia(
  file: File,
  meta: { productId: number; userId: number }
): Promise<any> {
  const form = new FormData();
  form.append('file', file);
  form.append('meta', JSON.stringify({ ...meta, file_name: file.name }));

  const response = await api.post('/media', form);
  return response.data;
} 