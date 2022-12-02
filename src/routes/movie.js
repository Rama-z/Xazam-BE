const movieRoute = require("express").Router();
const isLogin = require("../middlewares/isLogin");
const validate = require("../middlewares/validate");
const AllowedRole = require("../middlewares/allowedRole");
const { memoryUpload, errorHandler } = require("../middlewares/upload");
const movieUploader = require("../middlewares/movieUpload");

const {
  getMovies,
  getallMovies,
  getShowMovies,
  createMovie,
  deleteMovie,
} = require("../controller/movie");

movieRoute.get("/movie-detail/:id", getMovies);
movieRoute.get("/", getallMovies);
movieRoute.get("/showmovie", getShowMovies);
movieRoute.post(
  "/create-movie",
  isLogin(),
  (req, res, next) =>
    memoryUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  movieUploader,
  validate.img(),
  createMovie
);
movieRoute.delete("/delete/:id", isLogin(), deleteMovie);
module.exports = movieRoute;
