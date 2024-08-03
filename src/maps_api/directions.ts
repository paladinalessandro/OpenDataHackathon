import { Client } from '@googlemaps/google-maps-services-js';

const apiKey = process.env.MAPS_API_KEY || ""; // hide key

export async function getTravelTime(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<number | null> {
  const client = new Client({});

  try {
    const response = await client.directions({
      params: {
        origin: { lat: originLat, lng: originLng },
        destination: { lat: destLat, lng: destLng },
        key: apiKey,
      },
      timeout: 1000, 
    });

    if (response.data.routes.length > 0 && response.data.routes[0].legs.length > 0) {
      const duration = response.data.routes[0].legs[0].duration.value; // Time in secs
      const durationInMinutes = Math.ceil(duration / 60); // time in mins
      return durationInMinutes;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
