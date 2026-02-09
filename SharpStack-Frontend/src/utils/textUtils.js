/**
 * Utility functions for text processing
 */

/**
 * Strips HTML tags from a string and returns plain text
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
export const stripHtmlTags = (html) => {
  if (!html) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * Truncates text to a specified length and adds ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Strips HTML tags and truncates the result
 * @param {string} html - HTML content to process
 * @param {number} maxLength - Maximum length for the plain text
 * @returns {string} Plain text excerpt
 */
export const getTextExcerpt = (html, maxLength = 150) => {
  const plainText = stripHtmlTags(html);
  return truncateText(plainText, maxLength);
};
