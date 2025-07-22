// routes/orderRoutes.js
import express from 'express';
import Order from '../models/OrderModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'Sepette ürün yok' });
    }

    const order = new Order({
      orderItems: orderItems, 
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    res.status(400).json({ message: 'Sipariş oluşturulamadı', error: error.message });
  }
});

router.get('/myorders', protect, async (req, res) => {
  try {
    // 'protect' middleware'i sayesinde req.user içinde giriş yapmış kullanıcının bilgileri var.
    // Veritabanında 'user' alanı, giriş yapmış kullanıcının ID'si ile eşleşen siparişleri buluyoruz.
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'Siparişler bulunamadı' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    // Siparişi ID'sine göre veritabanında buluyoruz.
    // .populate() metodu, 'user' alanındaki ID'yi kullanarak Users koleksiyonuna gider
    // ve o kullanıcının sadece name ve email alanlarını sipariş detayına ekler.
    // Bu, sipariş detayında "Sipariş Veren: Efe Özel" gibi bilgiler göstermemizi sağlar.
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Güvenlik kontrolü: Sadece siparişin sahibi veya bir admin bu siparişi görebilir.
      if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
         return res.status(401).json({ message: 'Bu siparişi görmeye yetkiniz yok' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'Sipariş bulunamadı' });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    // Tüm siparişleri bul ve her siparişin user alanına ait id ve name'i de ekle
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu Hatası' });
  }
});

router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu Hatası' });
  }
});



export default router;