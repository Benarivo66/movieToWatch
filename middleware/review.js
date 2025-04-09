const { body, validationResult } = require("express-validator");
const validate = {};

validate.createReviewRules = () => {
  return [
    body("userId")
      .trim()
      .notEmpty()
      .withMessage("Please provide a userId.")
      .isMongoId()
      .withMessage("Invalid userId format."),

    ,
    body("movieId")
      .trim()
      .notEmpty()
      .withMessage("Please provide a movieId.")
      .isMongoId()
      .withMessage("Invalid movieId format."),

    ,
    body("comment")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a comment"),

    body("rating")
      .notEmpty()
      .withMessage("rating is required.")
      .isInt({ min: 1, max: 5 })
      .withMessage("rating must be an integer"),

    body().custom((value, { req }) => {
      const allowedFields = ["userId", "movieId", "comment", "rating"];
      const receivedFields = Object.keys(req.body);

      const extraFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (extraFields.length > 0) {
        throw new Error(
          `Unexpected fields provided: ${extraFields.join(", ")}`
        );
      }

      return true;
    }),
  ];
};

validate.reviewData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

validate.updateReviewRules = () => {
  return [
    body("comment").optional().trim().notEmpty().isLength({ min: 1 }),

    body("rating")
      .optional()
      .notEmpty()
      .withMessage("rating is required.")
      .isInt({ min: 1 }),

    body().custom((value, { req }) => {
      const allowedFields = ["comment", "rating"];
      const receivedFields = Object.keys(req.body);

      const extraFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (extraFields.length > 0) {
        throw new Error(
          `Unexpected fields provided: ${extraFields.join(", ")}`
        );
      }

      return true;
    }),
  ];
};

module.exports = validate;
