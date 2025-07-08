import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String, 
    },
    seen: {
      type: Boolean,
      default: false,
    },
   
  },
  { timestamps: true }
);

export const Message = mongoose.model("message", messageSchema);
