const mongoose = require("mongoose");
const Listing = require("../models/listing");

const Mongo = "mongodb://127.0.0.1:27017/wanderlust";

const getCategory = (listing) => {
    const listingText = `${listing.title || ""} ${listing.description || ""}`.toLowerCase();

    if (/beach|island|maldives|phuket|mykonos|bali|cancun|fiji|coast|tropical/.test(listingText)) {
        return "beaches";
    }

    if (/ski|arctic|snow|alps|ice|glacier/.test(listingText)) {
        return "arctic";
    }

    if (/mountain|cabin|lake|banff|montana|aspen|treehouse|serengeti|highlands/.test(listingText)) {
        return "mountains";
    }

    return "iconic cities";
};

async function migrateCategories() {
    await mongoose.connect(Mongo);

    const listings = await Listing.find({
        $or: [
            { category: { $exists: false } },
            { category: null },
            { category: "" }
        ]
    });

    for (const listing of listings) {
        listing.category = getCategory(listing);
        await listing.save();
    }

    console.log(`Categorized ${listings.length} existing listing(s).`);
    await mongoose.disconnect();
}

migrateCategories().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exitCode = 1;
});