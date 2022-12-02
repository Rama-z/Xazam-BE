const transactionRepo = require("../repo/transaction");

const createTransaction = async (req, res) => {
  const result = await transactionRepo.createTransaction(req.body);
  res.status(result.statusCode).send(result);
};

const getHistory = async (req, res) => {
  const result = await transactionRepo.getHistory(req.query);
  res.status(result.statusCode).send(result);
};

module.exports = { createTransaction, getHistory };
