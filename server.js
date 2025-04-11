const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {authentication} = require("./middleware/auth");
const db = require("./db/connect");
const usersRoute = require("./routes/user");
const moviesRoute = require("./routes/movie");
const reviewsRoute = require("./routes/review");
const watchlistsRoute = require("./routes/watchlist");

const corsOptions = {
  origin: [process.env.HOST],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST.trim()}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);
app.get("/", (req, res, next) => {
  res.send(
    "Welcome to the moviesToWatch home page. Please log in to access content."
  );
});
app.get("/dashboard", authentication, (req, res, next) => {
  res.send("Welcome to the movies dashboard");
});
app.use("/users", usersRoute);
app.use("/movies", moviesRoute);
app.use("/reviews", reviewsRoute);
app.use("/watchlists", watchlistsRoute);

const host = process.env.HOST;

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on ${host}`);
  db.init();
});
