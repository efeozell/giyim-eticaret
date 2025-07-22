// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import './CategoryPage.css'; // Kategori sayfasıyla aynı stili kullanabilir

function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || ''; // URL'den 'q' parametresini (arama kelimesini) al
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchedProducts = async () => {
      if (!keyword) {
        setSearchedProducts([]);
        setLoading(false);
        return;
      };
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/products?keyword=${keyword}`);
        const data = await response.json();
        setSearchedProducts(data);
      } catch (error) {
        console.error(`Arama sonuçları alınırken hata:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchedProducts();
  }, [keyword]); // URL'deki 'keyword' her değiştiğinde bu fonksiyon yeniden çalışır

  return (
    <div className="container">
      <h2 className="category-title">Arama Sonuçları: "{keyword}"</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ProductList products={searchedProducts} />
      )}
    </div>
  );
}

export default SearchPage;