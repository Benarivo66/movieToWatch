const Movie = require("../schema/movie");

const createMovie = (newMovieObj) => {
  const movie = new Movie(newMovieObj);
  return movie.save();
};

const getAllMovies = () => {
  return Movie.find(); 
};

const getMovieById = (id) => {
  return Movie.findById(id);
};

const updateMovie = (id, updateObj) => {
  return Movie.findByIdAndUpdate(id, updateObj, { new: true, runValidators: true });
};

const removeMovie = (id) => {
  return Movie.findByIdAndDelete(id);
};

module.exports = { createMovie, getAllMovies, getMovieById, updateMovie, removeMovie };
