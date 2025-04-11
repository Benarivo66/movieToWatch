const watchlistController = require('../controller/watchlist');
const WatchlistModel = require('../model/watchlist');

jest.mock('../model/watchlist'); 

describe('Watchlist Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createWatchlist', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = {};

      await watchlistController.createWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
    });

    it('should create a watchlist successfully', async () => {
      req.body = {
        userId: "123",
        title: "My Favorites",
        movies: ["movie1", "movie2"],
        sharedWith: ["userA"]
      };

      WatchlistModel.createWatchlist.mockResolvedValue({ _id: "1", ...req.body });

      await watchlistController.createWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Watchlist created successfully",
        watchlist: expect.objectContaining({ _id: "1" })
      });
    });
  });

  describe('updateWatchlist', () => {
    it('should return 400 if no update fields provided', async () => {
      req.params = { id: "1" };
      req.body = {};

      await watchlistController.updateWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Update at least one field" });
    });

    it('should return 404 if watchlist not found', async () => {
      req.params = { id: "1" };
      req.body = { title: "Updated" };

      WatchlistModel.getWatchlistById.mockResolvedValue(null);

      await watchlistController.updateWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Watchlist not found" });
    });

    it('should update watchlist successfully', async () => {
      req.params = { id: "1" };
      req.body = { title: "Updated Title" };

      WatchlistModel.getWatchlistById.mockResolvedValue({ _id: "1" });
      WatchlistModel.updateWatchlist.mockResolvedValue({ _id: "1", title: "Updated Title" });

      await watchlistController.updateWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Watchlist updated successfully",
        watchlist: expect.objectContaining({ title: "Updated Title" })
      });
    });
  });

  describe('getAllWatchlists', () => {
    it('should return 404 if no watchlists found', async () => {
      WatchlistModel.getAllWatchlists.mockResolvedValue([]);

      await watchlistController.getAllWatchlists(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No watchlist found" });
    });

    it('should return a list of watchlists', async () => {
      const mockWatchlists = [{ _id: "1" }, { _id: "2" }];
      WatchlistModel.getAllWatchlists.mockResolvedValue(mockWatchlists);

      await watchlistController.getAllWatchlists(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ watchlists: mockWatchlists });
    });
  });

  describe('getOneWatchlist', () => {
    it('should return 404 if watchlist not found', async () => {
      req.params = { id: "1" };
      WatchlistModel.getWatchlistById.mockResolvedValue(null);

      await watchlistController.getOneWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "watchlist not found" });
    });

    it('should return a watchlist if found', async () => {
      req.params = { id: "1" };
      const watchlist = { _id: "1", title: "List" };
      WatchlistModel.getWatchlistById.mockResolvedValue(watchlist);

      await watchlistController.getOneWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ watchlist });
    });
  });

  describe('deleteWatchlist', () => {
    it('should return 404 if watchlist not found', async () => {
      req.params = { id: "1" };
      WatchlistModel.removeWatchlist.mockResolvedValue(null);

      await watchlistController.deleteWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Watchlist not found" });
    });

    it('should delete watchlist successfully', async () => {
      req.params = { id: "1" };
      const deleted = { _id: "1", title: "Deleted" };
      WatchlistModel.removeWatchlist.mockResolvedValue(deleted);

      await watchlistController.deleteWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Watchlist deleted successfully",
        watchlist: deleted
      });
    });
  });
});
