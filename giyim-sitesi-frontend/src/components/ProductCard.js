// src/components/ProductCard.js - SADECE ÜRÜN GÖSTERİMİ İÇİN
import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
	const { _id, imageUrl, name, category, price } = product;
	const { userInfo } = useAuth();
	const { favoriteItems, toggleFavorite } = useFavorites();
	const isFavorite = favoriteItems.some((item) => item._id === _id);

	const handleFavoriteClick = (e) => {
		e.stopPropagation();
		e.preventDefault();
		toggleFavorite(_id);
	};

	return (
		<div className="product-card">
			{userInfo && (
				<button
					onClick={handleFavoriteClick}
					className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
				>
					<i className="fas fa-heart"></i>
				</button>
			)}
			<Link to={`/urun/${_id}`} className="product-link">
				<img src={imageUrl} alt={name} className="product-image" />
				<div className="product-info">
					<p className="product-category">{category}</p>
					<h3 className="product-name">{name}</h3>
					{/* Fiyatın varlığını kontrol etmeyi unutmuyoruz */}
					{price && <p className="product-price">{price.toFixed(2)} TL</p>}
				</div>
			</Link>
			{/* ADMİN BUTONLARI TAMAMEN KALDIRILDI */}
		</div>
	);
}

export default ProductCard;
