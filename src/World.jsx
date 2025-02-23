import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import * as d3 from "d3-geo";
import * as topojson from "topojson-client";

// Dünya yüzeyi için harita
const EARTH_TEXTURE = "https://upload.wikimedia.org/wikipedia/commons/8/80/Earth_Western_Hemisphere_transparent_background.png";
const WORLD_MAP_JSON = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 🌍 Dünya bileşeni
const Earth = () => {
  const texture = useTexture(EARTH_TEXTURE);
  return (
    <Sphere args={[1, 64, 64]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
};

export default function World() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    async function loadCountries() {
      const response = await fetch(WORLD_MAP_JSON);
      const worldData = await response.json();
      const geoJson = topojson.feature(worldData, worldData.objects.countries);
      
      // Ülke merkez koordinatlarını hesapla
      const projection = d3.geoOrthographic().scale(100).translate([0, 0]);
      const countryCoords = geoJson.features.map((feature) => {
        const centroid = d3.geoCentroid(feature);
        return {
          name: feature.properties.name || "Bilinmeyen",
          position: latLonTo3D(centroid[0], centroid[1]),
        };
      });
      setCountries(countryCoords);
    }
    loadCountries();
  }, []);

  const latLonTo3D = (lat, lon, radius = 1.01) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return [
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ];
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} />

        {/* Dünya Modeli */}
        <Earth />

        {/* Ülkeler */}
        {countries.map((country, index) => (
          <mesh
            key={index}
            position={country.position}
            onClick={() => setSelectedCountry(country)}
          >
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="red" />
          </mesh>
        ))}

        <OrbitControls enableZoom={false} />
      </Canvas>

      {selectedCountry && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: "white",
            padding: 10,
            color: "red",
            borderRadius: 5,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <h3 style={{color: "black"}}>{selectedCountry.name}</h3>
          <button onClick={() => setSelectedCountry(null)}>Kapat</button>
        </div>
      )}
    </div>
  );
}
