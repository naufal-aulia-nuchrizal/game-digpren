import mongoose from "mongoose";

const DiamondSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0
  }
});

const Diamond = mongoose.model("Diamond", DiamondSchema);

export default Diamond;
