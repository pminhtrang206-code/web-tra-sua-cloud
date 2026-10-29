const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/trasuadb";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Kết nối Database thành công!"))
  .catch(err => console.error("Lỗi kết nối:", err));

const ProductSchema = new mongoose.Schema({ name: String, price: Number, category: String, image: String, description: String });
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({ customerName: String, phone: String, address: String, items: Array, totalAmount: Number, createdAt: { type: Date, default: Date.now } });
const Order = mongoose.model('Order', OrderSchema);

app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();
    if (products.length === 0) {
      products = [
        { name: "Trà Sữa Trân Châu Đường Đen", price: 35000, category: "Trà Sữa", image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69", description: "Trân châu dai giòn, đậm vị." },
        { name: "Matcha Đậu Đỏ", price: 40000, category: "Matcha", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a", description: "Matcha thanh mát kèm đậu đỏ." }
      ];
    }
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Thành công", order: newOrder });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy cổng ${PORT}`));
