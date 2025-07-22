// src/pages/HomePage.js - NİHAİ VE DOĞRU HALİ

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";
import ProductList from "../components/ProductList";
import toast from "react-hot-toast";

// Lütfen bu yolun kendi projenle uyumlu olduğunu kontrol et
import yeniBannerImage from "./assets/images/banner.jpg";

function HomePage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true); // Yüklenme durumu için state ekledik
	const { userInfo } = useAuth();

	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			try {
				// DEĞİŞİKLİK BURADA: Artık tüm ürünleri değil, sadece öne çıkanları çekiyoruz
				const response = await fetch("/api/products/featured");
				const data = await response.json();
				setProducts(data);
			} catch (error) {
				console.error("Öne çıkan ürünler çekilirken hata:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchFeaturedProducts();
	}, []);

	return (
		<div className="homepage-container">
			<section className="hero-banner">
				<img src={yeniBannerImage} alt="Yeni Sezon Banner" />
				<div className="banner-text">
					<h1>Yeni Sezon, Yeni Heyecan</h1>
					<p>En trend parçaları keşfetmek için koleksiyonlarımıza göz atın.</p>
					<a href="#categories" className="banner-button">
						Koleksiyonları Gör
					</a>
				</div>
			</section>

			<section id="categories" className="featured-categories">
				<div className="container">
					<h2>Kategorileri Keşfet</h2>
					<div className="category-items">
						<Link to="/kategori/erkek" className="category-card">
							<h3>Erkek</h3>
						</Link>
						<Link to="/kategori/kadin" className="category-card">
							<h3>Kadın</h3>
						</Link>
						<Link to="/kategori/cocuk" className="category-card">
							<h3>Çocuk</h3>
						</Link>
						<Link to="/kategori/koleksiyon" className="category-card">
							<h3>Koleksiyon</h3>
						</Link>
					</div>
				</div>
			</section>

			<div className="container">
				<h2 className="category-title">Öne Çıkan Ürünler</h2>
				{loading ? (
					<p>Yükleniyor...</p>
				) : (
					// DEĞİŞİKLİK: Artık ProductList'e silme fonksiyonu geçmiyoruz
					<ProductList products={products} loading={loading} />
				)}
			</div>
		</div>
	);
}

export default HomePage;
