import express from "express";
import Order from "../models/Order.js"; // tambahkan ini

const router = express.Router();

router.post("/confirm", async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order tidak ditemukan" });

    if (order.status === "confirmed") {
      return res.status(400).json({ success: false, message: "Order sudah dikonfirmasi" });
    }

    order.status = "confirmed";
    await order.save();

    return res.json({ success: true, message: `Order ${orderId} dikonfirmasi` });
  } catch (err) {
    console.error("❌ Gagal konfirmasi order:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("❌ Gagal ambil data orders:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
