// server.js - DOĞRU VE TAM HALİ

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Rota dosyalarını import ediyoruz
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --- EN KRİTİK KISIM ---
// Bu iki satır, gelen istekleri rotalara yönlendirmeden ÖNCE olmalıdır.
// Bu middleware, gelen JSON verilerini req.body içine doğru bir şekilde "açıp" koyar.
app.use(express.json());
app.use(cors());
// --- ---

// Test Rotası
app.get("/", (req, res) => {
	res.send("API çalışıyor...");
});

// API Rotaları
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
