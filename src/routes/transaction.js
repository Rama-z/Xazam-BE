const transactionRouter = require("express").Router();
const validate = require("../middlewares/validate");
const isLogin = require("../middlewares/isLogin");
const {
  getHistory,
  createTransaction,
  handleMidtrans,
  getAllSeat,
  getSelectSeat,
  getTicketDetail,
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
    "payment_method",
    "date"
  ),
  createTransaction
);
transactionRouter.post("/handlemidtrans", handleMidtrans);
transactionRouter.get("/history", isLogin(), getHistory);
transactionRouter.get("/allseat", isLogin(), getAllSeat);
transactionRouter.get("/selectseat", isLogin(), getSelectSeat);
transactionRouter.get(
  "/ticket-detail/:id",
  isLogin(),
  validate.params("id"),
  getTicketDetail
);
module.exports = transactionRouter;
