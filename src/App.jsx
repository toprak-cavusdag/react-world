import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';

export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetch('/countries.geo.json') // JSON dosyanı "public" klasörüne koymalısın
      .then((res) => res.json())
      .then((data) => setCountries(data.features))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  return (
    <div>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        polygonsData={countries}
        polygonCapColor={() => 'rgba(0, 255, 0, 0.6)'} // Yeşil ülke rengi
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'} // Yanları görünmez yap
        polygonStrokeColor={() => 'darkgreen'} // Koyu yeşil sınır rengi
        onPolygonClick={({ properties }) => setSelectedCountry(properties.name)} // Ülkeye tıklanınca seç
      />
      {selectedCountry && (
        <div style={{ position: "absolute", top: 20, left: 20, background: "white", padding: "10px", borderRadius: "5px" }}>
          <strong>Seçilen Ülke:</strong> {selectedCountry}
        </div>
      )}
    </div>
  );
}
