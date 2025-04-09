const express = require("express");
const {
  createReview,
  updateReview,
  getAllReviews,
  getOneReview,
  deleteReview,
} = require("../controller/review");
const router = express.Router();
const validate = require("../middleware/review");

router.post("/", validate.createReviewRules(), validate.reviewData, createReview);

router.put(
  "/:id",
  validate.updateReviewRules(),
  validate.reviewData,
  updateReview
);

router.get("/:id", getOneReview);

router.get("/", getAllReviews);

router.delete("/:id", deleteReview);

module.exports = router;
