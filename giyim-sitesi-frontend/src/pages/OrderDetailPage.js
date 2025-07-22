// src/pages/OrderDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CartPage.css"; // Sepet sayfası stillerini burada da kullanabiliriz

function OrderDetailPage() {
	const { id: orderId } = useParams(); // URL'den sipariş ID'sini al
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const userInfo = JSON.parse(localStorage.getItem("userInfo"));

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await fetch(`/api/orders/${orderId}`, {
					headers: {
						Authorization: `Bearer ${userInfo.token}`,
					},
				});
				const data = await response.json();
				if (response.ok) {
					setOrder(data);
				} else {
					throw new Error(data.message || "Sipariş detayı getirilemedi.");
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [orderId, userInfo.token]);

	if (loading)
		return (
			<div className="container">
				<h2>Sipariş Yükleniyor...</h2>
			</div>
		);
	if (error)
		return (
			<div className="container">
				<h2>Hata: {error}</h2>
			</div>
		);
	if (!order)
		return (
			<div className="container">
				<h2>Sipariş Bulunamadı.</h2>
			</div>
		);

	return (
		<div className="container cart-page">
			<h1>Sipariş #{order._id}</h1>
			<div className="cart-container">
				<div className="cart-items">
					<div className="order-summary-section">
						<h2>Kargo Adresi</h2>
						<p>
							<strong>İsim:</strong> {order.user.name}
						</p>
						<p>
							<strong>Email:</strong> {order.user.email}
						</p>
						<p>
							<strong>Adres:</strong> {order.shippingAddress.address},{" "}
							{order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
							{order.shippingAddress.country}
						</p>
						<p
							style={{
								color: order.isDelivered ? "green" : "red",
								fontWeight: "bold",
							}}
						>
							{order.isDelivered
								? `Teslim Edildi (${order.deliveredAt})`
								: "Teslim Edilmedi"}
						</p>
					</div>
					<hr />
					<div className="order-summary-section">
						<h2>Ödeme Bilgileri</h2>
						<p>
							<strong>Yöntem:</strong> {order.paymentMethod}
						</p>
						<p style={{ color: order.isPaid ? "green" : "red", fontWeight: "bold" }}>
							{order.isPaid ? `Ödendi (${order.paidAt})` : "Ödenmedi"}
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
				<div className="cart-summary">
					<h2>Sipariş Toplamı</h2>
					<div className="summary-row total">
						<span>Genel Toplam</span>
						<span>{order.totalPrice.toFixed(2)} TL</span>
					</div>
					{/* Buraya ileride admin için 'Teslim Edildi Olarak İşaretle' butonu gelebilir */}
				</div>
			</div>
		</div>
	);
}

export default OrderDetailPage;
