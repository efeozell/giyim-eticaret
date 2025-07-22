// models/OrderModel.js
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: { // Siparişi veren kullanıcı
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // User modeline referans
    },
    orderItems: [ // Siparişteki ürünler (bir dizi)
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { // Ürünün kendisine referans
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: { // Kargo adresi
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true }, // Ödeme yöntemi
    totalPrice: { type: Number, required: true, default: 0.0 }, // Toplam fiyat
    isPaid: { type: Boolean, required: true, default: false }, // Ödendi mi?
    paidAt: { type: Date }, // Ödendiği tarih
    isDelivered: { type: Boolean, required: true, default: false }, // Teslim edildi mi?
    deliveredAt: { type: Date }, // Teslim edildiği tarih
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;