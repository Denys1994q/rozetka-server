import mongoose from "mongoose";

const InfoSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    text: { type: String, required: true },
});

const BannerSchema = new mongoose.Schema({
    url: { type: String },
});

const ReviewSchema = new mongoose.Schema({
    author: { type: String, required: true },
    date: { type: Date, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    photo: { type: String },
});

const SearchStatusSchema = new mongoose.Schema({
    searchPosition: { type: String, required: true },
    title: { type: String, required: true },
    option: { type: mongoose.Schema.Types.Mixed, required: true },
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    engName: { type: String, required: true },
    id: { type: String, required: true },
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
