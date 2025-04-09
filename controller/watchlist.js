const WatchlistModel = require("../model/watchlist"); 
const Watchlist = require("../schema/watchlist");

const createWatchlist = async (req, res) => {
  try {
    const { userId, title, movies, sharedWith } = req.body;

    if (!userId || !title || !movies || !sharedWith ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newWatchlist = {
    userId,
    title,
    movies,
    sharedWith
    };

    const watchlist = await WatchlistModel.createWatchlist(newWatchlist);
    res.status(201).json({ message: "Watchlist created successfully", watchlist });

  } catch (error) {
    console.error("Error creating watchlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if(Object.keys(updates).length === 0){
            return res.status(400).json({error: "Update at least one field"});
        }

        const existingWatchlist = await WatchlistModel.getWatchlistById(id);
        if (!existingWatchlist) {
            return res.status(404).json({ error: "Watchlist not found" });
        }

        const updatedWatchlist = await WatchlistModel.updateWatchlist(id, updates)

        res.status(200).json({
            message: "Watchlist updated successfully",
            watchlist: updatedWatchlist
        });
    } catch (error) {
        console.error("Error updating watchlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllWatchlists = async (req, res) => {
    try {
        const watchlists = await WatchlistModel.getAllWatchlists();
        
        if (watchlists.length === 0) {
            return res.status(404).json({ message: "No watchlist found" });
        }

        res.status(200).json({ watchlists });
    } catch (error) {
        console.error("Error fetching watchlists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getOneWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const watchlist = await WatchlistModel.getWatchlistById(id);

        if (!watchlist) {
            return res.status(404).json({ error: "watchlist not found" });
        }

        res.status(200).json({ watchlist });
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWatchlist = await WatchlistModel.removeWatchlist(id)

        if (!deletedWatchlist) {
            return res.status(404).json({ error: "Watchlist not found" });
        }

        res.status(200).json({ message: "Watchlist deleted successfully", watchlist: deletedWatchlist });
    } catch (error) {
        console.error("Error deleting watchlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createWatchlist, updateWatchlist, getAllWatchlists, getOneWatchlist, deleteWatchlist };


