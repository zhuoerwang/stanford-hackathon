interface GeocodingResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  principalSubdivisionCode?: string;
  countryCode?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data: GeocodingResponse = await response.json();

    const city = data.city || data.locality || 'Unknown City';
    const state = data.principalSubdivisionCode?.replace('US-', '') || data.principalSubdivision || '';

    if (state) {
      return `${city}, ${state}`;
    }
    return city;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}

export function getCurrentLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await reverseGeocode(latitude, longitude);
          resolve(location);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
}
