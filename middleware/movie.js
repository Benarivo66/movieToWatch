const { body, validationResult } = require("express-validator");
const validate = {};

validate.createMovieRules = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a title."),

    body("genre")
      .trim()
      .notEmpty()
      .withMessage("Please provide a genre"),

    body("releaseYear")
      .notEmpty()
      .withMessage("Release year is required.")
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage(
        "Release year must be a valid number between 1800 and the current year."
      ),

    body("duration")
      .notEmpty()
      .withMessage("duration is required.")
      .isInt({ min: 1 })
      .withMessage("duration must be an integer"),

    body("description")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description"),

    body("status").trim().notEmpty().withMessage("Please provide a status"),
    body().custom((value, { req }) => {
        const allowedFields = [
          "genre",
          "title",
          "releaseYear",
          "duration",
          "description",
          "status"
        ];
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

validate.movieData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

validate.updateMovieRules = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a title."),

    body("genre")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Please provide a genre"),

    body("releaseYear")
      .optional()
      .notEmpty()
      .withMessage("Release year is required.")
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage(
        "Release year must be a valid number between 1800 and the current year."
      ),

    body("duration")
      .optional()
      .notEmpty()
      .withMessage("duration is required.")
      .isInt({ min: 1 })
      .withMessage("duration must be an integer"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description"),

    body("status")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Please provide a status"),

    body().custom((value, { req }) => {
      const allowedFields = [
        "genre",
        "title",
        "releaseYear",
        "duration",
        "description",
        "status"
      ];
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
