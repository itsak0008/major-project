const { ref } = require("joi");
const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    // image: {
    //     type: String,
    //     default: "https://cdn.pixabay.com/photo/2025/05/17/21/39/mountains-9606525_1280.jpg",
    //     set: (v) => v === " " ? "https://cdn.pixabay.com/photo/2025/05/17/21/39/mountains-9606525_1280.jpg" : v,  // ✅ Backslashes escaped
    // },
    image: {
        filename: String,
        url: {
            type: String,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }

    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
