// routes/purchase.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js"; // PENTING: pakai model mongoose

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { diamond, price } = req.body;

    if (!diamond || typeof diamond !== "number" || diamond <= 0) {
      return res.status(400).json({ success: false, message: "Jumlah diamond tidak valid" });
    }

    const newOrder = new Order({
      id: uuidv4(), // PAKAI `id`, bukan `_id` karena di model kamu pakai `id`
      amount: diamond,
      price,
      status: "pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    res.json({ success: true, orderId: newOrder.id });
  } catch (err) {
    console.error("❌ Gagal membuat pesanan:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
