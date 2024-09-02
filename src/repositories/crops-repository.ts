import DatabaseException from "@entities/exceptions/database-exception";
import DatabaseContext from "@config/db";
import CustomException from "@entities/exceptions/custom-exception";
import CropModel from "@models/crops/crop";
import { injectable } from "inversify";
import { Db, ObjectId } from "mongodb";

export interface ICropsRepository {
    insertCrop(crop: CropModel): Promise<string | null>;
    fetchCrop(crop_id: ObjectId | string): Promise<CropModel | null>;
    listCrops(): Promise<CropModel[] | null>;
}

@injectable()
export class CropsRepository implements ICropsRepository {
    database: DatabaseContext;
    private collection_name: string;
    
    constructor () {
        this.database = new DatabaseContext("iss-db");
        this.collection_name = "crops";
    }

    async insertCrop(crop: CropModel): Promise<string | null> {
        const db: Db = await this.database.connect();

        const result =
            await db.collection(this.collection_name)
                .insertOne(crop);

        if (!result) {
            return null;
        }

        if (!result.acknowledged) {
            throw new DatabaseException(
                "Houve um erro interno ao inserir o tipo de cultivo. Tente novamente mais tarde.",
                "CREATING"
            );
        }

        const inserted_id: string = result.insertedId.toHexString();

        return inserted_id;
    }

    async fetchCrop(crop_id: ObjectId | string): Promise<CropModel | null> {
        if (!ObjectId.isValid(crop_id))
        {
            throw new CustomException(
                "INVALID_DATA",
                "O parâmetro 'crop_id' deve estar no formato adequado."
            );
        }
        
        const db: Db = await this.database.connect();

        const crop: CropModel =
            await db.collection(this.collection_name)
                .findOne({ _id: ObjectId.createFromHexString(crop_id as string) }) as CropModel;

        if (!crop) {
            return null;
        }

        return crop;
    }

    async listCrops(): Promise<CropModel[] | null> {
        const db: Db = await this.database.connect();

        const crops: CropModel[] =
            await db.collection(this.collection_name)
                .find().toArray() as CropModel[];

        if (!crops || crops.length === 0) {
            return null;
        }

        return crops;
    }
}