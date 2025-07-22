// src/context/CartContext.js - GÜNCELLENMİŞ HALİ
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existItem = prevItems.find(item => item._id === product._id);
      if (existItem) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  // YENİ: Ürünün miktarını değiştirme fonksiyonu
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      // Eğer miktar 0 veya daha az ise ürünü tamamen kaldır
      removeFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, qty: newQty } : item
        )
      );
    }
  };

  // YENİ: Hesaplanmış değerler
  // Sepetteki toplam ürün sayısı (farklı ürünler değil, toplam adet)
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  // Sepetin toplam tutarı
  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  const clearCart = () => {
  setCartItems([]);
  localStorage.removeItem('cartItems'); // localStorage'dan da temizle
  };


  // Provider'ın dışarıya sağlayacağı tüm değerler
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    itemsCount,
    cartTotal,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};