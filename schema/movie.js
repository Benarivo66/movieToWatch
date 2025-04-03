const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    releaseYear: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;