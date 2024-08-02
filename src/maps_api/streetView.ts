const apiKey = process.env.MAPS_API_KEY || ""; // Sostituisci con la tua chiave API di Google

export function getStreetViewImageUrl(lat: number, lng: number): string {
  const baseUrl = 'https://maps.googleapis.com/maps/api/streetview';
  const params = `?size=600x300&location=${lat},${lng}&key=${apiKey}`;
  return `${baseUrl}${params}`;
}
