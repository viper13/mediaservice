const PORT=808; 

var http = require("http"),
	LogicController = require("./LogicController.js");

//http.createServer(function (req, res) {
//	var logic = new LogicController;
//	logic.processRequest(req, res);
//}).listen(PORT);

const MongoClient = require("mongodb").MongoClient;
    
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);
 
async function run() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mediaservice");
        const collection = db.collection("users");
        const count = await collection.countDocuments();
        console.log(`Inside collection users ${count} of documents`);
		await collection.insertOne({device1: {value1: "value", value2: "value"}});
		await collection.insertOne({device2: {value1: "vale", value2: "vlue"}});
		await collection.insertOne({device3: {value1: "vue", value2: "vae"}});
    }catch(err) {
        console.log("Exception: " - err);
    } finally {
        await mongoClient.close();
    }
}
run();