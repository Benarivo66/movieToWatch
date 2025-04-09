const Review = require("../schema/review");

const createReview = (newReviewObj) => {
  const review = new Review(newReviewObj);
  return review.save();
};

const getAllReviews = () => {
  return Review.find(); 
};

const getReviewById = (id) => {
  return Review.findById(id);
};

const updateReview = (id, updateObj) => {
  return Review.findByIdAndUpdate(id, updateObj, { new: true, runValidators: true });
};

const removeReview = (id) => {
  return Review.findByIdAndDelete(id);
};

module.exports = { createReview, getAllReviews, getReviewById, updateReview, removeReview };
