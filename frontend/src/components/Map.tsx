import { MapContainer, TileLayer, Polygon, Popup, FeatureGroup, LayersControl, WMSTileLayer, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import MapLegend from './MapLegend';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

interface Territory {
	id: number;
	name: string;
	description: string;
	polygon: any; // GeoJSON coordinates
	calculatedArea: number;
}

/** Listens to Leaflet overlay toggle events and notifies parent */
function LayerEventTracker({ onChange }: { onChange: (name: string, active: boolean) => void }) {
	useMapEvents({
		overlayadd: (e) => onChange(e.name, true),
		overlayremove: (e) => onChange(e.name, false),
	});
	return null;
}

export default function MapComponent() {
	const [territories, setTerritories] = useState<Territory[]>([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
	const [activeOverlays, setActiveOverlays] = useState<string[]>([]);
	const navigate = useNavigate();

	const handleOverlayChange = (name: string, active: boolean) => {
		setActiveOverlays((prev) =>
			active ? [...prev, name] : prev.filter((n) => n !== name),
		);
	};

	const fetchTerritories = () => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/auth/login');
			return;
		}

		const config = { headers: { Authorization: `Bearer ${token}` } };

		axios.get('http://localhost:3000/territories', config).then((res) => {
			setTerritories(res.data);
		}).catch((err) => {
			console.error("Error fetching territories", err);
			if (err.response?.status === 401) {
				navigate('/auth/login');
			}
		});
	};

	useEffect(() => {
		fetchTerritories();
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
				navigate('/auth/login');
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
				// Remove the drawn layer, as we will render it from state
				layer.remove();
				alert('Territory saved!');
			} catch (error) {
				console.error("Error saving territory:", error);
				if (axios.isAxiosError(error) && error.response?.status === 401) {
					alert('Session expired. Please login again.');
					navigate('/auth/login');
				} else {
					alert('Error saving territory.');
				}
			}
		}
	};

	const handleDeleted = (e: any) => {
		const extractedIds: number[] = [];
		e.layers.eachLayer((layer: any) => {
			if (layer.territoryId) {
				extractedIds.push(layer.territoryId);
			}
		});

		if (extractedIds.length > 0) {
			setIdsToDelete(extractedIds);
			setDeleteDialogOpen(true);
		}
	};

	const confirmDelete = async () => {
		const token = localStorage.getItem('token');
		if (!token) return;

		for (const id of idsToDelete) {
			try {
				await axios.delete(`http://localhost:3000/territories/${id}`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				setTerritories((prev) => prev.filter((t) => t.id !== id));
			} catch (error: any) {
				console.error(`Error deleting territory ${id}:`, error);
				if (error.response) {
					if (error.response.status === 401) {
						alert('Session expired or unauthorized. Please log in again.');
						localStorage.removeItem('token');
						window.location.href = '/authentication/login';
					} else {
						alert(`Error deleting territory: ${error.response.status} ${error.response.statusText}`);
					}
				} else {
					alert(`Error deleting territory: ${error.message}`);
				}
			}
		}
		setDeleteDialogOpen(false);
		setIdsToDelete([]);
	};

	const cancelDelete = () => {
		setDeleteDialogOpen(false);
		setIdsToDelete([]);
		fetchTerritories(); // Restore the deleted layers on the map
	};

	return (
		<div style={{ position: 'relative', height: '100vh', width: '100%' }}>

			<MapContainer center={[-16.5, -68.12]} zoom={14} style={{ height: '100%', width: '100%' }}>
				<LayerEventTracker onChange={handleOverlayChange} />
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

					<LayersControl.Overlay name="Hidrografía (Ríos)">
						<WMSTileLayer
							url="https://sitservicios.lapaz.bo/geoserver/sit/wms"
							layers="lapaz:cuencahidrografica"
							format="image/png"
							transparent={true}
							version="1.1.1"
						/>
					</LayersControl.Overlay>


					<LayersControl.Overlay name="Riesgo por deslizamiento">
						<WMSTileLayer
							url="http://localhost:8080/geoserver/munisig/wms"
							layers="munisig:raster_riesgos"
							styles="sld_raster_gridcode6"
							format="image/png"
							transparent={true}
							opacity={0.6}
							version="1.1.0"
						/>
					</LayersControl.Overlay>

					<LayersControl.Overlay name="Geología 2025 (Local)">
						<WMSTileLayer
							url="http://localhost:8080/geoserver/munisig/wms"
							layers="munisig:geologia2025"
							styles="lp_geologia2025"
							format="image/png"
							transparent={true}
							opacity={0.6}
							version="1.1.0"
						/>
					</LayersControl.Overlay>

					<LayersControl.Overlay name="Territorios (GeoServer Local)">
						<WMSTileLayer
							url="http://localhost:8080/geoserver/munisig/wms"
							layers="munisig:territory"
							format="image/png"
							transparent={true}
							version="1.1.0"
						/>
					</LayersControl.Overlay>
				</LayersControl>

				<FeatureGroup>
					<EditControl
						position="topright"
						onCreated={handleCreated}
						onDeleted={handleDeleted}
						draw={{
							rectangle: false,
							circle: false,
							circlemarker: false,
							marker: false,
							polyline: false,
							polygon: true,
						}}
						edit={{
							edit: false,
							remove: true
						}}
					/>
					{territories.map((t) => (
						<Polygon
							key={t.id}
							positions={t.polygon.coordinates[0].map((c: any) => [c[1], c[0]])}
							pathOptions={{ color: 'blue' }}
							ref={(ref) => {
								if (ref) {
									(ref as any).territoryId = t.id;
								}
							}}
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
				</FeatureGroup>

			</MapContainer>

			<MapLegend activeOverlays={activeOverlays} />

			<Dialog open={deleteDialogOpen} onClose={cancelDelete}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete {idsToDelete.length} territory(ies)? This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={cancelDelete} color="primary">
						Cancel
					</Button>
					<Button onClick={confirmDelete} color="error" autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
}
