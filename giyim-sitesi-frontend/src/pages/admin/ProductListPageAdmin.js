// src/pages/admin/ProductListPageAdmin.js - VİTRİN BUTONU EKLENMİŞ HALİ
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./ProductListPageAdmin.css";

function ProductListPageAdmin() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { userInfo } = useAuth();

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/products");
				const data = await response.json();
				if (response.ok) {
					setProducts(data);
				}
			} catch (error) {
				toast.error("Ürünler getirilirken bir hata oluştu.");
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	// ÖNE ÇIKAN DURUMUNU DEĞİŞTİREN FONKSİYON
	const toggleFeatureHandler = async (id) => {
		try {
			const response = await fetch(`/api/products/${id}/togglefeature`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${userInfo.token}`,
				},
			});
			const updatedProduct = await response.json();
			if (response.ok) {
				// Listeyi anında güncellemek için state'i set et
				setProducts((currentProducts) =>
					currentProducts.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
				);
				toast.success("Ürünün vitrin durumu güncellendi.");
			} else {
				throw new Error(updatedProduct.message);
			}
		} catch (error) {
			toast.error(`Bir hata oluştu: ${error.message}`);
		}
	};

	const deleteHandler = async (id) => {
		if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
			try {
				await fetch(`/api/products/${id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				setProducts(products.filter((p) => p._id !== id));
				toast.success("Ürün başarıyla silindi.");
			} catch (error) {
				toast.error("Ürün silinirken bir hata oluştu.");
			}
		}
	};

	return (
		<div className="product-list-admin">
			<div className="list-header">
				<h1>Ürün Yönetimi</h1>
				<Link to="/admin/add-product" className="btn-create">
					<i className="fas fa-plus"></i> Yeni Ürün Ekle
				</Link>
			</div>
			{loading ? (
				<p>Yükleniyor...</p>
			) : (
				<table className="admin-table">
					<thead>
						{/* YENİ SÜTUN: ÖNE ÇIKAN */}
						<tr>
							<th>ID</th>
							<th>İSİM</th>
							<th>FİYAT</th>
							<th>KATEGORİ</th>
							<th>ÖNE ÇIKAN</th>
							<th>İŞLEMLER</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>{product._id.substring(0, 8)}...</td>
								<td>{product.name}</td>
								<td>{product.price ? product.price.toFixed(2) : "N/A"} TL</td>
								<td>{product.category}</td>
								{/* YENİ SÜTUN VERİSİ */}
								<td
									style={{
										fontWeight: "bold",
										color: product.isFeatured ? "#28a745" : "#dc3545",
									}}
								>
									{product.isFeatured ? "Evet" : "Hayır"}
								</td>
								<td className="action-buttons">
									<Link
										to={`/admin/product/${product._id}/edit`}
										className="btn-edit"
									>
										Düzenle
									</Link>
									<button
										onClick={() => deleteHandler(product._id)}
										className="btn-delete"
									>
										Sil
									</button>
									<button
										onClick={() => toggleFeatureHandler(product._id)}
										className="btn-feature"
									>
										{product.isFeatured ? "Vitrinden Kaldır" : "Vitrine Ekle"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
export default ProductListPageAdmin;
