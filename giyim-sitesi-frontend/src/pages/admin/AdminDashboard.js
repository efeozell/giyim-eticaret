// src/pages/admin/AdminDashboardPage.js - GÜNCEL VE GÜVENLİ HALİ

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Merkezi AuthContext'i kullanıyoruz
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Hata mesajlarını saklamak için bir state

  const { userInfo } = useAuth(); // userInfo'yu her zaman context'ten alıyoruz

  useEffect(() => {
    const fetchStats = async () => {
      // Önce userInfo ve token'ın var olduğundan %100 emin oluyoruz
      if (userInfo && userInfo.token) {
        setLoading(true);
        try {
          const response = await fetch('/api/admin/stats', {
            headers: {
              'Content-Type': 'application/json',
              // Token'ı Authorization başlığına ekliyoruz
              'Authorization': `Bearer ${userInfo.token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setStats(data);
          } else {
            // Backend'den gelen hata mesajını state'e kaydediyoruz
            throw new Error(data.message || 'Veri alınamadı');
          }
        } catch (err) {
          console.error('İstatistikler alınırken hata:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Eğer kullanıcı bilgisi yoksa, yüklemeyi durdur ve hata mesajı göster
        setLoading(false);
        setError('Bu sayfayı görüntülemek için admin olarak giriş yapmalısınız.');
      }
    };

    fetchStats();
  }, [userInfo]); // useEffect, userInfo değiştiğinde yeniden çalışacak

  return (
    <div className="admin-dashboard">
      <h1>Yönetim Paneli</h1>
      {loading ? (
        <p>İstatistikler Yükleniyor...</p>
      ) : error ? (
        // Hata varsa, ekranda göster
        <div className="alert-error">{error}</div>
      ) : (
        stats && (
          <div className="stats-container">
            <div className="stat-card"><h3>Toplam Kullanıcı</h3><p>{stats.userCount}</p></div>
            <div className="stat-card"><h3>Toplam Ürün</h3><p>{stats.productCount}</p></div>
            <div className="stat-card"><h3>Toplam Sipariş</h3><p>{stats.orderCount}</p></div>
            <div className="stat-card"><h3>Toplam Gelir</h3><p>{stats.totalSales.toFixed(2)} TL</p></div>
          </div>
        )
      )}
    </div>
  );
}

export default AdminDashboardPage;