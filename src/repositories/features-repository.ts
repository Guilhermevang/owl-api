import DatabaseException from "@/entities/exceptions/database-exception";
import DatabaseContext from "@config/db";
import CustomException from "@entities/exceptions/custom-exception";
import FeatureModel from "@models/ground/feature";
import { createHash } from "crypto";
import { Geometry, MultiPolygon, Polygon, Position } from "geojson";
import { injectable } from "inversify";
import { Db, ObjectId } from "mongodb";

export interface IFeaturesRepository {
    insertFeature(feature: FeatureModel<Geometry>): Promise<string | null>;
    fetchFeature(feature_id: ObjectId | string): Promise<FeatureModel<Geometry> | null>;
    fetchFeatureFromHash(feature_hash: string): Promise<FeatureModel<Geometry> | null>;
    listFeaturesFromUser(user_uuid: string, crops_id: string[]): Promise<FeatureModel<Geometry>[] | null>;
}

@injectable()
export class FeaturesRepository implements IFeaturesRepository {
    database: DatabaseContext;
    collection_name: string;
    
    constructor () {
        this.database = new DatabaseContext("iss-db");
        this.collection_name = "ground";
    }

    async insertFeature(feature: FeatureModel<Geometry>): Promise<string | null> {
        const db: Db = await this.database.connect();

        const result =
            await db.collection(this.collection_name)
                .insertOne(feature);

                
        if (!result) {
            return null;
        }

        if (!result.acknowledged) {
            throw new DatabaseException(
                "Houve um erro interno ao inserir o talhão. Tente novamente mais tarde.",
                "CREATING"
            );
        }

        const inserted_id: string = result.insertedId.toString("hex");

        return inserted_id;
    }
    
    async fetchFeature(feature_id: ObjectId | string): Promise<FeatureModel<Geometry> | null> {
        if (!ObjectId.isValid(feature_id))
        {
            throw new CustomException(
                "INVALID_DATA",
                "O parâmetro 'feature_id' deve estar no formato adequado."
            );
        }
        
        const db: Db = await this.database.connect();

        const feature: FeatureModel<Geometry> =
            await db.collection(this.collection_name)
                .findOne({ _id: ObjectId.createFromHexString(feature_id as string) }) as FeatureModel<Geometry>;

        if (!feature) {
            return null;
        }

        return feature;
    }

    async fetchFeatureFromHash(feature_hash: string): Promise<FeatureModel<Geometry> | null> {
        const db: Db = await this.database.connect();

        const feature: FeatureModel<Geometry> =
            await db.collection(this.collection_name)
                .findOne({ "properties.feature.hash": feature_hash }) as FeatureModel<Geometry>;

        if (!feature) {
            return null;
        }

        return feature;
    }

    async listFeaturesFromUser(user_uuid: string, crops_id: (ObjectId | string)[]): Promise<FeatureModel<Geometry>[] | null> {
        const db: Db = await this.database.connect();

        const features: FeatureModel<Geometry>[] =
            await db.collection(this.collection_name)
                .find({
                    "properties.user.id": user_uuid,
                    "properties.feature.crop.id": {
                        $in: crops_id
                    }
                }).toArray()  as FeatureModel<Geometry>[];

        if (!features || features.length === 0) {
            return null;
        }

        return features;
    }
}