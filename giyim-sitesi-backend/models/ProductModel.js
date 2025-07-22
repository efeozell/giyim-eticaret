// models/ProductModel.js - NİHAİ VE DOĞRU HALİ

import mongoose from "mongoose";

// Her bir yorumun şemasını ayrı olarak tanımlıyoruz
const reviewSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		rating: { type: Number, required: true },
		comment: { type: String, required: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

// Ana ürün şemamız
const productSchema = mongoose.Schema(
	{
		user: {
			// Ürünü ekleyen admin
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		name: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		reviews: [reviewSchema], // Yorumlar dizisi
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		numReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
		isFeatured: {
			// Öne çıkan ürün mü?
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model("Product", productSchema);

// Modeli doğru bir şekilde export ediyoruz
export default Product;
