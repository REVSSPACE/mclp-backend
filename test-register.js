const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:admin123@rev.srruj2o.mongodb.net/?appName=Rev";

const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log("✅ MongoDB Atlas Connected Successfully");
    await client.close();
  } catch (err) {
    console.log("❌ Connection Failed");
    console.error(err);
  }
}

test();
