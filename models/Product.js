import mongoose from "mongoose";

const InfoSchema = new mongoose.Schema({
    heading: { type: String },
    text: { type: String },
});

const BannerSchema = new mongoose.Schema({
    url: { type: String },
});

const ReviewSchema = new mongoose.Schema({
    author: { type: String},
    date: { type: Date},
    text: { type: String },
    rating: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    photo: { type: String },
});

const SearchStatusSchema = new mongoose.Schema({
    searchPosition: { type: String },
    title: { type: String },
    option: { type: mongoose.Schema.Types.Mixed },
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    engName: { type: String, required: true },
    // id: { type: String, required: true },
    image: { type: String, required: true },
    image2: { type: String },
    images: [BannerSchema],
    info_brief: { type: String },
    info_full: [InfoSchema],
    info: [InfoSchema],
    reviews_data: [ReviewSchema],
    searchStatus: [SearchStatusSchema],
    date: { type: Date },
});

export default mongoose.model("Product", ProductSchema);
