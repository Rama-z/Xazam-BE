const movieRoute = require("express").Router();
const isLogin = require("../middlewares/isLogin");
const validate = require("../middlewares/validate");
const { memoryUpload, errorHandler } = require("../middlewares/upload");
const profileUploader = require("../middlewares/profileUpload");

const {
  getMovies,
  getallMovies,
  getShowMovies,
} = require("../controller/movie");

movieRoute.get("/movie-detail/:id", getMovies);
movieRoute.get("/", getallMovies);
movieRoute.get("/showmovie", getShowMovies);
module.exports = movieRoute;
