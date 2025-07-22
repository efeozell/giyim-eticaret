// src/pages/CartPage.js
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  // Context'ten sepet verilerini ve fonksiyonları çekiyoruz
  const { cartItems, removeFromCart, updateQuantity, itemsCount, cartTotal } = useCart();

  return (
    <div className="container cart-page">
      <h1>Alışveriş Sepetim ({itemsCount} ürün)</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Sepetinizde henüz ürün bulunmuyor.</p>
          <Link to="/" className="btn-primary">Alışverişe Başla</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <Link to={`/urun/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-price">{item.price} TL</p>
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item._id, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQuantity(item._id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="cart-item-remove">Kaldır</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Sipariş Özeti</h2>
            <div className="summary-row">
              <span>Toplam Ürün:</span>
              <span>{itemsCount}</span>
            </div>
            <div className="summary-row total">
              <span>Genel Toplam:</span>
              <span>{cartTotal} TL</span>
            </div>
            <Link to="/kargo" className="btn-checkout" style={{textDecoration:'none', display:'inline-block', textAlign:'center'}}>
                Ödemeye Geç
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;