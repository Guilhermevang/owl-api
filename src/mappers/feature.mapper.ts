import FeatureEntity from "@/entities/requests/feature-request";
import FeatureModel from "@/models/ground/feature";
import { Geometry, MultiPolygon, Polygon } from "geojson";

export default class FeatureMapper {
    public static toModel(entity: FeatureEntity): FeatureModel<Geometry> {
        return {
            id: entity.id,
            geometry: entity.geometry,
            properties: {
                feature: {
                    name: entity.properties.feature.name,
                    crop: {
                        id: entity.properties.feature.crop.id,
                        name: ""
                    },
                    hash: ""
                },
                user: {
                    id: ""
                }
            },
            type: entity.type,
            bbox: entity.bbox
        }
    }

    public static toEntity(model: FeatureModel<Geometry>): FeatureEntity {
        return {
            id: model.id,
            geometry: model.geometry as Polygon | MultiPolygon,
            properties: {
                feature: {
                    name: model.properties.feature.name,
                    crop: {
                        id: model.properties.feature.crop.id
                    }
                }
            },
            type: model.type,
            bbox: model.bbox
        }
    }
}