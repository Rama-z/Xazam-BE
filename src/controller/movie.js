const moviesRepo = require("../repo/movie");

const getMovies = async (req, res) => {
  const result = await moviesRepo.getMovies(req.params.id);
  res.status(result.statusCode).send(result);
};
const getallMovies = async (req, res) => {
  const result = await moviesRepo.getallMovies(req.query);
  res.status(result.statusCode).send(result);
};
const getShowMovies = async (req, res) => {
  const result = await moviesRepo.getShowMovies(req.query);
  res.status(result.statusCode).send(result);
};

const createMovie = async (req, res) => {
  const result = await moviesRepo.createMovie(req.body, req.file, req.id);
  res.status(result.statusCode).send(result);
};
const deleteMovie = async (req, res) => {
  const result = await moviesRepo.deleteMovie(req.params.id);
  res.status(result.statusCode).send(result);
};

const moviesController = {
  getMovies,
  getallMovies,
  getShowMovies,
  createMovie,
  deleteMovie,
};

module.exports = moviesController;
