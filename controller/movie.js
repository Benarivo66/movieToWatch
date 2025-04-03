const MovieModel = require("../model/movie"); 
const Movie = require("../schema/movie");

const createMovie = async (req, res) => {
  try {
    const { title, genre, releaseYear, duration, description, status } = req.body;

    if (!title || !genre || !releaseYear || !duration || !description || !status ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMovie = {
    title,
    genre,
    releaseYear,
    duration,
    description,
    status
    };

    const movie = await MovieModel.createMovie(newMovie);
    res.status(201).json({ message: "User created successfully", movie });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if(Object.keys(updates).length === 0){
            return res.status(400).json({error: "Update at least one field"});
        }

        const existingMovie = await UserModel.getMovieById(id);
        if (!existingMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        const updatedMovie = await MovieModel.updateMovie(id, updates)

        res.status(200).json({
            message: "Movie updated successfully",
            user: updatedMovie
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await MovieModel.getAllMovies();
        
        if (movies.length === 0) {
            return res.status(404).json({ message: "No movie found" });
        }

        res.status(200).json({ movies });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getOneMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await MovieModel.getMovieById(id);

        if (!movie) {
            return res.status(404).json({ error: "movie not found" });
        }

        res.status(200).json({ movie });
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMovie = await MovieModel.removeMovie(id)

        if (!deletedMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        res.status(200).json({ message: "Movie deleted successfully", movie: deletedMovie });
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { createMovie, updateMovie, getAllMovies, getOneMovie, deleteMovie };
