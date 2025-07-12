/**
 * Generate a default avatar based on the first initial of username
 * @param {string} username - The username to generate avatar for
 * @param {number} size - Size of the avatar (default: 100)
 * @returns {string} Base64 encoded SVG avatar
 */
export function generateDefaultAvatar(username, size = 100) {
  const initial = username ? username[0].toUpperCase() : '?';
  
  // Color variations based on the first character
  const colors = [
    { bg: '#8B4513', bgEnd: '#A0522D', text: '#F4E4BC' }, // Brown
    { bg: '#2E8B57', bgEnd: '#3CB371', text: '#F0FFF0' }, // Green
    { bg: '#4682B4', bgEnd: '#5F9EA0', text: '#F0F8FF' }, // Blue
    { bg: '#8B008B', bgEnd: '#9370DB', text: '#FFF8DC' }, // Purple
    { bg: '#B22222', bgEnd: '#DC143C', text: '#FFF0F5' }, // Red
    { bg: '#FF8C00', bgEnd: '#FFA500', text: '#FFF8DC' }, // Orange
  ];
  
  const colorIndex = username ? username.charCodeAt(0) % colors.length : 0;
  const color = colors[colorIndex];
  
  const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color.bgEnd};stop-opacity:1" />
      </radialGradient>
    </defs>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 3}" fill="url(#bg)" stroke="#654321" stroke-width="3"/>
    <text x="${size/2}" y="${size/2 + size*0.15}" font-family="serif" font-size="${size*0.36}" font-weight="bold" 
          text-anchor="middle" fill="${color.text}" stroke="#654321" stroke-width="1">${initial}</text>
  </svg>`;
  
  // Convert SVG to base64
  const svgBytes = new TextEncoder().encode(svgContent);
  const svgBase64 = btoa(String.fromCharCode.apply(null, svgBytes));
  return `data:image/svg+xml;base64,${svgBase64}`;
}

/**
 * Get user's avatar URL or generate default
 * @param {object} user - User object with profile_picture and username
 * @param {number} size - Size of the avatar (default: 100)
 * @returns {string} Avatar URL or base64 SVG
 */
export function getUserAvatar(user, size = 100) {
  if (user?.profile_picture) {
    return user.profile_picture;
  }
  
  return generateDefaultAvatar(user?.username || user?.display_name || 'User', size);
}

/**
 * Convert file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 encoded file
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {object} Validation result with isValid and error message
 */
export function validateImageFile(file) {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Please use JPEG, PNG, GIF, or WebP.' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Maximum size is 2MB.' };
  }
  
  return { isValid: true };
}