// routes/userRoutes.js
import express from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Yeni bir admin kullanıcısı kaydet
// @route   POST /api/users/register
// @access  Public
router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "Bu email ile bir kullanıcı zaten mevcut" });
		}

		const user = await User.create({ name, email, password });

		if (user) {
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
			});
		} else {
			res.status(400).json({ message: "Geçersiz kullanıcı verisi" });
		}
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// 1. Kullanıcıyı email'e göre veritabanında bul
		const user = await User.findOne({ email });

		// 2. Kullanıcı bulunduysa VE girdiği şifre doğruysa...
		if (user && (await user.matchPassword(password))) {
			// 3. Jeton (Token) oluştur
			const token = jwt.sign(
				{ id: user._id }, // Jetonun içine kullanıcının ID'sini koy
				process.env.JWT_SECRET, // .env'deki gizli anahtarla imzala
				{ expiresIn: "30d" } // Jeton 30 gün geçerli olsun
			);

			// 4. Frontend'e kullanıcı bilgilerini ve jetonu gönder
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				token: token,
			});
		} else {
			// Kullanıcı bulunamadıysa veya şifre yanlışsa 401 hatası gönder
			res.status(401).json({ message: "Geçersiz email veya şifre" });
		}
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

router.put("/favorites", protect, async (req, res) => {
	try {
		const { productId } = req.body;
		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({ message: "Kullanıcı bulunamadı" });
		}

		// Ürünün favoriler dizisindeki indeksini bul
		const index = user.favorites.indexOf(productId);

		if (index === -1) {
			// Eğer ürün favorilerde değilse, ekle
			user.favorites.push(productId);
		} else {
			// Eğer ürün favorilerdeyse, çıkar
			user.favorites.splice(index, 1);
		}

		await user.save();
		res.json(user.favorites); // Güncel favori ID listesini geri gönder
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

router.get("/favorites", protect, async (req, res) => {
	try {
		// .populate('favorites') sayesinde sadece ID'leri değil,
		// o ID'lere ait tüm ürün bilgilerini de getiriyoruz.
		const user = await User.findById(req.user._id).populate("favorites");

		if (!user) {
			return res.status(404).json({ message: "Kullanıcı bulunamadı" });
		}

		res.json(user.favorites); // Ürün detaylarıyla birlikte favori listesini gönder
	} catch (error) {
		res.status(500).json({ message: "Sunucu Hatası" });
	}
});

router.get("/profile", protect, async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404).json({ message: "Kullanici bulunamadi" });
	}
});

router.put("/profile", protect, async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		// Eğer kullanıcı yeni bir şifre gönderdiyse, onu da güncelle.
		// UserModel'deki 'pre-save' hook'umuz, bu yeni şifreyi otomatik olarak hash'leyecektir.
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		// Bilgiler güncellendiği için yeni bir token oluşturup geri gönderiyoruz.
		const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: token,
		});
	} else {
		res.status(404).json({ message: "Kullanıcı bulunamadı" });
	}
});

export default router;
