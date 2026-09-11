if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const Mongo = process.env.ATLASDB_URL || process.env.MONGO_URL;

if (!Mongo) {
    throw new Error("ATLASDB_URL or MONGO_URL must be configured");
}

async function main(){
    await mongoose.connect(Mongo);
    console.log("connected to database");
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data inserted");
    await mongoose.disconnect();
}

main().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exitCode = 1;
});