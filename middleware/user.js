const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const validate = {};

validate.createUserRules = () => {
  return [
    body("firstName")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("lastName")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("dob").trim().notEmpty().withMessage("Please provide a date of birth"),

    body("country")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a country"),

    body("sex").trim().notEmpty().withMessage("Please provide a sex"),

    body("watchlists")
      .isArray({ min: 1 })
      .withMessage("Watchlists must be an array with at least one entry")
      .custom((value) => {
        if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
          throw new Error("Each watchlist must be a valid ObjectId");
        }
        return true;
      }),

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Please provide a phone number"),
      body().custom((value, { req }) => {
        const allowedFields = [
          "firstName",
          "lastName",
          "email",
          "dob",
          "country",
          "sex",
          "phone",
          "watchlists"
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

validate.userData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

validate.updateUserRules = () => {
  return [
    body("firstName")
      .optional()
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("lastName")
      .optional()
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    body("email")
      .optional()
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("dob")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Please provide a date of birth"),

    body("country")
      .optional()
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a country"),

    body("sex")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Please provide a sex"),

    body("phone")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Please provide a phone number"),

    body().custom((value, { req }) => {
      const allowedFields = [
        "firstName",
        "lastName",
        "email",
        "dob",
        "country",
        "sex",
        "phone",
        "watchlists"
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
