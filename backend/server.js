import express from "express";
import { MongoClient } from "mongodb";
import purchaseRoute from "./routes/purchase.js";
import statusRoutes from "./routes/status.js";
import adminRoute from "./routes/admin.js"; // ✅ tambahkan ini
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const uri = "mongodb://localhost:27017";

app.use(cors());
app.use(express.json());

app.use("/status", statusRoutes);
app.use("/order", purchaseRoute); // ✅ rute untuk order
app.use("/admin", adminRoute);    // ✅ rute untuk admin

mongoose.connect("mongodb://localhost:27017/soulhero")
  .then(() => {
    console.log("✅ Mongoose connected");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch(err => console.error("❌ Gagal koneksi MongoDB:", err));
