import { Client } from '@googlemaps/google-maps-services-js';

const apiKey = '<YOUR_KEY>'; // Sostituisci con la tua chiave API di Google

let overallRating: number | null = null; // Variabile per memorizzare il rating complessivo

export async function getPlaceDetails(placeId: string): Promise<void> {
  const client = new Client({});

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ['rating'], // Ottieni solo il rating complessivo
      },
      timeout: 1000, // tempo di timeout di 1 secondo
    });

    if (response.data.result) {
      overallRating = response.data.result.rating || null; // Memorizza il rating complessivo nella variabile
      console.log(`Overall rating for ${placeId}: ${overallRating}`);
    } else {
      console.log(`No details found for the place ID: ${placeId}`);
      overallRating = null;
    }
  } catch (error) {
    console.error(`Error fetching place details for ${placeId}:`, error);
    overallRating = null;
  }
}

export { overallRating }; // Esporta la variabile del rating complessivo
