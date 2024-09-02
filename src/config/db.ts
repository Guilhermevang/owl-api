import { Db, MongoClient } from "mongodb";

export default class DatabaseContext {
    singleton: Db;
    
    constructor(
        public database_name: string,
    ) {}

    async connect(): Promise<Db> {
        if (this.singleton) return this.singleton;

        const client = new MongoClient(process.env.MONGO_HOST);

        await client.connect();

        this.singleton = client.db(this.database_name || process.env.MONGO_DATABASE)

        return this.singleton;
    }
}