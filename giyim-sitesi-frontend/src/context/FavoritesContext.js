// src/context/FavoritesContext.js - NİHAİ VE EN SAĞLAM HALİ

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Merkezi AuthContext'imizi import ediyoruz

const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth(); // userInfo'yu her zaman merkezi AuthContext'ten alıyoruz

  // Bu fonksiyon, backend'den güncel favori listesini çeker.
  // useCallback ile sarmalayarak, gereksiz yere yeniden oluşmasını engelliyoruz.
  const fetchFavorites = useCallback(async () => {
    if (userInfo && userInfo.token) {
      setLoading(true);
      try {
        const response = await fetch('/api/users/favorites', {
          headers: { 'Authorization': `Bearer ${userInfo.token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setFavoriteItems(data);
        } else {
          setFavoriteItems([]); // Hata durumunda listeyi boşalt
        }
      } catch (error) { 
        console.error('Favoriler getirilirken hata:', error);
        setFavoriteItems([]);
      } finally {
        setLoading(false);
      }
    } else {
      setFavoriteItems([]); // Kullanıcı yoksa favorileri temizle
      setLoading(false);
    }
  }, [userInfo]); // Bu fonksiyon sadece userInfo değiştiğinde yeniden oluşur.

  // Bu useEffect, bileşen ilk yüklendiğinde ve fetchFavorites fonksiyonu
  // değiştiğinde (yani userInfo değiştiğinde) çalışır.
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Favori ekleme/çıkarma fonksiyonu
  const toggleFavorite = async (productId) => {
    if (!userInfo || !userInfo.token) {
      alert('Favorilere eklemek için giriş yapmalısınız.');
      return;
    }

    try {
      const response = await fetch('/api/users/favorites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Favori durumu değiştirilemedi.');
      }
      
      // Backend işlemi başarılı olduktan sonra, en güncel listeyi
      // tekrar çekerek frontend'deki durumu %100 senkronize ediyoruz.
      await fetchFavorites();

    } catch (error) {
      console.error('Favori değiştirilirken hata:', error);
      alert(error.message);
    }
  };

  const value = {
    favoriteItems,
    toggleFavorite,
    loadingFavorites: loading,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};