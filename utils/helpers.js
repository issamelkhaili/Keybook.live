/**
 * Generate a UUID v4
 * @returns {string} A UUID v4 string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Format a price as a currency string
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted price string
 */
function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(price);
}

/**
 * Format a date as a string
 * @param {string|Date} date - The date to format
 * @param {boolean} includeTime - Whether to include the time
 * @returns {string} Formatted date string
 */
function formatDate(date, includeTime = false) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Truncate a string to a maximum length
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
function truncateString(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

module.exports = {
  generateUUID,
  formatPrice,
  formatDate,
  truncateString
}; 