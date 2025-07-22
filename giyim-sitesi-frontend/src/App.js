// src/App.js - TÜM ROTALARIN EKLENDİĞİ NİHAİ HALİ

import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

// Bileşenleri Import Et
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import AdminRoute from "./components/routing/AdminRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";

// Sayfaları Import Et
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import ProfilePage from "./pages/ProfilePage";
import OrderDetailPage from "./pages/OrderDetailPage";
import FavoritesPage from "./pages/FavoritesPage"; // Favoriler sayfasını import et
import SearchPage from "./pages/SearchPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import ProductListPageAdmin from "./pages/admin/ProductListPageAdmin";
import OrderListPageAdmin from "./pages/admin/OrderListPageAdmin";
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import UserListPageAdmin from "./pages/admin/UserListPageAdmin";
import OrderDetailPageAdmin from "./pages/admin/OrderDetailPageAdmin";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<div className="App">
			<Navbar />
			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						background: "#363636",
						color: "#fff",
						padding: "16px",
						borderRadius: "8px",
						minWidth: "300px",
						fontSize: "1rem",
					},

					success: {
						iconTheme: {
							primary: "#10B981",
							secondary: "white",
						},
					},

					error: {
						iconTheme: {
							primary: "#EF4444",
							secondary: "white",
						},
					},
				}}
			/>
			<main>
				<Routes>
					{/* --- Herkese Açık Rotalar --- */}
					<Route path="/" element={<HomePage />} />
					<Route path="/kategori/:categoryName" element={<CategoryPage />} />
					<Route path="/urun/:id" element={<ProductDetailPage />} />
					<Route path="/sepet" element={<CartPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/arama" element={<SearchPage />} />

					{/* --- Sadece Giriş Yapmış KULLANICILARIN Erişebileceği Rotalar --- */}
					<Route path="" element={<ProtectedRoute />}>
						<Route path="/profil" element={<ProfilePage />} />
						<Route path="/siparis/:id" element={<OrderDetailPage />} />
						<Route path="/kargo" element={<ShippingPage />} />
						<Route path="/odeme" element={<PaymentPage />} />
						<Route path="/siparis-ver" element={<PlaceOrderPage />} />

						{/* EKSİK OLAN VE ŞİMDİ EKLENEN ROTA */}
						<Route path="/favoriler" element={<FavoritesPage />} />
					</Route>

					{/* --- Sadece ADMİNLERİN Erişebileceği Rotalar --- */}
					<Route path="/admin" element={<AdminRoute />}>
						<Route element={<AdminLayout />}>
							<Route index element={<Navigate to="dashboard" replace />} />
							<Route path="dashboard" element={<AdminDashboardPage />} />
							<Route path="urunler" element={<ProductListPageAdmin />} />
							<Route path="siparisler" element={<OrderListPageAdmin />} />
							<Route path="kullanicilar" element={<UserListPageAdmin />} />
						</Route>
						<Route path="siparis/:id" element={<OrderDetailPageAdmin />} />
						<Route path="add-product" element={<AddProductPage />} />
						<Route path="product/:id/edit" element={<EditProductPage />} />
					</Route>
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
