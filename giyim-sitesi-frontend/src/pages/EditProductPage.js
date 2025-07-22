// src/pages/EditProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // URL'den ID'yi almak ve yönlendirme için
import './AddProductPage.css'; // Aynı stilleri kullanabiliriz

function EditProductPage() {
  // useParams() hook'u, URL'deki :id gibi dinamik parametreleri almamızı sağlar.
  const { id } = useParams();
  const navigate = useNavigate(); // İşlem bitince ana sayfaya yönlendirmek için

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  // 1. useEffect: Sayfa ilk yüklendiğinde, ID'si bilinen ürünü API'dan çek.
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        const data = await response.json();
        // Gelen veri ile formun state'lerini doldur
        setName(data.name);
        setCategory(data.category);
        setPrice(data.price);
        setImageUrl(data.imageUrl);
        setDescription(data.description);
      } catch (error) {
        console.error('Ürün detayı çekilirken hata:', error);
        alert('Ürün bilgileri getirilemedi.');
      }
    };
    fetchProduct();
  }, [id]); // Bu effect, URL'deki ID değiştiğinde tekrar çalışır.

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e) => {
  e.preventDefault();
  const newProduct = { name, category, price: Number(price), imageUrl, description };

  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      alert('Bu işlemi yapmak için giriş yapmalısınız.');
      return;
    }

    const response = await fetch('http://localhost:5001/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`, // YETKİLENDİRME EKLENDİ
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) throw new Error('Ürün eklenemedi.');
    
    // ... fonksiyonun geri kalanı aynı ...
  } catch (error) {
    // ...
  }
};

  return (
    <div className="add-product-container">
      <h2>Ürünü Düzenle</h2>
      {/* Form, AddProductPage ile neredeyse aynı, sadece handleSubmit farklı */}
      <form onSubmit={handleSubmit} className="add-product-form">
          {/* input'lar ve label'lar AddProductPage ile aynı */}
          <div className="form-group"><label>Ürün Adı</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="form-group"><label>Kategori</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required /></div>
          <div className="form-group"><label>Fiyat</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
          <div className="form-group"><label>Resim URL</label><input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required /></div>
          <div className="form-group"><label>Açıklama</label><textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea></div>
          <button type="submit" className="submit-btn">Değişiklikleri Kaydet</button>
      </form>
    </div>
  );
}

export default EditProductPage;