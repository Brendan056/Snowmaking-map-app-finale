import React, { useState, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ICONS = {
  snowGun: new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/snow.png",
    iconSize: [24, 24],
  }),
  gps: new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/gps-device.png",
    iconSize: [20, 20],
  }),
};

const INITIAL_COMPONENTS = [
  { id: "101", type: "snowGun", position: [50, 50] },
];

function convertGPSToMapCoords(lat, lng) {
  const latMin = 51.095;
  const latMax = 51.100;
  const lngMin = -113.576;
  const lngMax = -113.570;

  const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
  const y = ((latMax - lat) / (latMax - latMin)) * 100;

  return [y, x];
}

function GPSMarker({ onPlace }) {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const mapCoords = convertGPSToMapCoords(coords.latitude, coords.longitude);
          setPos(mapCoords);
        },
        (error) => {
          console.error("GPS error:", error);
        }
      );
    }
  }, []);

  if (!pos) return null;

  return (
    <Marker position={pos} icon={ICONS.gps}>
      <Popup>
        You are here.
        <br />
        <button onClick={() => onPlace(pos)}>Place Snow Gun</button>
      </Popup>
    </Marker>
  );
}

export default function App() {
  const [components, setComponents] = useState(INITIAL_COMPONENTS);

  const handlePlace = (pos) => {
    setComponents([...components, {
      id: `gun-${Date.now()}`,
      type: "snowGun",
      position: pos
    }]);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[50, 50]}
        zoom={2}
        crs={L.CRS.Simple}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[[0, 0], [100, 100]]}
      >
        <ImageOverlay
          url="/canyon-map.jpg"
          bounds={[[0, 0], [100, 100]]}
        />
        {components.map((item) => (
          <Marker
            key={item.id}
            position={item.position}
            icon={ICONS[item.type]}
          >
            <Popup>
              {item.type} — ID: {item.id}
            </Popup>
          </Marker>
        ))}
        <GPSMarker onPlace={handlePlace} />
      </MapContainer>
    </div>
  );
}
