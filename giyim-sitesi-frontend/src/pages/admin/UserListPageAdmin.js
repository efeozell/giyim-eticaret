// src/pages/admin/UserListPageAdmin.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./ProductListPageAdmin.css"; // Aynı tablo stillerini kullanabiliriz

function UserListPageAdmin() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const { userInfo } = useAuth();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("/api/admin/users", {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				const data = await response.json();
				if (response.ok) setUsers(data);
			} catch (error) {
				toast.error("Kullanıcılar getirilirken hata oluştu.");
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, [userInfo.token]);

	const toggleAdminHandler = async (user) => {
		if (
			window.confirm(
				`${user.name} kullanıcısının admin yetkisini değiştirmek istediğinize emin misiniz?`
			)
		) {
			try {
				const response = await fetch(`/api/admin/users/${user._id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userInfo.token}`,
					},
					body: JSON.stringify({ isAdmin: !user.isAdmin }),
				});
				const updatedUser = await response.json();
				if (response.ok) {
					setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
					toast.success("Kullanıcının admin durumu güncellendi.");
				} else {
					toast.error(updatedUser.message || "İşlem başarısız.");
				}
			} catch (error) {
				toast.error("Kullanıcı güncellenirken bir hata oluştu.");
			}
		}
	};

	const deleteUserHandler = async (id) => {
		if (window.confirm("Bu kullaniciyi silmek istediğinize emin misiniz?")) {
			try {
				await fetch(`/api/users/${id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				setUsers(users.filter((p) => p._id !== id));
				toast.success("Kullanici Basariyla Silindi");
			} catch (error) {
				toast.error("Kullanici Silinirken Bir hata olustu.");
				console.error("Kullanici Silinirken Hata OLustu:", error);
			}
		}
	};

	return (
		<div className="product-list-admin">
			<h1>Kullanıcı Yönetimi</h1>
			{loading ? (
				<p>Yükleniyor...</p>
			) : (
				<table className="admin-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>İSİM</th>
							<th>EMAIL</th>
							<th>ADMİN</th>
							<th>İŞLEMLER</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td>{user.isAdmin ? "Evet" : "Hayır"}</td>
								<td>
									<button
										onClick={() => toggleAdminHandler(user)}
										className="btn-feature"
									>
										{user.isAdmin ? "Yetkiyi Al" : "Admin Yap"}
									</button>
									<button
										onClick={() => deleteUserHandler(user._id)}
										className="btn-delete"
									>
										Sil
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
export default UserListPageAdmin;
