import { container } from "@root/container";

import express from "express";
import { FeaturesService } from "@services/features-service"
import ControllerBase from "@services/controller-base";
import FeatureEntity from "@entities/requests/feature-request";

const route = express.Router();

const featuresService = container.get<FeaturesService>(FeaturesService);
const controllerBase = new ControllerBase();

route.post("/", async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const feature: FeatureEntity = req.body;
        
        const result = await featuresService.insertNewFeature(feature);
        return result;
    });
});

route.get("/:feature_id", async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const feature_id: string = req.params.feature_id;

        const result = await featuresService.fetchSingleFeature(feature_id);
        return result;
    });
});

route.get("/hash/:feature_hash", async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const feature_hash: string = req.params.feature_hash;

        const result = await featuresService.fetchSingleFeatureFromHash(feature_hash);
        return result;
    });
});

route.get("/user/:user_uuid/list", async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const user_uuid: string = req.params.user_uuid;
        const crops_filter: string = req.query.crops_filter as string;

        const result = await featuresService.listFeaturesFromUser(user_uuid, crops_filter);
        return result;
    });
});

export default route;