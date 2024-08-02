import { Client } from '@googlemaps/google-maps-services-js';

const apiKey = 'AIzaSyCszTXCRzVkOftnnG4WJGJoKihWEK56_k4'; // Sostituisci con la tua chiave API di Google

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
      timeout: 1000, // tempo di timeout di 1 secondo
    });

    if (response.data.routes.length > 0 && response.data.routes[0].legs.length > 0) {
      const duration = response.data.routes[0].legs[0].duration.value; // Durata in secondi
      const durationInMinutes = Math.ceil(duration / 60); // Converti in minuti
      console.log(`Travel time from (${originLat}, ${originLng}) to (${destLat}, ${destLng}): ${durationInMinutes} minutes`);
      return durationInMinutes;
    } else {
      console.log('No route found between the given locations.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching travel time:', error);
    return null;
  }
}
