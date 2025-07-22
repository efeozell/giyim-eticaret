// src/components/Footer.js
import React from "react";
import "./Footer.css"; // Stil dosyamızı import ediyoruz

const Footer = () => {
	// Her zaman güncel yılı göstermesi için JavaScript ile dinamik olarak yılı alıyoruz
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer-container">
			<div className="footer-content">
				<p>&copy; {currentYear} MODA. Tüm Hakları Saklıdır.</p>
				<p>Efe Özel tarafından yapıldı.</p>
				{/* Daha önceki konuşmalarımızdan GitHub kullanıcı adını biliyorum, buraya ekledim. */}
				{/* Gelecekte diğer sosyal medya hesaplarını da ekleyebilirsin. */}
				<div className="footer-socials">
					<a href="https://github.com/efeozell" target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
					<a href="https://tr.linkedin.com/">LinkedIn</a>
					<a href="https://www.instagram.com/">Instagram</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
