// src/components/ProductList.js - GÜNCELLENMİŞ HALİ
import React from "react";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard"; // SkeletonCard'ı import et
import "./ProductList.css";

function ProductList({ products, loading }) {
	// Yüklenme durumunda gösterilecek iskelet kartlarının sayısı
	const skeletonCount = 8;

	return (
		<div className="product-list-container">
			{loading ? (
				// Eğer sayfa yükleniyorsa, 8 tane iskelet kartı göster
				Array.from({ length: skeletonCount }).map((_, index) => (
					<SkeletonCard key={index} />
				))
			) : products && products.length > 0 ? (
				// Yükleme bittiyse ve ürün varsa, gerçek ürün kartlarını göster
				products.map((product) => <ProductCard key={product._id} product={product} />)
			) : (
				// Yükleme bittiyse ve ürün yoksa, mesajı göster
				<p className="no-products-message">Gösterilecek ürün bulunamadı.</p>
			)}
		</div>
	);
}
export default ProductList;
