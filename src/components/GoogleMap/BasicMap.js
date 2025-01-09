import React from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const BasicMap = () => {
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=ZFHCVnFyheWlftX7p1rd"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default BasicMap;
