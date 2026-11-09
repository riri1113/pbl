import { Coordinates, SupportedLang } from '../types';

/**
 * Calculates great-circle distance between two points on the Earth (Haversine formula).
 * Returns distance in kilometers (km).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Nicely formats a distance value (e.g., "450m" if < 1km, or "2.4km").
 */
export function formatDistance(distanceKm: number | undefined): string {
  if (distanceKm === undefined || isNaN(distanceKm)) return '';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

/**
 * Default simulated coordinate in Nichinan (JR Nichinan Station & city center)
 * useful if geolocation is denied or during development/testing.
 */
export const DEFAULT_NICHINAN_COORDS: Coordinates = {
  lat: 31.6022,
  lng: 131.3783,
};
