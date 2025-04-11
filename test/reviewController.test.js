const reviewController = require('../controller/review');
const ReviewModel = require('../model/review');

jest.mock('../model/review'); 

describe('Review Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = {};

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
    });

    it('should create review successfully', async () => {
      req.body = {
        userId: "user1",
        movieId: "movie1",
        comment: "Great movie!",
        rating: 5
      };

      ReviewModel.createReview.mockResolvedValue({ _id: "1", ...req.body });

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Review created successfully",
        review: expect.objectContaining({ _id: "1" })
      });
    });
  });

  describe('updateReview', () => {
    it('should return 400 if no fields provided', async () => {
      req.params = { id: "1" };
      req.body = {};

      await reviewController.updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Update at least one field" });
    });

    it('should return 404 if review not found', async () => {
      req.params = { id: "1" };
      req.body = { comment: "Updated" };

      ReviewModel.getReviewById.mockResolvedValue(null);

      await reviewController.updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
    });

    it('should update review successfully', async () => {
      req.params = { id: "1" };
      req.body = { comment: "Updated" };

      ReviewModel.getReviewById.mockResolvedValue({ _id: "1" });
      ReviewModel.updateReview.mockResolvedValue({ _id: "1", comment: "Updated" });

      await reviewController.updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Review updated successfully",
        review: expect.objectContaining({ comment: "Updated" })
      });
    });
  });

  describe('getAllReviews', () => {
    it('should return 404 if no reviews found', async () => {
      ReviewModel.getAllReviews.mockResolvedValue([]);

      await reviewController.getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No review found" });
    });

    it('should return all reviews', async () => {
      const mockReviews = [{ _id: "1" }, { _id: "2" }];
      ReviewModel.getAllReviews.mockResolvedValue(mockReviews);

      await reviewController.getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ reviews: mockReviews });
    });
  });

  describe('getOneReview', () => {
    it('should return 404 if review not found', async () => {
      req.params = { id: "1" };
      ReviewModel.getReviewById.mockResolvedValue(null);

      await reviewController.getOneReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "review not found" });
    });

    it('should return the review if found', async () => {
      req.params = { id: "1" };
      const review = { _id: "1", comment: "Nice movie" };
      ReviewModel.getReviewById.mockResolvedValue(review);

      await reviewController.getOneReview(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ review });
    });
  });

  describe('deleteReview', () => {
    it('should return 404 if review not found', async () => {
      req.params = { id: "1" };
      ReviewModel.removeReview.mockResolvedValue(null);

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Review not found" });
    });

    it('should delete review successfully', async () => {
      req.params = { id: "1" };
      const deletedReview = { _id: "1", comment: "Deleted" };
      ReviewModel.removeReview.mockResolvedValue(deletedReview);

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Review deleted successfully",
        review: deletedReview
      });
    });
  });
});
