// src/components/layout/AdminLayout.js
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
	return (
		<div className="admin-container">
			<aside className="admin-sidebar">
				<nav className="admin-nav">
					{/* NavLink, aktif olan linke bir class ekler, bu da stil vermemizi sağlar */}
					<NavLink
						to="/admin/dashboard"
						className={({ isActive }) => (isActive ? "active-link" : "")}
					>
						Dashboard
					</NavLink>
					<NavLink
						to="/admin/urunler"
						className={({ isActive }) => (isActive ? "active-link" : "")}
					>
						Ürün Yönetimi
					</NavLink>
					<NavLink
						to="/admin/siparisler"
						className={({ isActive }) => (isActive ? "active-link" : "")}
					>
						Sipariş Yönetimi
					</NavLink>
					<NavLink
						to="/admin/kullanicilar"
						className={({ isActive }) => (isActive ? "active-link" : "")}
					>
						Kullanici Yönetimi
					</NavLink>
					{/* <NavLink to="/admin/siparisler">Sipariş Yönetimi</NavLink> */}
					{/* <NavLink to="/admin/kullanicilar">Kullanıcı Yönetimi</NavLink> */}
				</nav>
			</aside>
			<main className="admin-content">
				{/* Alt rotaların render edileceği yer */}
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
