import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * Endpoint: GET /status/:id
 * Deskripsi: Cek status pembayaran berdasarkan ID (UUID, bukan _id Mongo)
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({ id }); // ✅ Gunakan field `id` (uuid), bukan `_id`

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan."
      });
    }

    res.json({
      success: true,
      status: order.status,
      diamond: order.amount, // ⚠️ Sesuai dengan field di purchase.js
      price: order.price
    });

  } catch (err) {
    console.error("Error saat cek status order:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil status."
    });
  }
});

export default router;
