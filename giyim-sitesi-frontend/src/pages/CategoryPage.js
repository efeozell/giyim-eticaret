// src/pages/CategoryPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import "./CategoryPage.css"; // Sayfaya özel stiller için yeni bir CSS dosyası

function CategoryPage() {
	const { categoryName } = useParams();
	const [products, setProducts] = useState([]); // State'in adını 'products' olarak değiştirmek daha anlaşılır
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProductsByCategory = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://localhost:5001/api/products?category=${categoryName}`
				);
				const data = await response.json();
				setProducts(data);
			} catch (error) {
				console.error(`${categoryName} ürünleri çekilirken hata:`, error);
			} finally {
				setLoading(false);
			}
		};
		fetchProductsByCategory();
	}, [categoryName]);

	// YENİ EKLENEN SİLME FONKSİYONU - MANTIK ARTIK BURADA
	const handleDelete = async (idToDelete) => {
		if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
			try {
				// 1. GİRİŞ YAPMIŞ KULLANICININ BİLGİLERİNİ LOCALSTORAGE'DAN AL
				const userInfo = JSON.parse(localStorage.getItem("userInfo"));

				// 2. KULLANICI GİRİŞ YAPMAMIŞSA VEYA JETONU YOKSA İŞLEMİ DURDUR
				if (!userInfo || !userInfo.token) {
					alert("Bu işlemi yapmak için giriş yapmalısınız.");
					return;
				}

				const response = await fetch(`http://localhost:5001/api/products/${idToDelete}`, {
					method: "DELETE",
					// 3. İSTEĞİN BAŞLIĞINA (HEADERS) YETKİLENDİRME BİLGİSİNİ EKLE
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userInfo.token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Ürün silinemedi. Yetkiniz olmayabilir.");
				}

				setProducts((currentProducts) =>
					currentProducts.filter((p) => p._id !== idToDelete)
				);
				alert("Ürün başarıyla silindi!");
			} catch (error) {
				alert(error.message);
			}
		}
	};

	return (
		<div className="container">
			<h2 className="category-title">
				{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Kategorisi
			</h2>
			{/* ProductList'e hem ürünleri hem de silme fonksiyonunu prop olarak geçiyoruz */}
			<ProductList products={products} loading={loading} onDeleteProduct={handleDelete} />
		</div>
	);
}

export default CategoryPage;
