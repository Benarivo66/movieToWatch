const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, trim: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Watchlist" }],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Watchlist = mongoose.model("Watchlist", WatchlistSchema);

module.exports = Watchlist;
