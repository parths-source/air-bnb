const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");  
const Mongo='mongodb://127.0.0.1:27017/wanderlust';

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