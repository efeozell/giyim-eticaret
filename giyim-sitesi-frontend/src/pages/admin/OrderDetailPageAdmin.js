// src/pages/admin/OrderDetailPageAdmin.js - TAM VE DOĞRU HALİ

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "../CartPage.css"; // Stil için sepet sayfasının CSS'ini kullanabiliriz

function OrderDetailPageAdmin() {
	const { id: orderId } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { userInfo } = useAuth();

	useEffect(() => {
		const fetchOrderDetails = async () => {
			if (userInfo?.token) {
				try {
					setLoading(true);
					const response = await fetch(`/api/orders/${orderId}`, {
						headers: { Authorization: `Bearer ${userInfo.token}` },
					});
					const data = await response.json();
					if (response.ok) {
						setOrder(data);
					} else {
						throw new Error(data.message);
					}
				} catch (err) {
					setError(err.message || "Sipariş detayı getirilemedi.");
				} finally {
					setLoading(false);
				}
			}
		};
		fetchOrderDetails();
	}, [orderId, userInfo]);

	const markAsDeliveredHandler = async () => {
		if (
			window.confirm(
				'Bu siparişi "Teslim Edildi" olarak işaretlemek istediğinize emin misiniz?'
			)
		) {
			try {
				const response = await fetch(`/api/orders/${orderId}/deliver`, {
					method: "PUT",
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				const updatedOrder = await response.json();
				if (response.ok) {
					setOrder(updatedOrder); // State'i güncelleyerek sayfanın anında değişmesini sağla
					toast.success("Sipariş durumu güncellendi!");
				} else {
					throw new Error(updatedOrder.message);
				}
			} catch (err) {
				toast.error(err.message || "İşlem başarısız.");
			}
		}
	};

	if (loading)
		return (
			<div className="container" style={{ marginTop: "2rem" }}>
				<h2>Sipariş Detayları Yükleniyor...</h2>
			</div>
		);
	if (error)
		return (
			<div className="container" style={{ marginTop: "2rem" }}>
				<h2>Hata: {error}</h2>
			</div>
		);
	if (!order)
		return (
			<div className="container" style={{ marginTop: "2rem" }}>
				<h2>Sipariş Bulunamadı.</h2>
			</div>
		);

	return (
		<div className="container cart-page" style={{ marginTop: "2rem" }}>
			<button onClick={() => navigate(-1)} className="btn-back">
				Geri Dön
			</button>
			<h1>Sipariş Detayları (#{order._id.substring(0, 10)}...)</h1>
			<div className="cart-container">
				{/* --- EKSİK OLAN VE ŞİMDİ EKLENEN KISIM --- */}
				<div className="cart-items">
					<div className="order-summary-section">
						<h2>Kargo Adresi</h2>
						<p>
							<strong>İsim:</strong> {order.user.name}
						</p>
						<p>
							<strong>Email:</strong>{" "}
							<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
						</p>
						<p>
							<strong>Adres:</strong> {order.shippingAddress.address},{" "}
							{order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
							{order.shippingAddress.country}
						</p>
						<p
							style={{
								marginTop: "1rem",
								fontWeight: "bold",
								color: order.isDelivered ? "green" : "red",
							}}
						>
							{order.isDelivered
								? `Teslim Edildi: ${new Date(order.deliveredAt).toLocaleString()}`
								: "Teslim Edilmedi"}
						</p>
					</div>
					<hr />
					<div className="order-summary-section">
						<h2>Ödeme Bilgileri</h2>
						<p>
							<strong>Yöntem:</strong> {order.paymentMethod}
						</p>
						<p style={{ fontWeight: "bold", color: order.isPaid ? "green" : "red" }}>
							{order.isPaid
								? `Ödendi: ${new Date(order.paidAt).toLocaleString()}`
								: "Ödenmedi"}
						</p>
					</div>
					<hr />
					<div className="order-summary-section">
						<h2>Sipariş Edilen Ürünler</h2>
						{order.orderItems.map((item) => (
							<div key={item.product} className="cart-item">
								<img src={item.image} alt={item.name} className="cart-item-image" />
								<div className="cart-item-details">
									<Link to={`/urun/${item.product}`} className="cart-item-name">
										{item.name}
									</Link>
									<div className="cart-item-summary-details">
										{item.qty} x {item.price.toFixed(2)} TL ={" "}
										<b>{(item.qty * item.price).toFixed(2)} TL</b>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				{/* --- EKSİK KISIM BİTTİ --- */}

				<div className="cart-summary">
					<h2>Sipariş Toplamı</h2>
					<div className="summary-row">
						<span>Ürünler Toplamı:</span>
						<span>{order.totalPrice.toFixed(2)} TL</span>
					</div>
					<div className="summary-row">
						<span>Kargo:</span>
						<span>Ücretsiz</span>
					</div>
					<div className="summary-row total">
						<span>Genel Toplam:</span>
						<span>{order.totalPrice.toFixed(2)} TL</span>
					</div>

					{/* Admin Aksiyonları */}
					{!order.isDelivered && (
						<button
							className="btn-checkout"
							style={{ marginTop: "1rem", backgroundColor: "#007bff" }}
							onClick={markAsDeliveredHandler}
						>
							Teslim Edildi Olarak İşaretle
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
export default OrderDetailPageAdmin;
