import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Territory {
    id: number;
    name: string;
    description: string;
    polygon: any; // GeoJSON coordinates
    calculatedArea: number;
}

export default function MapComponent() {
    const [territories, setTerritories] = useState<Territory[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3000/territories').then((res) => {
            setTerritories(res.data);
        });
    }, []);

    return (
        <MapContainer center={[40.785091, -73.968285]} zoom={13} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {territories.map((t) => (
                <Polygon
                    key={t.id}
                    positions={t.polygon.coordinates[0].map((c: any) => [c[1], c[0]])} // GeoJSON is [lng, lat], Leaflet is [lat, lng]
                    pathOptions={{ color: 'blue' }}
                >
                    <Popup>
                        <div>
                            <h3 className="font-bold">{t.name}</h3>
                            <p>{t.description}</p>
                            <p>Area: {t.calculatedArea?.toFixed(2)} sqm</p>
                        </div>
                    </Popup>
                </Polygon>
            ))}
        </MapContainer>
    );
}
