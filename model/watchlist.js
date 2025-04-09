const Watchlist = require("../schema/watchlist");

const createWatchlist = (newWatchlistObj) => {
  const watchlist = new Watchlist(newWatchlistObj);
  return watchlist.save();
};

const getAllWatchlists = () => {
  return Watchlist.find(); 
};

const getWatchlistById = (id) => {
  return Watchlist.findById(id);
};

const updateWatchlist= (id, updateObj) => {
  return Watchlist.findByIdAndUpdate(id, updateObj, { new: true, runValidators: true });
};

const removeWatchlist= (id) => {
  return Watchlist.findByIdAndDelete(id);
};

module.exports = { createWatchlist, getAllWatchlists, getWatchlistById, updateWatchlist, removeWatchlist };
