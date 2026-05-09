import mongoose from "mongoose";

const aiActionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["summary", "explanation"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

aiActionHistorySchema.index({ userId: 1, documentId: 1, createdAt: -1 });

const AiActionHistory =
  mongoose.models.AiActionHistory ||
  mongoose.model("AiActionHistory", aiActionHistorySchema);

export default AiActionHistory;
