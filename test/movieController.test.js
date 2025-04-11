const movieController = require('../controller/movie');
const MovieModel = require('../model/movie');

jest.mock('../model/movie');

describe('Movie Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = {};

      await movieController.createMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
    });

    it('should create a movie successfully', async () => {
      req.body = {
        title: "Inception",
        genre: "Sci-Fi",
        releaseYear: 2010,
        duration: 148,
        description: "A mind-bending thriller",
        status: "released"
      };

      MovieModel.createMovie.mockResolvedValue({ _id: "1", ...req.body });

      await movieController.createMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Movie created successfully",
        movie: expect.objectContaining({ _id: "1" })
      });
    });
  });

  describe('updateMovie', () => {
    it('should return 400 if no fields to update', async () => {
      req.params = { id: "1" };
      req.body = {};

      await movieController.updateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Update at least one field" });
    });

    it('should return 404 if movie not found', async () => {
      req.params = { id: "1" };
      req.body = { title: "Updated" };

      MovieModel.getMovieById.mockResolvedValue(null);

      await movieController.updateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Movie not found" });
    });

    it('should update movie successfully', async () => {
      req.params = { id: "1" };
      req.body = { title: "Updated Title" };

      MovieModel.getMovieById.mockResolvedValue({ _id: "1" });
      MovieModel.updateMovie.mockResolvedValue({ _id: "1", title: "Updated Title" });

      await movieController.updateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Movie updated successfully",
        movie: expect.objectContaining({ title: "Updated Title" })
      });
    });
  });

  describe('getAllMovies', () => {
    it('should return 404 if no movies found', async () => {
      MovieModel.getAllMovies.mockResolvedValue([]);

      await movieController.getAllMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No movie found" });
    });

    it('should return list of movies', async () => {
      const mockMovies = [{ _id: "1" }, { _id: "2" }];
      MovieModel.getAllMovies.mockResolvedValue(mockMovies);

      await movieController.getAllMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ movies: mockMovies });
    });
  });

  describe('getOneMovie', () => {
    it('should return 404 if movie not found', async () => {
      req.params = { id: "1" };
      MovieModel.getMovieById.mockResolvedValue(null);

      await movieController.getOneMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "movie not found" });
    });

    it('should return a movie if found', async () => {
      req.params = { id: "1" };
      const movie = { _id: "1", title: "Inception" };
      MovieModel.getMovieById.mockResolvedValue(movie);

      await movieController.getOneMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ movie });
    });
  });

  describe('deleteMovie', () => {
    it('should return 404 if movie not found', async () => {
      req.params = { id: "1" };
      MovieModel.removeMovie.mockResolvedValue(null);

      await movieController.deleteMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Movie not found" });
    });

    it('should delete a movie successfully', async () => {
      req.params = { id: "1" };
      const deletedMovie = { _id: "1", title: "Gone" };
      MovieModel.removeMovie.mockResolvedValue(deletedMovie);

      await movieController.deleteMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Movie deleted successfully",
        movie: deletedMovie
      });
    });
  });
});
