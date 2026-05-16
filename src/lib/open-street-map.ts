export type OpenStreetMapDirectionsParams = {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
};

export function buildOpenStreetMapDirectionsUrl({
  originLatitude,
  originLongitude,
  destinationLatitude,
  destinationLongitude,
}: OpenStreetMapDirectionsParams) {
  const route = `${originLatitude},${originLongitude};${destinationLatitude},${destinationLongitude}`;
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(route)}`;
}
