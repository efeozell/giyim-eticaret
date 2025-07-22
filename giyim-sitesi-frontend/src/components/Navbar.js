// src/components/Navbar.js

import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.js";
import SearchBox from "./SearchBox.js"; // Arama çubuğunu import ediyoruz
import { useAuth } from "../context/AuthContext.js";

function Navbar() {
	const navigate = useNavigate();
	const { itemsCount } = useCart();
	const { userInfo, logout } = useAuth();

	const logoutHandler = () => {
		logout(); // Sadece context'teki logout'u çağır
	};

	return (
		<nav className="navbar">
			{/* Logo */}
			<Link to="/" className="navbar-logo">
				MODA.
			</Link>

			{/* Arama Çubuğu */}
			<div className="navbar-search">
				<SearchBox />
			</div>

			{/* Kategori Linkleri - Bu bölümü ihtiyacına göre sadeleştirebilir veya olduğu gibi bırakabilirsin */}
			<ul className="navbar-links">
				<li>
					<Link to="/">Ana Sayfa</Link>
				</li>
				<li>
					<Link to="/kategori/erkek">Erkek</Link>
				</li>
				<li>
					<Link to="/kategori/kadin">Kadın</Link>
				</li>
				<li>
					<Link to="/kategori/cocuk">Çocuk</Link>
				</li>
			</ul>

			{/* Sağ Taraftaki Kontrol Grubu (Kullanıcı İşlemleri + Sepet) */}
			<div className="navbar-controls">
				<div className="admin-menu">
					{userInfo ? (
						// EĞER KULLANICI GİRİŞ YAPMIŞSA (ADMİN VEYA NORMAL):
						<div className="dropdown">
							<button className="dropdown-toggle">
								{userInfo.name} <i className="fas fa-chevron-down"></i>
							</button>
							<div className="dropdown-menu">
								<Link to="/profil">Profilim & Siparişler</Link>
								<Link to="/favoriler">Favorilerim</Link>
								{userInfo.isAdmin && (
									<>
										<hr />
										<Link to="/admin/dashboard">Yönetim Paneli</Link>
									</>
								)}
								<hr />
								<button onClick={logoutHandler} className="logout-btn-dropdown">
									Çıkış Yap
								</button>
							</div>
						</div>
					) : (
						// EĞER HİÇ KİMSE GİRİŞ YAPMAMIŞSA:
						<div className="guest-menu" style={{ display: "flex", gap: "0.5rem" }}>
							<Link to="/login" className="nav-link-button">
								Giriş Yap
							</Link>
							<Link to="/register" className="nav-link-button register-btn">
								Kayıt Ol
							</Link>
						</div>
					)}
				</div>

				{/* Sepet Linki ve İkonu */}
				<Link to="/sepet" className="nav-cart-link">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="9" cy="21" r="1"></circle>
						<circle cx="20" cy="21" r="1"></circle>
						<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
					</svg>
					{itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
				</Link>
			</div>
		</nav>
	);
}

export default Navbar;
