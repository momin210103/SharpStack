/**
 * Convert relative image URL to absolute URL
 * @param {string} url - Image URL from API (e.g., "/uploads/posts/...")
 * @returns {string} - Absolute URL
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Get base URL from environment and remove /api suffix
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const baseUrl = apiBaseUrl.replace('/api', '');
  
  // Ensure url starts with /
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${cleanUrl}`;
};
