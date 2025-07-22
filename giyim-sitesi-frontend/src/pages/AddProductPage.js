// src/pages/AddProductPage.js - GÜNCEL VE TAM HALİ

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./AddProductPage.css";

function AddProductPage() {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { userInfo } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault(); // Formun varsayılan gönderme davranışını engelle

		// Yüklenme durumunu başlat
		setLoading(true);

		const newProduct = { name, category, price: Number(price), imageUrl, description };

		console.log(
			"%cFrontend'den Gönderilen Ürün Paketi:",
			"color: blue; font-weight: bold;",
			newProduct
		);

		try {
			if (!userInfo || !userInfo.token) {
				toast.error("Bu işlemi yapmak için yetkiniz yok.");
				setLoading(false);
				return;
			}

			const response = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
				body: JSON.stringify(newProduct),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Ürün eklenemedi.");
			}

			toast.success("Ürün başarıyla eklendi!");
			// Admini, ürünleri görebileceği yönetim sayfasına yönlendir
			navigate("/admin/urunler");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-product-container">
			<h2>Yeni Ürün Ekle</h2>
			{loading && <p>Ekleniyor...</p>}
			<form onSubmit={handleSubmit} className="add-product-form">
				<div className="form-group">
					<label htmlFor="name">Ürün Adı</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="category">Kategori</label>
					<select
						id="category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						required
					>
						<option value="">Lütfen bir kategori seçin</option>
						<option value="erkek">Erkek</option>
						<option value="kadin">Kadın</option>
						<option value="cocuk">Çocuk</option>
						<option value="koleksiyon">Koleksiyon</option>
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="price">Fiyat</label>
					<input
						type="number"
						id="price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="imageUrl">Resim URL</label>
					<input
						type="text"
						id="imageUrl"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="description">Açıklama</label>
					<textarea
						id="description"
						rows="4"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>
				</div>
				<button type="submit" className="submit-btn" disabled={loading}>
					{loading ? "Ekleniyor..." : "Ürünü Ekle"}
				</button>
			</form>
		</div>
	);
}

export default AddProductPage;
