// src/pages/ProductDetailPage.js - TAM VE DOĞRU HALİ

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Rating from "../components/Rating"; // Rating bileşenini import ediyoruz
import "./ProductDetailPage.css";
import "./AddProductPage.css"; // Form stilleri için
import toast from "react-hot-toast";

function ProductDetailPage() {
	const { id: productId } = useParams();
	const navigate = useNavigate();
	const { addToCart } = useCart();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Yorum formu için state'ler
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const userInfo = JSON.parse(localStorage.getItem("userInfo"));

	// Ürün verisini çekmek için useEffect
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/products/${productId}`);
				const data = await response.json();
				if (response.ok) {
					setProduct(data);
				} else {
					throw new Error(data.message || "Ürün detayı getirilemedi.");
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [productId]);

	// Yorum gönderme fonksiyonu
	const submitReviewHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`/api/products/${productId}/reviews`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
				body: JSON.stringify({ rating, comment }),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Yorumunuz başarıyla eklendi!");
				setRating(0);
				setComment("");
				// Sayfayı yeniden yükleyerek en güncel yorumları ve puanı göster
				window.location.reload();
			} else {
				throw new Error(data.message || "Yorum eklenemedi.");
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleAddToCart = () => {
		addToCart(product);
		alert(`${product.name} sepete eklendi!`);
	};

	if (loading)
		return (
			<div className="container">
				<h2>Yükleniyor...</h2>
			</div>
		);
	if (error)
		return (
			<div className="container">
				<h2>Hata: {error}</h2>
			</div>
		);
	if (!product)
		return (
			<div className="container">
				<h2>Ürün Bulunamadı.</h2>
			</div>
		);

	const hasReviewed = product.reviews.some((review) => review.user === userInfo?._id);

	return (
		<div className="container">
			{/* ---- EKSİK OLAN VE ŞİMDİ EKLENEN KISIM ---- */}
			<div className="product-detail-container">
				<div className="product-detail-image">
					<img src={product.imageUrl} alt={product.name} />
				</div>
				<div className="product-detail-info">
					<h1 className="product-detail-name">{product.name}</h1>
					{/* Ortalama puanı ve yorum sayısını burada gösteriyoruz */}
					<Rating value={product.rating} text={`${product.numReviews} değerlendirme`} />
					<p className="product-detail-price">{product.price.toFixed(2)} TL</p>
					<h3>Ürün Açıklaması</h3>
					<p className="product-detail-description">{product.description}</p>
					<button className="add-to-cart-btn" onClick={handleAddToCart}>
						Sepete Ekle
					</button>
				</div>
			</div>
			{/* ---- EKSİK KISIM BİTTİ ---- */}

			{/* Yorumlar Bölümü (Bu kısım zaten çalışıyordu) */}
			<div className="reviews-section">
				<h2>Değerlendirmeler</h2>
				{product.reviews.length === 0 && <p>Bu ürün için henüz yorum yapılmamış.</p>}
				<div className="reviews-list">
					{product.reviews.map((review) => (
						<div key={review._id} className="review-item">
							<strong>{review.name}</strong>
							<Rating value={review.rating} />
							<p>{review.comment}</p>
							<small>{new Date(review.createdAt).toLocaleDateString()}</small>
						</div>
					))}
				</div>

				<div className="review-form-container">
					<h3>Bir Yorum Yazın</h3>
					{userInfo ? (
						hasReviewed ? (
							<p>Bu ürüne zaten yorum yaptınız.</p>
						) : (
							<form onSubmit={submitReviewHandler} className="add-product-form">
								<div className="form-group">
									<label>Puanınız</label>
									<select
										value={rating}
										onChange={(e) => setRating(e.target.value)}
										required
									>
										<option value="">Seçin...</option>
										<option value="1">1 - Çok Kötü</option>
										<option value="2">2 - Kötü</option>
										<option value="3">3 - Orta</option>
										<option value="4">4 - İyi</option>
										<option value="5">5 - Mükemmel</option>
									</select>
								</div>
								<div className="form-group">
									<label>Yorumunuz</label>
									<textarea
										rows="4"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										required
									></textarea>
								</div>
								<button type="submit" className="submit-btn">
									Gönder
								</button>
							</form>
						)
					) : (
						<p>
							Yorum yazmak için lütfen <Link to="/login">giriş yapın</Link>.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProductDetailPage;
