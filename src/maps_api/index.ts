import { getPlaceId } from './reverseGeo';
import { getPlaceDetails, overallRating } from './placeDetails';

async function main() {
  const lat = 37.7749; // Latitudine di esempio
  const lng = -122.4194; // Longitudine di esempio

  const placeId = await getPlaceId(lat, lng);

  if (placeId) {
    await getPlaceDetails(placeId);
    // Stampa solo il rating complessivo per ciascun luogo
    if (overallRating !== null) {
      console.log(overallRating.toFixed(1)); // Stampa il rating con una cifra decimale
    }
  } else {
    console.log('Could not fetch place ID.');
  }
}

main();
