import { Client } from '@googlemaps/google-maps-services-js';

const apiKey = '<YOUR_KEY>'; // Sostituisci con la tua chiave API di Google

export async function getPlaceId(lat: number, lng: number): Promise<string | null> {
  const client = new Client({});

  try {
    const response = await client.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: apiKey,
      },
      timeout: 1000, // tempo di timeout di 1 secondo
    });

    if (response.data.results.length > 0) {
      const placeId = response.data.results[0].place_id;
      console.log(`Place ID found: ${placeId}`); // Log del place ID trovato
      return placeId;
    } else {
      console.log('No place ID found for the given coordinates.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching place ID:', error);
    return null;
  }
}
