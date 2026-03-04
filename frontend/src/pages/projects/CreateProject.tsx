import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Grid,
    Stack,
    Typography,
    Paper,
    MenuItem,
    Chip,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import paths from 'routes/paths';
import StyledTextField from 'components/styled/StyledTextField';
import { MapContainer, TileLayer, FeatureGroup, LayersControl, WMSTileLayer, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import IconifyIcon from 'components/base/IconifyIcon';
import MapLegend from 'components/MapLegend';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const API = 'http://localhost:3000';

function LayerEventTracker({ onChange }: { onChange: (name: string, active: boolean) => void }) {
    useMapEvents({
        overlayadd: (e) => onChange(e.name, true),
        overlayremove: (e) => onChange(e.name, false),
    });
    return null;
}

export default function CreateProject() {
    const navigate = useNavigate();
    const [personnel, setPersonnel] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        importanceLevel: '',
        chiefPersonnelId: '',
        memberPersonnelIds: [] as string[],
    });

    // Map state
    const [activeOverlays, setActiveOverlays] = useState<string[]>([]);
    const drawnPolygonRef = useRef<any>(null); // holds the geojson of the drawn polygon

    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPersonnel(res.data.filter((u: any) => u.personnel).map((u: any) => u.personnel));
            } catch (err) {
                console.error('Failed to fetch personnel', err);
            }
        };
        fetchPersonnel();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name as string]: value }));
    };

    const handleOverlayChange = (name: string, active: boolean) => {
        setActiveOverlays((prev) =>
            active ? [...prev, name] : prev.filter((n) => n !== name),
        );
    };

    const handleMapCreated = (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            drawnPolygonRef.current = layer.toGeoJSON().geometry;
        }
    };

    const handleMapDeleted = () => {
        drawnPolygonRef.current = null;
    };

    const handleMapEdited = (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: any) => {
            drawnPolygonRef.current = layer.toGeoJSON().geometry;
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            let territoryId: number | null = null;

            // 1. Create territory if polygon is drawn
            if (drawnPolygonRef.current) {
                const terrRes = await axios.post(`${API}/territories`, {
                    name: `${form.name} - Territorio`,
                    description: `Territorio para el proyecto ${form.name}`,
                    polygon: drawnPolygonRef.current
                }, { headers });

                territoryId = terrRes.data.id;
            }

            // 2. Create Project
            const projectPayload: any = {
                name: form.name,
                description: form.description,
            };

            if (form.startDate) projectPayload.startDate = form.startDate;
            if (form.endDate) projectPayload.endDate = form.endDate;
            if (form.importanceLevel) projectPayload.importanceLevel = parseInt(form.importanceLevel, 10);
            if (form.chiefPersonnelId) projectPayload.chiefPersonnelId = parseInt(form.chiefPersonnelId, 10);
            if (form.memberPersonnelIds.length > 0) {
                projectPayload.memberPersonnelIds = form.memberPersonnelIds.map((id) => parseInt(id, 10));
            }
            if (territoryId) {
                projectPayload.territoryId = territoryId;
            }

            await axios.post(`${API}/projects`, projectPayload, { headers });

            // Navigate back to project list on success
            navigate(paths.projects);

        } catch (err: any) {
            console.error('Failed to create project', err);
            setError(err.response?.data?.message || 'Error al crear el proyecto. Revisa los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 110px)' }}>
            {/* Form Side */}
            <Grid size={{ xs: 12, lg: 5 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Paper sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <Button
                            variant="text"
                            startIcon={<IconifyIcon icon="material-symbols:arrow-back-rounded" />}
                            onClick={() => navigate(paths.projects)}
                            sx={{ color: 'text.secondary' }}
                        >
                            Atrás
                        </Button>
                        <Typography variant="h5" component="h1" fontWeight={600}>
                            Nuevo Proyecto
                        </Typography>
                    </Stack>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3} sx={{ flexGrow: 1, width: '100%', mt: 1 }}>
                        <Grid size={12}>
                            <StyledTextField
                                name="name"
                                label="Nombre del Proyecto"
                                fullWidth
                                required
                                value={form.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid size={12}>
                            <StyledTextField
                                name="description"
                                label="Descripción"
                                multiline
                                rows={3}
                                fullWidth
                                value={form.description}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField
                                name="startDate"
                                label="Fecha de Inicio"
                                type="date"
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={form.startDate}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField
                                name="endDate"
                                label="Fecha de Fin"
                                type="date"
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={form.endDate}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid size={12}>
                            <StyledTextField
                                select
                                name="importanceLevel"
                                label="Nivel de Importancia"
                                fullWidth
                                value={form.importanceLevel}
                                onChange={handleChange}
                            >
                                <MenuItem value=""><em>Ninguno</em></MenuItem>
                                <MenuItem value="1">1 - Muy Alto</MenuItem>
                                <MenuItem value="2">2 - Alto</MenuItem>
                                <MenuItem value="3">3 - Medio</MenuItem>
                                <MenuItem value="4">4 - Bajo</MenuItem>
                                <MenuItem value="5">5 - Muy Bajo</MenuItem>
                            </StyledTextField>
                        </Grid>

                        <Grid size={12}>
                            <StyledTextField
                                select
                                name="chiefPersonnelId"
                                value={form.chiefPersonnelId}
                                label="Jefe de Proyecto"
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value=""><em>Ninguno</em></MenuItem>
                                {personnel.map((p) => (
                                    <MenuItem key={p.id} value={p.id.toString()}>
                                        {p.firstName} {p.lastName}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>

                        <Grid size={12}>
                            <StyledTextField
                                select
                                name="memberPersonnelIds"
                                value={form.memberPersonnelIds}
                                label="Miembros del Proyecto"
                                onChange={handleChange}
                                fullWidth
                                SelectProps={{
                                    multiple: true,
                                    renderValue: (selected: any) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value: string) => {
                                                const p = personnel.find((pers: any) => pers.id.toString() === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={p ? `${p.firstName} ${p.lastName}` : value}
                                                        sx={{ color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    ),
                                }}
                            >
                                {personnel.map((p) => (
                                    <MenuItem key={p.id} value={p.id.toString()}>
                                        {p.firstName} {p.lastName}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>

                        <Grid size={12}>
                            <Alert severity="info">
                                Puedes dibujar el territorio asignado al proyecto en el mapa.
                            </Alert>
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button color="inherit" onClick={() => navigate(paths.projects)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading || !form.name}
                            startIcon={loading ? <IconifyIcon icon="eos-icons:loading" /> : <IconifyIcon icon="material-symbols:save" />}
                        >
                            Guardar Proyecto
                        </Button>
                    </Stack>
                </Paper>
            </Grid>

            {/* Map Side */}
            <Grid size={{ xs: 12, lg: 7 }} sx={{ height: '100%', minHeight: 400 }}>
                <Paper sx={{ height: '100%', overflow: 'hidden', position: 'relative', borderRadius: 2 }}>
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
                                    attribution='Tiles &copy; Esri &mdash; Source: Esri...'
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
                                onCreated={handleMapCreated}
                                onDeleted={handleMapDeleted}
                                onEdited={handleMapEdited}
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
                    </MapContainer>
                    <MapLegend activeOverlays={activeOverlays} />
                </Paper>
            </Grid>
        </Grid>
    );
}
