// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProductPage.css";
import toast from "react-hot-toast";

function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		// ... (LoginPage'deki handleSubmit'e çok benzer,
		// sadece fetch adresi '/api/users/register' ve body'de 'name' de olacak) ...
		try {
			const response = await fetch("http://localhost:5001/api/users/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Kayıt başarısız.");
			toast.success("Kayıt başarılı! Lütfen giriş yapın.");
			navigate("/login");
		} catch (error) {
			toast.error(`Hata: ${error.message}`);
		}
	};

	return (
		<div className="add-product-container">
			<h2>Kayıt Ol</h2>
			<form onSubmit={handleSubmit} className="add-product-form">
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
					<label>Şifre</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="submit-btn">
					Kayıt Ol
				</button>
			</form>
		</div>
	);
}

export default RegisterPage;
