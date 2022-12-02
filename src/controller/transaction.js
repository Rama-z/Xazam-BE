const transactionRepo = require("../repo/transaction");

const create = async (req, res) => {
  const result = await transactionRepo.createTransaction(req.body);
  res.status(result.statusCode).send(result);
};

const transactionController = {
  create,
};

module.exports = transactionController;
