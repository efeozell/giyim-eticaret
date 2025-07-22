// src/pages/PlaceOrderPage.js - GÜNCEL VE TAM HALİ

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css"; // Sepet sayfası stillerini kullanabiliriz
import "./AddProductPage.css"; // Form stillerini de kullanabiliriz
import toast from "react-hot-toast";

function PlaceOrderPage() {
	const navigate = useNavigate();
	const { cartItems, cartTotal, clearCart } = useCart();

	const [orderPlaced, setOrderPlaced] = useState(false);

	// localStorage'dan diğer bilgileri al
	const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));
	const paymentMethod = JSON.parse(localStorage.getItem("paymentMethod"));
	const userInfo = JSON.parse(localStorage.getItem("userInfo"));

	// Güvenlik: Gerekli bilgiler yoksa kullanıcıyı önceki sayfalara yönlendir
	useEffect(() => {
		if (!orderPlaced) {
			if (!paymentMethod) {
				navigate("/odeme");
			} else if (!shippingAddress) {
				navigate("/kargo");
			}
		}
	}, [paymentMethod, shippingAddress, navigate, orderPlaced]);

	const placeOrderHandler = async () => {
		try {
			const orderData = {
				orderItems: cartItems.map(({ _id, name, qty, imageUrl, price }) => ({
					product: _id,
					name,
					qty,
					image: imageUrl,
					price,
				})),
				shippingAddress: shippingAddress,
				paymentMethod: paymentMethod,
				totalPrice: cartTotal,
			};

			const response = await fetch("http://localhost:5001/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
				body: JSON.stringify(orderData),
			});

			const createdOrder = await response.json();

			if (!response.ok) {
				throw new Error(createdOrder.message || "Sipariş oluşturulamadı.");
			}

			setOrderPlaced(true);

			clearCart(); // Sipariş başarılıysa sepeti ve ilgili localStorage'ları temizle
			localStorage.removeItem("shippingAddress");
			localStorage.removeItem("paymentMethod");

			toast.success("Siparişiniz başarıyla alındı!");
			// Gelecekte kullanıcıyı sipariş detay sayfasına yönlendirebiliriz: navigate(`/siparis/${createdOrder._id}`);
			navigate("/"); // Şimdilik ana sayfaya yönlendir

			window.location.reload();
		} catch (error) {
			toast.error(`Hata: ${error.message}`);
		}
	};

	return (
		<div className="container cart-page">
			<h1>Sipariş Özeti</h1>
			<div className="cart-container">
				<div className="cart-items">
					<div className="order-summary-section">
						<h2>Kargo Adresi</h2>
						<p>
							{shippingAddress?.address}, {shippingAddress?.city},{" "}
							{shippingAddress?.postalCode}, {shippingAddress?.country}
						</p>
					</div>
					<hr />
					<div className="order-summary-section">
						<h2>Ödeme Yöntemi</h2>
						<p>Yöntem: {paymentMethod}</p>
					</div>
					<hr />
					<div className="order-summary-section">
						<h2>Sipariş Edilen Ürünler</h2>
						{cartItems.length === 0 ? (
							<p>Sipariş verilecek ürün yok.</p>
						) : (
							<div>
								{cartItems.map((item) => (
									<div key={item._id} className="cart-item">
										<img
											src={item.imageUrl}
											alt={item.name}
											className="cart-item-image"
										/>
										<div className="cart-item-details">
											<Link
												to={`/urun/${item._id}`}
												className="cart-item-name"
											>
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
						)}
					</div>
				</div>
				<div className="cart-summary">
					<h2>Sipariş Toplamı</h2>
					<div className="summary-row">
						<span>Ürünler Toplamı</span>
						<span>{cartTotal} TL</span>
					</div>
					<div className="summary-row">
						<span>Kargo</span>
						<span>Ücretsiz</span>
					</div>
					<div className="summary-row total">
						<span>Genel Toplam</span>
						<span>{cartTotal} TL</span>
					</div>
					<button
						className="btn-checkout"
						disabled={cartItems.length === 0}
						onClick={placeOrderHandler}
					>
						Siparişi Onayla ve Ver
					</button>
				</div>
			</div>
		</div>
	);
}

export default PlaceOrderPage;
