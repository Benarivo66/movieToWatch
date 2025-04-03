const express = require("express");
const {createMovie, updateMovie, getAllMovies, getOneMovie, deleteMovie } = require("../controller/movie");
const router = express.Router();
const validate = require("../middleware/movie");
const { authentication } = require("../middleware/auth");

router.post("/", validate.createMovieRules(), validate.movieData, createMovie);

router.put("/:id", validate.updateMovieRules(), validate.movieData, updateMovie);

router.get("/:id", authentication, getOneMovie);

router.get("/", authentication, getAllMovies);

router.delete("/:id", deleteMovie);

module.exports = router;
