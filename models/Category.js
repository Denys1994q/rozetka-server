import mongoose from "mongoose";

const PopularCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    engName: { type: String, required: true },
    id: { type: String, required: true },
    img: String,
});

const BannerSchema = new mongoose.Schema({
    url: { type: String },
});

const PopularSubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    engName: { type: String, required: true },
    id: { type: String, required: true },
});

const SubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    engName: { type: String, required: true },
    id: { type: String, required: true },
    popular: [PopularSubcategorySchema],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    engName: { type: String, required: true },
    id: { type: String, required: true },
    icon: String,
    popular: [PopularCategorySchema],
    banners: [BannerSchema],
    brands: [String],
    subCategories: [SubcategorySchema],
});

export default mongoose.model("Category", CategorySchema);
