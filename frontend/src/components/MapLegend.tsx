import { useState } from 'react';

interface LegendEntry {
    label: string;
    /** Must match exactly the LayersControl.Overlay name prop. null = always visible */
    overlayName: string | null;
    type: 'wms' | 'swatch';
    legendUrl?: string;
    color?: string;
}

export const LEGEND_ENTRIES: LegendEntry[] = [
    {
        label: 'Hidrografía (Ríos)',
        overlayName: 'Hidrografía (Ríos)',
        type: 'wms',
        legendUrl:
            'https://sitservicios.lapaz.bo/geoserver/sit/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=lapaz:cuencahidrografica',
    },
    {
        label: 'Riesgo por deslizamiento',
        overlayName: 'Riesgo por deslizamiento',
        type: 'wms',
        legendUrl:
            'http://localhost:8080/geoserver/munisig/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=munisig:raster_riesgos&STYLE=sld_raster_gridcode6',
    },
    {
        label: 'Geología 2025',
        overlayName: 'Geología 2025 (Local)',
        type: 'wms',
        legendUrl:
            'http://localhost:8080/geoserver/munisig/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=munisig:geologia2025&STYLE=lp_geologia2025&LEGEND_OPTIONS=columns:5',
    },
    // {
    //     label: 'Territorios (GeoServer)',
    //     overlayName: 'Territorios (GeoServer Local)',
    //     type: 'wms',
    //     legendUrl:
    //         'http://localhost:8080/geoserver/munisig/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=munisig:territory',
    // },
    {
        label: 'Territorios (dibujados)',
        overlayName: null, // always shown since polygons are always rendered
        type: 'swatch',
        color: '#3388ff',
    },
];

interface MapLegendProps {
    activeOverlays: string[];
}

export default function MapLegend({ activeOverlays }: MapLegendProps) {
    const [open, setOpen] = useState(true);

    const visibleEntries = LEGEND_ENTRIES.filter(
        (e) => e.overlayName === null || activeOverlays.includes(e.overlayName),
    );

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 32,
                left: 12,
                zIndex: 1000,
                fontFamily: 'Inter, Roboto, sans-serif',
                fontSize: 13,
                userSelect: 'none',
            }}
        >
            {/* Toggle button */}
            <button
                onClick={() => setOpen((v) => !v)}
                title={open ? 'Ocultar leyenda' : 'Mostrar leyenda'}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    borderRadius: open ? '8px 8px 0 0' : 8,
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(25,28,42,0.88)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                    width: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Leyenda
                <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.7 }}>
                    {open ? '▼' : '▲'}
                </span>
            </button>

            {/* Panel — only render if at least one entry is visible */}
            {open && visibleEntries.length > 0 && (
                <div
                    style={{
                        background: 'rgba(25,28,42,0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        padding: '10px 12px 12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                        minWidth: 180,
                        maxWidth: '80vw',
                        overflowX: 'auto',
                    }}
                >
                    {visibleEntries.map((entry) => (
                        <div
                            key={entry.label}
                            style={{ marginBottom: 9 }}
                        >
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {entry.label}
                            </div>
                            {entry.type === 'swatch' ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: 3,
                                            background: entry.color,
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            flexShrink: 0,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        maxHeight: 182, /* ~7 rows × 26px */
                                        overflowY: 'auto',
                                        borderRadius: 4,
                                    }}
                                >
                                    <img
                                        src={entry.legendUrl}
                                        alt={entry.label}
                                        style={{
                                            display: 'block',
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(255,255,255,0.06)',
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <div
                        style={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            marginTop: 4,
                            paddingTop: 7,
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: 11,
                        }}
                    >
                        Fuentes: La Paz SIT · GeoServer local
                    </div>
                </div>
            )}
        </div>
    );
}
