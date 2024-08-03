import { Client } from '@googlemaps/google-maps-services-js';

const apiKey = process.env.MAPS_API_KEY || ""; // hide key

export async function getPlaceId(lat: number, lng: number): Promise<string | null> {
  const client = new Client({});

  try {
    const response = await client.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: apiKey,
      },
      timeout: 1000,
    });

    if (response.data.results.length > 0) {
      const placeId = response.data.results[0].place_id;
      return placeId;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
