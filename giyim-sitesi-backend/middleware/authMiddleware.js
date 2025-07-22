// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const protect = async (req, res, next) => {
  let token;

  // 1. İstek başlığında (header) 'Authorization' var mı ve 'Bearer' ile başlıyor mu kontrol et
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. 'Bearer ' kısmını atıp sadece token'ı al
      token = req.headers.authorization.split(' ')[1];

      // 3. Token'ı doğrula ve içindeki kullanıcı ID'sini çöz
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. O ID ile kullanıcıyı veritabanında bul (şifre hariç)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Her şey yolundaysa, bir sonraki adıma geçmesine izin ver
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Yetkiniz yok, token doğrulanamadı' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Yetkiniz yok, token bulunamadı' });
  }
};

const admin = (req, res, next) => {
  // 'protect' middleware'i daha önce çalıştığı için req.user'ın var olduğunu biliyoruz.
  if (req.user && req.user.isAdmin) {
    next(); // Eğer kullanıcı admin ise, bir sonraki adıma geçmesine izin ver
  } else {
    res.status(401).json({ message: 'Yetkiniz yok, bu işlem sadece adminler içindir' });
  }
};

export { protect, admin }; 