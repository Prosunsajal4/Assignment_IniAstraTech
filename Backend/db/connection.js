const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://AccessUser:6uv33P9ydsh93VRi@prosun.7xdyt.mongodb.net/?retryWrites=true&w=majority&appName=Prosun";
const DB_NAME = "scheduling_system";

let client;
let db;

const connectDB = async () => {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const getDB = () => db;
const getClient = () => client;

module.exports = { connectDB, getDB, getClient };
