 // src/pages/ShippingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './AddProductPage.css'; // Aynı form stilini kullanabiliriz

function ShippingPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // localStorage'da kayıtlı adres var mı diye kontrol et, varsa onu kullan
  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};

  const [address, setAddress] = useState(savedAddress.address || '');
  const [city, setCity] = useState(savedAddress.city || '');
  const [postalCode, setPostalCode] = useState(savedAddress.postalCode || '');
  const [country, setCountry] = useState(savedAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    const shippingAddress = { address, city, postalCode, country };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    alert('Adres kaydedildi! Ödeme adımına geçiliyor...');
    navigate('/odeme'); 
  };

  return (
    <div className="add-product-container">
      <h2>Kargo Adresi</h2>
      <form onSubmit={submitHandler} className="add-product-form">
        <div className="form-group"><label>Adres</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
        <div className="form-group"><label>Şehir</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} required /></div>
        <div className="form-group"><label>Posta Kodu</label><input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required /></div>
        <div className="form-group"><label>Ülke</label><input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required /></div>
        <button type="submit" className="submit-btn" disabled={cartItems.length === 0}>Devam Et</button>
      </form>
    </div>
  );
}

export default ShippingPage;