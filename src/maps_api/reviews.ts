import { getPlaceId } from './reverseGeo';
import { getPlaceDetails, overallRating } from './placeDetails';

export async function getRating(lat:number,lng:number):Promise<number>{
  const placeId = await getPlaceId(lat, lng);

  if (placeId) {
    await getPlaceDetails(placeId);
    // Stampa solo il rating complessivo per il luogo
    if (overallRating !== null) {
      return overallRating.toFixed(1) as unknown as number; // Stampa il rating con una cifra decimale
    }
  }
  return -1;
}
