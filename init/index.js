if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");  
const Mongo = process.env.ATLASDB_URL || process.env.MONGO_URL;

if (!Mongo) {
    throw new Error("ATLASDB_URL or MONGO_URL must be configured");
}

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(Mongo);
}
const initDB=()=>{
    Listing.deleteMany({}).then(()=>{
        Listing.insertMany(initdata.data).then(()=>{
            console.log("data inserted");           
        }).catch((err)=>{
            console.log(err);
        }); 
    });
}
initDB();