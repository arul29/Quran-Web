/**
 * Qiblat Direction Calculator
 * Calculates the direction to Ka'bah (Mecca) from any location on Earth
 */

// Ka'bah coordinates (Mecca, Saudi Arabia)
const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export const radiansToDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate the qiblat direction from a given location
 * Uses the spherical law of cosines for accurate bearing calculation
 *
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {number} Qiblat direction in degrees (0-360, where 0 is North)
 */
export const calculateQiblatDirection = (userLat, userLon) => {
  const userLatRad = degreesToRadians(userLat);
  const userLonRad = degreesToRadians(userLon);
  const kaabaLatRad = degreesToRadians(KAABA_LATITUDE);
  const kaabaLonRad = degreesToRadians(KAABA_LONGITUDE);

  const lonDiff = kaabaLonRad - userLonRad;

  // Calculate bearing using the formula:
  // θ = atan2(sin(Δlong).cos(lat2), cos(lat1).sin(lat2) − sin(lat1).cos(lat2).cos(Δlong))
  const y = Math.sin(lonDiff) * Math.cos(kaabaLatRad);
  const x =
    Math.cos(userLatRad) * Math.sin(kaabaLatRad) -
    Math.sin(userLatRad) * Math.cos(kaabaLatRad) * Math.cos(lonDiff);

  let bearing = Math.atan2(y, x);
  bearing = radiansToDegrees(bearing);

  // Normalize to 0-360 degrees
  return (bearing + 360) % 360;
};

/**
 * Calculate the great circle distance between two points on Earth
 * Uses the Haversine formula
 *
 * @param {number} lat1 - First point latitude
 * @param {number} lon1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lon2 - Second point longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Calculate distance from user location to Ka'bah
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistanceToKaaba = (userLat, userLon) => {
  return calculateDistance(userLat, userLon, KAABA_LATITUDE, KAABA_LONGITUDE);
};

/**
 * Get cardinal direction name from degrees
 * @param {number} degrees - Direction in degrees (0-360)
 * @returns {string} Cardinal direction name
 */
export const getCardinalDirection = (degrees) => {
  const directions = [
    "Utara",
    "Timur Laut",
    "Timur",
    "Tenggara",
    "Selatan",
    "Barat Daya",
    "Barat",
    "Barat Laut",
  ];

  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * Format distance with appropriate unit
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} meter`;
  } else if (distanceKm < 100) {
    return `${distanceKm.toFixed(1)} km`;
  } else {
    return `${Math.round(distanceKm).toLocaleString("id-ID")} km`;
  }
};
