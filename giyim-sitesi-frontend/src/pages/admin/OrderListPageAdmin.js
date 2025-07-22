// src/pages/admin/OrderListPageAdmin.js - DOĞRU HALİ

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./ProductListPageAdmin.css"; // Ortak tablo stillerini kullanıyoruz

function OrderListPageAdmin() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const { userInfo } = useAuth();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch("/api/orders", {
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
				setLoading(false);
			}
		};
		if (userInfo.token) {
			fetchOrders();
		}
	}, [userInfo.token]);

	return (
		<div className="product-list-admin">
			<h1>Sipariş Yönetimi</h1>
			{loading ? (
				<p>Yükleniyor...</p>
			) : (
				<table className="admin-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>KULLANICI</th>
							<th>TARİH</th>
							<th>TOPLAM</th>
							<th>TESLİM DURUMU</th>
							<th>İŞLEMLER</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>{order._id.substring(0, 8)}...</td>
								<td>{order.user ? order.user.name : "Silinmiş Kullanıcı"}</td>
								<td>{new Date(order.createdAt).toLocaleDateString()}</td>
								<td>{order.totalPrice.toFixed(2)} TL</td>
								<td style={{ color: order.isDelivered ? "green" : "red" }}>
									{order.isDelivered ? "Teslim Edildi" : "Bekliyor"}
								</td>
								<td>
									{/* --- DÜZELTME BURADA --- */}
									{/* Linkin başına '/' ekleyerek bunun mutlak bir yol olduğunu belirtiyoruz */}
									<Link to={`/admin/siparis/${order._id}`} className="btn-edit">
										Detay
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default OrderListPageAdmin;
