// src/pages/FavoritesPage.js
import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import ProductList from '../components/ProductList';
import './CategoryPage.css';

function FavoritesPage() {
  const { favoriteItems, loadingFavorites } = useFavorites(); // loading durumunu da alıyoruz


  return (
    <div className="container">
      <h2 className="category-title">Favorilerim</h2>
      {loadingFavorites ? (
        <p>Favoriler yükleniyor...</p>
      ) : favoriteItems.length === 0 ? (
        <p>Henüz favorilerinize eklenmiş bir ürün bulunmuyor.</p>
      ) : (
        <ProductList products={favoriteItems} />
      )}
    </div>
  );
}

export default FavoritesPage;