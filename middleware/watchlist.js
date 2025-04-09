const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const validate = {};

validate.createWatchlistRules = () => {
  return [
    body("userId").trim().notEmpty().withMessage("Please provide a userId."),

    body("title").trim().notEmpty().withMessage("Please provide a title."),

    body("movies")
          .isArray({ min: 1 })
          .withMessage("movies must be an array with at least one entry")
          .custom((value) => {
            if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
              throw new Error("Each movie must be a valid ObjectId");
            }
            return true;
          }),

    body("sharedWith")
          .isArray({ min: 1 })
          .withMessage("sharedWith must be an array with at least one entry")
          .custom((value) => {
            if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
              throw new Error("Each user must be a valid ObjectId");
            }
            return true;
          }),

    body().custom((value, { req }) => {
      const allowedFields = ["userId", "title", "movies", "sharedWith"];
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

validate.watchlistData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

validate.updateWatchlistRules = () => {
  return [
    body("movies")
          .optional()
          .isArray({ min: 1 })
          .withMessage("movies must be an array with at least one entry")
          .custom((value) => {
            if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
              throw new Error("Each movie must be a valid ObjectId");
            }
            return true;
          }),

    body("sharedWith")
          .optional()
          .isArray({ min: 1 })
          .withMessage("sharedWith must be an array with at least one entry")
          .custom((value) => {
            if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
              throw new Error("Each user must be a valid ObjectId");
            }
            return true;
          }),

    body().custom((value, { req }) => {
      const allowedFields = ["movies", "sharedWith"];
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
