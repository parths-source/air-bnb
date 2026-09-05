const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: String,
        url: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }

    ]
});

//remove athe reviews too if a listing is removed
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviewSchema.deleteMany({_id : {$in: listing.reviews}});
    }
});
const Listing=mongoose.model("Listing",listingSchema);  
module.exports=Listing; 

