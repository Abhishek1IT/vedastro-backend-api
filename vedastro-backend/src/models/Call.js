import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["AUDIO", "VIDEO"],
      default: "AUDIO",
    },

    isInCall: {
      type: Boolean,
      default: false,
    },

    currentCall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Call",
      default: null,
    },

    status: {
      type: String,
      enum: ["RINGING", "ACCEPTED", "REJECTED", "MISSED", "ENDED"],
      default: "RINGING",
    },

    startedAt: Date,

    endedAt: Date,

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Call", callSchema);
