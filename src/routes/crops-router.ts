import { container } from "@root/container";

import express from "express";
import ControllerBase from "@services/controller-base";
import CropEntity from "@entities/requests/crop-request";
import { CropsService } from "@services/crops-service";

const route = express.Router();

const cropsService = container.get<CropsService>(CropsService);
const controllerBase = new ControllerBase();

route.post("/", async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const crop: CropEntity = req.body;
        
        const result = await cropsService.insertNewCrop(crop);
        return result;
    });
});

route.get("/:crop_id", async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const crop_id: string = req.params.crop_id;

        const result = await cropsService.fetchSingleCrop(crop_id);
        return result;
    });
});

route.get("/", async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const result = await cropsService.listCrops();
        return result;
    });
});

export default route;