import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';

export function RouteComponent({ start, end }) {
  const [routePoints, setRoutePoints] = useState([]);

  useEffect(() => {
    if (start && end) {
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/` +
            `${start.lng},${start.lat};${end[1]},${end[0]}` +
            `?overview=full&geometries=geojson`
          );
          const data = await response.json();
          
          if (data.routes && data.routes[0]) {
            const points = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRoutePoints(points);
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };
      fetchRoute();
    }
  }, [start, end]);

  return routePoints.length > 0 ? (
    <Polyline 
      positions={routePoints}
      color="blue"
      weight={4}
      opacity={0.7}
    />
  ) : null;
}