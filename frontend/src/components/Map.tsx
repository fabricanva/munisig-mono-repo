import { MapContainer, TileLayer, Polygon, Popup, FeatureGroup, LayersControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

interface Territory {
    id: number;
    name: string;
    description: string;
    polygon: any; // GeoJSON coordinates
    calculatedArea: number;
}

export default function MapComponent() {
    const [territories, setTerritories] = useState<Territory[]>([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        axios.get('http://localhost:3000/territories', config).then((res) => {
            setTerritories(res.data);
        }).catch((err) => {
            console.error("Error fetching territories", err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        });
    }, [navigate]);

    const handleCreated = async (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const geoJson = layer.toGeoJSON();

            const name = prompt("Enter territory name:", "New Territory");
            if (!name) return;

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to save territories.');
                navigate('/login');
                return;
            }

            try {
                const res = await axios.post('http://localhost:3000/territories', {
                    name: name,
                    description: "Created via Map UI",
                    polygon: geoJson.geometry
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTerritories([...territories, res.data]);
                alert('Territory saved!');
            } catch (error) {
                console.error("Error saving territory:", error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    alert('Session expired. Please login again.');
                    navigate('/login');
                } else {
                    alert('Error saving territory.');
                }
            }
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000
                }}
            >
                Logout
            </Button>
            <MapContainer center={[40.785091, -73.968285]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Satellite (Esri)">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        draw={{
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                            polyline: false,
                            polygon: true,
                        }}
                    />
                </FeatureGroup>

                {territories.map((t) => (
                    <Polygon
                        key={t.id}
                        positions={t.polygon.coordinates[0].map((c: any) => [c[1], c[0]])}
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
        </div>
    );
}
