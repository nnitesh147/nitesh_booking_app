import mongoose from "mongoose";

const referalSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  user_id: {
    type: String,
    require: true,
  },
  email: { type: String, unique: true },
});

const Referal = mongoose.model("Referal", referalSchema);
export default Referal;
