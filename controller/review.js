const ReviewModel = require("../model/review"); 
const Review = require("../schema/review");

const createReview = async (req, res) => {
  try {
    const { userId, movieId, comment, rating } = req.body;

    if (!userId || !movieId || !comment || !rating ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newReview = {
    userId,
    movieId,
    comment,
    rating
    };

    const review = await ReviewModel.createReview(newReview);
    res.status(201).json({ message: "Review created successfully", review });

  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if(Object.keys(updates).length === 0){
            return res.status(400).json({error: "Update at least one field"});
        }

        const existingReview = await ReviewModel.getReviewById(id);
        if (!existingReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        const updatedReview = await ReviewModel.updateReview(id, updates)

        res.status(200).json({
            message: "Review updated successfully",
            review: updatedReview
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await ReviewModel.getAllReviews();
        
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No review found" });
        }

        res.status(200).json({ reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getOneReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await ReviewModel.getReviewById(id);

        if (!review) {
            return res.status(404).json({ error: "review not found" });
        }

        res.status(200).json({ review });
    } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await ReviewModel.removeReview(id)

        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully", review: deletedReview });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { createReview, updateReview, getAllReviews, getOneReview, deleteReview };
