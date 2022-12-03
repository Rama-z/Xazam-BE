const transactionRouter = require("express").Router();
const validate = require("../middlewares/validate");
const isLogin = require("../middlewares/isLogin");
const isAllowed = require("../middlewares/allowedRole");
const {
  create,
  getHistory,
  createTransaction,
  handleMidtrans,
} = require("../controller/transaction");

transactionRouter.get("/history", isLogin(), getHistory);
transactionRouter.post(
  "/create",
  isLogin(),
  validate.body(
    "movie_id",
    "payment_id",
    "ticket_count",
    "total_price",
    "seat_id",
    "tsm_id",
    "payment_method"
  ),
  createTransaction
);
transactionRouter.post("/handlemidtrans", handleMidtrans);
transactionRouter.get("/history", isLogin(), getHistory);
module.exports = transactionRouter;
