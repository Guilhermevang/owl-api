import { BBox, Feature, MultiPolygon, Polygon } from "geojson";
import FeaturePropertiesModel from "@entities/requests/feature-properties-request";
import FeaturePropertiesEntity from "./feature-properties-request";

export default class FeatureEntity implements Feature<Polygon | MultiPolygon, FeaturePropertiesModel> {
    id?: string | number; // ID da Feature
    type: "Feature"; // Tipo da Feature (Feature | FeatureCollection)
    geometry: Polygon | MultiPolygon; // Possívelmente 'Polygon' ou 'MultiPolygon'
    bbox?: BBox; // Possívelmente nulo, usado quando é um quadrado
    properties: FeaturePropertiesEntity; // Propriedades do talhão, como: nome e cultivo
}