// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || null);
	const navigate = useNavigate();

	const login = async (email, password) => {
		try {
			const response = await fetch("/api/users/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (response.ok) {
				localStorage.setItem("userInfo", JSON.stringify(data));
				setUserInfo(data);
				toast.success(`Hoş geldin, ${data.name}!`); // ALERT YERİNE TOAST.SUCCESS
				navigate("/");
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			toast.error(error.message || "Giriş yapılamadı."); // HATA DURUMUNDA TOAST.ERROR
			throw error;
		}
	};

	const logout = () => {
		// React'in state zincirini ve olası çakışmaları baypas etmek için
		// hata vermediği kanıtlanmış olan en garantili ve kararlı yönteme geri dönüyoruz.

		// 1. Önce tarayıcı hafızasını temizle
		localStorage.removeItem("userInfo");

		// 2. Tarayıcıyı doğrudan /login sayfasına yönlendir ve sayfayı tamamen yenileterek
		// tüm context ve state'lerin temiz bir başlangıç yapmasını sağla.
		window.location.href = "/login";
	};

	const value = {
		userInfo,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
