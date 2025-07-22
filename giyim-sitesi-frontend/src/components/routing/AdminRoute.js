// src/components/routing/AdminRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // --- HATA AYIKLAMA KODLARI BAŞLANGIÇ ---
  console.log('%c--- AdminRoute Bekçisi Devrede ---', 'background: #222; color: #bada55');
  
  const userInfoString = localStorage.getItem('userInfo');
  console.log('1. localStorage\'dan okunan ham veri (string):', userInfoString);

  let userInfo = null;
  try {
    userInfo = JSON.parse(userInfoString);
    console.log('2. JSON.parse sonrası elde edilen obje:', userInfo);
  } catch (error) {
    console.error('localStorage\'daki veri parse edilirken hata oluştu:', error);
    userInfo = null; // Hata durumunda userInfo'yu null yap
  }

  // Karar mekanizması
  const isAuth = userInfo && userInfo.isAdmin;
  console.log('3. Kullanıcı yetkili mi? (isAuth):', isAuth);
  // --- HATA AYIKLAMA KODLARI BİTİŞ ---


  if (isAuth) {
    console.log('4. Karar: Yetkili. Sayfaya erişime izin veriliyor. <Outlet/> render edilecek.');
    return <Outlet />;
  } else {
    console.log('4. Karar: Yetkisiz. /login sayfasına yönlendiriliyor.');
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;