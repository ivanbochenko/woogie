export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const deg2rad = (deg: number) => deg * (Math.PI/180)
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R * c) // Distance in km
}

export function dateShiftHours(d: Date, h: number) {
  return new Date(d.getTime() + 1000 * 60 * 60 * h);
}