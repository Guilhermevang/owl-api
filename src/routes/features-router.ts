import { container } from "@root/container";

import express from "express";
import { FeaturesService } from "@services/features-service"
import ControllerBase from "@services/controller-base";
import FeatureEntity from "@entities/requests/feature-request";
import { authenticate } from "@config/middlewares/auth-middleware";

const route = express.Router();

const featuresService = container.get<FeaturesService>(FeaturesService);
const controllerBase = new ControllerBase();

route.post("/", authenticate, async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const feature: FeatureEntity = req.body;
        
        const result = await featuresService.insertNewFeature(feature);
        return result;
    });
});

route.get("/", authenticate, async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const user_uuid: string = (req as any).user.uid;
        const crops_filter: string | null = req.query?.crops_filter as string;

        const result = await featuresService.listFeaturesFromUser(user_uuid, crops_filter);
        return result;
    });
});

route.get("/:feature_id", authenticate, async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const feature_id: string = req.params.feature_id;

        const result = await featuresService.fetchSingleFeature(feature_id);
        return result;
    });
});

route.get("/hash/:feature_hash", authenticate, async (req: express.Request, res: express.Response) => {
    return await controllerBase.execute(res, async () => {
        const feature_hash: string = req.params.feature_hash;

        const result = await featuresService.fetchSingleFeatureFromHash(feature_hash);
        return result;
    });
});

export default route;