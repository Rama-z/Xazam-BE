const moviesRepo = require("../repo/movie");

const getMovies = async (req, res) => {
  const result = await moviesRepo.getMovies(req.params.id);
  res.status(result.statusCode).send(result);
};
const getallMovies = async (req, res) => {
  const result = await moviesRepo.getallMovies();
  res.status(result.statusCode).send(result);
};
const getShowMovies = async (req, res) => {
  const result = await moviesRepo.getShowMovies(req.query);
  res.status(result.statusCode).send(result);
};

const moviesController = {
  getMovies,
  getallMovies,
  getShowMovies,
};

module.exports = moviesController;
