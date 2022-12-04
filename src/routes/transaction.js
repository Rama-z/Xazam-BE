const transactionRouter = require("express").Router();
const validate = require("../middlewares/validate");
const isLogin = require("../middlewares/isLogin");
const isAllowed = require("../middlewares/allowedRole");
const {
  create,
  getHistory,
  createTransaction,
  handleMidtrans,
  getAllSeat,
  getSelectSeat,
} = require("../controller/transaction");

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
transactionRouter.get("/getseat", isLogin(), getAllSeat);
transactionRouter.get("/getselectseat", isLogin(), getSelectSeat);
module.exports = transactionRouter;
