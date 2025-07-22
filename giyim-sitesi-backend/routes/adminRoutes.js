import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";

const router = express.Router();

router.get("/stats", protect, admin, async (req, res) => {
	try {
		const userCount = await User.countDocuments();
		const productCount = await Product.countDocuments();
		const orderCount = await Order.countDocuments();

		const salesData = await Order.aggregate([
			{
				$group: {
					_id: null,
					totalSales: { $sum: "$totalPrice" },
				},
			},
		]);

		const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

		res.json({ userCount, productCount, orderCount, totalSales });
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatasi " });
	}
});

router.get("/users", protect, admin, async (req, res) => {
	try {
		const users = await User.find({});
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatasi" });
	}
});

router.delete("/users/:id", protect, admin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			if (user.isAdmin) {
				return res.status(400).json({ message: "Admin kullanıcılar silinemez." });
			}
			await User.findByIdAndDelete(req.params.id);
			res.json({ message: "Kullanıcı başarıyla silindi." });
		} else {
			res.status(404).json({ message: "Kullanıcı bulunamadı." });
		}
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

router.put("/users/:id", protect, admin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			user.isAdmin = req.body.isAdmin;
			const updatedUser = await user.save();
			res.json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
			});
		} else {
			res.status(404).json({ message: "Kullanıcı bulunamadı" });
		}
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

export default router;
