export class CreateTerritoryDto {
    name: string;
    description?: string;
    polygon: object; // GeoJSON Polygon
}
