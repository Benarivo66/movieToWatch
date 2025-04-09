const express = require("express");
const {
  createWatchlist,
  updateWatchlist,
  getAllWatchlists,
  getOneWatchlist,
  deleteWatchlist,
} = require("../controller/watchlist");
const router = express.Router();
const validate = require("../middleware/watchlist");

router.post("/", validate.createWatchlistRules(), validate.watchlistData, createWatchlist);

router.put(
  "/:id",
  validate.updateWatchlistRules(),
  validate.watchlistData,
  updateWatchlist
);

router.get("/:id", getOneWatchlist);

router.get("/", getAllWatchlists);

router.delete("/:id", deleteWatchlist);

module.exports = router;
