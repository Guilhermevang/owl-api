import CropRequest from "@entities/requests/crop-request";
import CropResponse from "@entities/responses/crop-response";
import CropModel from "@models/crops/crop";
import { ObjectId } from "mongodb";

export default class CropMapper {
    public static toModel(entity: CropRequest): CropModel {
        return {
            name: entity.name
        }
    }

    public static toRequest(model: CropModel): CropRequest {
        return {
            name: model.name
        }
    }

    public static toResponse(model: CropModel): CropResponse {
        return {
            crop_id: model._id.toHexString(),
            name: model.name
        }
    }
}