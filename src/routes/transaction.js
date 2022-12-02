const transactionRouter = require("express").Router();
const isLogin = require("../middlewares/isLogin");
// const validate = require("../middlewares/validate");
const { memoryUpload, errorHandler } = require("../middlewares/upload");

const { getHistory, createTransaction } = require("../controller/transaction");

transactionRouter.get("/history", isLogin(), getHistory);
transactionRouter.post("/", isLogin(), createTransaction);

module.exports = transactionRouter;
