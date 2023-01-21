const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

var default_user_obj = {id: null, description: "empty user.", recents: {path: null, source: null, time: null, timestamp: null}};

class MongoController {
	constructor() { }

    async getUser(user_id) {
        const mongoClient = new MongoClient(url);
        var result = null;
        try {
            await mongoClient.connect();
            const db = mongoClient.db("mediaservice");
            const collection = db.collection("users");
            var document = await collection.findOne({}, {id: user_id});
            if (document) {
                result = document;
            }
            else {
                console.log(`Fail to find user: ${user_id}`);
            }
        }catch(err) {
            console.log("Exception: " - err);
        } finally {
            await mongoClient.close();
        }
        return result;
    }

    async getOrAddUser(user_id) {
        var result;
        const mongoClient = new MongoClient(url);
        try {
            var document = await this.getUser(user_id);
            if (document) {
                result = document;
            }
            else {
                default_user_obj.id = user_id;
                await mongoClient.connect();
                const db = mongoClient.db("mediaservice");
                const collection = db.collection("users");
                await collection.insertOne(default_user_obj);
                result = await this.getUser(user_id);
            }
        } catch(err) {
            console.log("Exception: " - err);
        } finally {
            await mongoClient.close();
        }
        return result;
    }

    async updateRecents(user_id, new_recents) {
        const mongoClient = new MongoClient(url);
        try {
            await mongoClient.connect();
            const db = mongoClient.db("mediaservice");
            const collection = db.collection("users");
            const options = { upsert: true };
            var result = await collection.updateOne({id: user_id}, {$set: {recents: new_recents}}, options);
            //console.log( `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
        } catch(err) {
            console.log("Exception: " - err);
        } finally {
            await mongoClient.close();
        }
    }
}

module.exports = MongoController;