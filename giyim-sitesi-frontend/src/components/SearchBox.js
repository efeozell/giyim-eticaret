// src/components/SearchBox.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBox.css";
function SearchBox() {
	const [keyword, setKeyword] = useState("");
	const navigate = useNavigate();

	const submitHandler = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			navigate(`/arama?q=${keyword}`); // Kullanıcıyı arama sonuçları sayfasına yönlendir
			setKeyword(""); // Arama sonrası kutuyu temizle
		} else {
			navigate("/"); // Boş arama yaparsa anasayfaya yönlendir
		}
	};

	return (
		<form onSubmit={submitHandler} className="search-box">
			<input
				type="text"
				name="q"
				onChange={(e) => setKeyword(e.target.value)}
				value={keyword}
				placeholder="Ürün, marka veya kategori ara..."
				className="search-input"
			/>
			<button type="submit" className="search-button">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</button>
		</form>
	);
}

export default SearchBox;
