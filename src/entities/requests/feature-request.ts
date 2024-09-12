import { BBox, Feature, MultiPolygon, Polygon } from "geojson";
import FeaturePropertiesEntity from "@entities/requests/feature-properties-request";

export default class FeatureEntity implements Feature<Polygon | MultiPolygon, FeaturePropertiesEntity> {
    id?: string | number; // ID da Feature
    type: "Feature"; // Tipo da Feature (Feature | FeatureCollection)
    geometry: Polygon | MultiPolygon; // Possívelmente 'Polygon' ou 'MultiPolygon'
    bbox?: BBox; // Possívelmente nulo, usado quando é um quadrado
    properties: FeaturePropertiesEntity; // Propriedades do talhão, como: nome e cultivo
}