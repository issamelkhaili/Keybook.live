/**
 * Generate a license key for a product
 * @param {string} productId - The product ID
 * @param {string} customerEmail - The customer's email
 * @returns {string} The generated license key
 */
function generateLicenseKey(productId, customerEmail) {
  // Create a timestamp part
  const timestamp = Date.now().toString(36).toUpperCase();
  
  // Create a product identifier part (take first 4 chars)
  const productPart = productId.substring(0, 4).toUpperCase();
  
  // Create a customer part from email (take first 4 chars)
  // In a real implementation, this should be more sophisticated
  const emailPart = customerEmail
    .split('@')[0]  // Take part before @
    .substring(0, 4)
    .toUpperCase();
  
  // Generate random segments (4 groups of 4 characters)
  const segments = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omitting confusing chars like 0/O, 1/I
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      segment += chars[randomIndex];
    }
    segments.push(segment);
  }
  
  // Combine all parts into a license key with format:
  // XXXX-XXXX-XXXX-XXXX-XXXX
  const licenseKey = [
    productPart,
    emailPart,
    ...segments.slice(0, 3)
  ].join('-');
  
  return licenseKey;
}

/**
 * Verify a license key (placeholder for future implementation)
 * @param {string} licenseKey - The license key to verify
 * @param {string} productId - The product ID
 * @param {string} customerEmail - The customer's email
 * @returns {boolean} Whether the license key is valid
 */
function verifyLicenseKey(licenseKey, productId, customerEmail) {
  // In a real implementation, this would validate the license key
  // For now, we'll just do a simple check on format
  
  // Check if the license key has the correct format
  const keyPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if (!keyPattern.test(licenseKey)) {
    return false;
  }
  
  // In a production system, we would check against a database of valid licenses
  // or validate using cryptographic means
  
  return true;
}

module.exports = {
  generateLicenseKey,
  verifyLicenseKey
}; 