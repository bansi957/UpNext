const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    senderRole: {
      type: String,
      enum: ["mentor", "student"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },
    fileUrl: {
      type: String,
      default: null
    },
    fileName: {
      type: String,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question",
        required:true
    },
    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    ratedAt: {
      type: Date,
      default: null
    },
    messages: [MessageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
