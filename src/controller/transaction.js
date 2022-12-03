const transactionRepo = require("../repo/transaction");

const create = async (req, res) => {
  const result = await transactionRepo.createTransaction(req.body);
  res.status(result.statusCode).send(result);
};

const getHistory = async (req, res) => {
  const result = await transactionRepo.getHistory(req.query);
  res.status(result.statusCode).send(result);
};

const transactionController = {
  create,
  getHistory,
};

module.exports = transactionController;
