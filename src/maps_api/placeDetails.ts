import { Client } from '@googlemaps/google-maps-services-js';

const apiKey = process.env.MAPS_API_KEY || ""; // hide key

let overallRating: number | null = null; 

export async function getPlaceDetails(placeId: string): Promise<void> {
  const client = new Client({});

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ['rating'],
      },
      timeout: 1000, 
    });

    if (response.data.result) {
      overallRating = response.data.result.rating || null; 
    } else {
      overallRating = null;
    }
  } catch (error) {
    overallRating = null;
  }
}

export { overallRating }; // Esporto rating complessivo
