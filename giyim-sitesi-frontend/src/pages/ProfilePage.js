// src/pages/ProfilePage.js - EKSİKSİZ VE NİHAİ HALİ

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./ProfilePage.css";
import "./AddProductPage.css"; // Form stilleri için

function ProfilePage() {
	const [orders, setOrders] = useState([]);
	const [loadingOrders, setLoadingOrders] = useState(true);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const { userInfo } = useAuth();

	useEffect(() => {
		if (userInfo) {
			setName(userInfo.name);
			setEmail(userInfo.email);
		}

		const fetchOrders = async () => {
			if (userInfo && userInfo.token) {
				setLoadingOrders(true);
				try {
					const response = await fetch("/api/orders/myorders", {
						headers: { Authorization: `Bearer ${userInfo.token}` },
					});
					const data = await response.json();
					if (response.ok) {
						setOrders(data);
					} else {
						throw new Error(data.message);
					}
				} catch (error) {
					toast.error(error.message || "Siparişler getirilemedi.");
				} finally {
					setLoadingOrders(false);
				}
			} else {
				setLoadingOrders(false);
			}
		};

		fetchOrders();
	}, [userInfo]);

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password && password !== confirmPassword) {
			toast.error("Şifreler eşleşmiyor!");
			return;
		}
		try {
			const res = await fetch("/api/users/profile", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
				body: JSON.stringify({ name, email, password }),
			});
			const data = await res.json();
			if (res.ok) {
				localStorage.setItem("userInfo", JSON.stringify(data));
				toast.success("Profil başarıyla güncellendi!");
				window.location.reload();
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			toast.error(error.message || "Profil güncellenirken bir hata oluştu.");
		}
	};

	return (
		<div className="profile-page-container">
			<h1>Profilim</h1>
			<div className="profile-page">
				<div className="profile-details">
					<h2>Bilgileri Güncelle</h2>
					<form onSubmit={submitHandler} className="add-product-form">
						<div className="form-group">
							<label>İsim</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label>Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label>Yeni Şifre</label>
							<input
								type="password"
								placeholder="Değiştirmek için doldurun"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label>Yeni Şifre (Tekrar)</label>
							<input
								type="password"
								placeholder="Değiştirmek için doldurun"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
						<button type="submit" className="submit-btn">
							Güncelle
						</button>
					</form>
				</div>
				<div className="profile-orders">
					<h2>Siparişlerim</h2>
					{loadingOrders ? (
						<p>Siparişler Yükleniyor...</p>
					) : (
						<table className="orders-table">
							{/* --- EKSİK OLAN VE ŞİMDİ EKLENEN KISIM --- */}
							<thead>
								<tr>
									<th>ID</th>
									<th>TARİH</th>
									<th>TOPLAM</th>
									<th>ÖDENDİ</th>
									<th>TESLİM EDİLDİ</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order._id}>
										<td>{order._id.substring(0, 10)}...</td>
										<td>{new Date(order.createdAt).toLocaleDateString()}</td>
										<td>{order.totalPrice.toFixed(2)} TL</td>
										<td style={{ color: order.isPaid ? "green" : "red" }}>
											{order.isPaid ? "Evet" : "Hayır"}
										</td>
										<td style={{ color: order.isDelivered ? "green" : "red" }}>
											{order.isDelivered ? "Evet" : "Hayır"}
										</td>
										<td>
											<Link to={`/siparis/${order._id}`}>
												<button className="btn-details">Detaylar</button>
											</Link>
										</td>
									</tr>
								))}
							</tbody>
							{/* --- EKSİK KISIM BİTTİ --- */}
						</table>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
