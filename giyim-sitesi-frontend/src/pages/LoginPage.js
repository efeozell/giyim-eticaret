// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProductPage.css"; // Ürün ekleme sayfasındaki form stillerini tekrar kullanabiliriz
import "./LoginPage.css";
import { useAuth } from "../context/AuthContext.js";
import Message from "../components/Message.js";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await login(email, password); // Sadece bu fonksiyonu çağır
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-product-container">
			<h2>Giriş Yap</h2>

			{loading && <p>Giriş yapılıyor...</p>}
			<form onSubmit={handleSubmit} className="add-product-form">
				<div className="form-group">
					<label htmlFor="email">Email Adresi</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Şifre</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="submit-btn">
					Giriş Yap
				</button>
			</form>
		</div>
	);
}

export default LoginPage;
