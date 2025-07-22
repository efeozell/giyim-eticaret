// src/pages/PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Stil için AddProductPage.css'i ve kendi küçük stilimizi kullanacağız
import './AddProductPage.css'; 

function PaymentPage() {
  const navigate = useNavigate();

  // Güvenlik önlemi: Eğer kullanıcı kargo adresini girmeden bu sayfaya gelirse,
  // onu bir önceki adım olan kargo sayfasına geri yönlendir.
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
  useEffect(() => {
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      navigate('/kargo');
    }
  }, [navigate, shippingAddress]);

  // State'i, varsa localStorage'dan al, yoksa varsayılan olarak 'PayPal' ata
  const [paymentMethod, setPaymentMethod] = useState(
      JSON.parse(localStorage.getItem('paymentMethod')) || 'PayPal'
  );

  const submitHandler = (e) => {
    e.preventDefault();
    // Seçilen ödeme yöntemini localStorage'a kaydet
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));

    navigate('/siparis-ver');
    // Gelecekteki adım: navigate('/siparis-ver');
  };

  return (
    <div className="add-product-container">
      <h2>Ödeme Yöntemi</h2>
      <form onSubmit={submitHandler} className="add-product-form">
        <div className="form-group">
          <label>Yöntem Seçin</label>
          <div className="payment-option">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="paypal" className="payment-label">PayPal veya Kredi Kartı</label>
          </div>
          {/* Gelecekte buraya 'Havale/EFT' gibi başka ödeme seçenekleri eklenebilir */}
        </div>
        <button type="submit" className="submit-btn">Devam Et</button>
      </form>
    </div>
  );
}

export default PaymentPage;