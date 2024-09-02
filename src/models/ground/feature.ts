import { ObjectId } from "mongodb";
import { BBox, Feature, Geometry } from "geojson";
import FeaturePropertiesModel from "@models/ground/feature-properties";

export default class FeatureModel<G extends Geometry> implements Feature<Geometry, FeaturePropertiesModel> {
    _id?: ObjectId; // ID do objeto MongoDB
    id?: string | number; // ID da Feature
    type: "Feature"; // Tipo da Feature (Feature | FeatureCollection)
    geometry: G; // Possívelmente 'Polygon' ou 'MultiPolygon'
    bbox?: BBox; // Possívelmente nulo, usado quando é um quadrado
    properties: FeaturePropertiesModel; // Propriedades do talhão, como: nome, cultivo e dados do usuário
}