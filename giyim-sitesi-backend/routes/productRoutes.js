// routes/productRoutes.js - NİHAİ, DOĞRU VE TAM HALİ

import express from "express";
import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- HERKESE AÇIK ROTALAR (PUBLIC ROUTES) ---

// @desc    Tüm ürünleri getir, kategoriye VEYA kelimeye göre filtrele
// @route   GET /api/products
router.get("/", async (req, res) => {
	try {
		const { keyword, category } = req.query;
		const filter = {};
		if (category) {
			filter.category = { $regex: category, $options: "i" };
		}
		if (keyword) {
			filter.name = { $regex: keyword, $options: "i" };
		}
		const products = await Product.find(filter);
		res.json(products);
	} catch (error) {
		console.error("Ürünler getirilirken hata:", error);
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

// @desc    Öne çıkan ürünleri getir
// @route   GET /api/products/featured
router.get("/featured", async (req, res) => {
	try {
		const products = await Product.find({ isFeatured: true }).limit(8);
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

// @desc    ID'ye göre tek bir ürünü getir
// @route   GET /api/products/:id
router.get("/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ message: "Ürün bulunamadı" });
		}
	} catch (error) {
		console.error("Tek ürün getirme hatası:", error);
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

// --- SADECE GİRİŞ YAPMIŞ KULLANICILAR İÇİN ROTALAR (PRIVATE) ---

// @desc    Bir ürüne yeni bir yorum oluştur
// @route   POST /api/products/:id/reviews
router.post("/:id/reviews", protect, async (req, res) => {
	const { rating, comment } = req.body;
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			const orders = await Order.find({ user: req.user._id });
			const hasPurchased = orders.some((order) =>
				order.orderItems.some((item) => item.product.toString() === product._id.toString())
			);
			if (!hasPurchased) {
				return res
					.status(403)
					.json({ message: "Sadece satın aldığınız ürünlere yorum yapabilirsiniz" });
			}
			const alreadyReviewed = product.reviews.find(
				(r) => r.user.toString() === req.user._id.toString()
			);
			if (alreadyReviewed) {
				return res.status(400).json({ message: "Bu ürüne zaten yorum yaptınız" });
			}
			const review = {
				name: req.user.name,
				rating: Number(rating),
				comment,
				user: req.user._id,
			};
			product.reviews.push(review);
			product.numReviews = product.reviews.length;
			product.rating =
				product.reviews.reduce((acc, item) => item.rating + acc, 0) /
				product.reviews.length;
			await product.save();
			res.status(201).json({ message: "Yorum eklendi" });
		} else {
			res.status(404).json({ message: "Ürün bulunamadı" });
		}
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Yorum eklenemedi", error: error.message });
	}
});

// --- SADECE ADMİNLERİN ERİŞEBİLECEĞİ ROTALAR (PRIVATE/ADMIN) ---

router.post("/", protect, admin, async (req, res) => {
	try {
		const product = new Product({
			user: req.user._id,
			name: "Örnek İsim",
			price: 0,
			category: "kategori",
			imageUrl: "/images/sample.jpg",
			description: "Örnek Açıklama",
		});

		product.name = req.body.name;
		product.price = req.body.price;
		product.category = req.body.category;
		product.imageUrl = req.body.imageUrl;
		product.description = req.body.description;

		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	} catch (error) {
		console.error("ÜRÜN OLUŞTURMA HATASI:", error);
		res.status(400).json({ message: "Ürün oluşturulamadı", error: error.message });
	}
});

// @desc    Bir ürünü güncelle (sadece admin)
// @route   PUT /api/products/:id
router.put("/:id", protect, admin, async (req, res) => {
	const { name, price, category, imageUrl, description } = req.body;
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.name = name || product.name;
			product.price = price || product.price;
			product.category = category || product.category;
			product.imageUrl = imageUrl || product.imageUrl;
			product.description = description || product.description;
			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Güncellenecek ürün bulunamadı" });
		}
	} catch (error) {
		console.error("Ürün güncelleme hatası:", error);
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

// @desc    Bir ürünü sil (sadece admin)
// @route   DELETE /api/products/:id
router.delete("/:id", protect, admin, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			await Product.findByIdAndDelete(req.params.id);
			res.json({ message: "Ürün başarıyla silindi" });
		} else {
			res.status(404).json({ message: "Ürün bulunamadı" });
		}
	} catch (error) {
		console.error("Ürün silme hatası:", error);
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

// @desc    Bir ürünün öne çıkan durumunu değiştir (sadece admin)
// @route   PUT /api/products/:id/togglefeature
router.put("/:id/togglefeature", protect, admin, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Ürün bulunamadı" });
		}
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

export default router;
