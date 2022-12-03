const transactionRouter = require("express").Router();
const validate = require("../middlewares/validate");
const isLogin = require("../middlewares/isLogin");
const isAllowed = require("../middlewares/allowedRole");
const { create, getHistory } = require("../controller/transaction");

transactionRouter.get("/history", isLogin(), getHistory);
transactionRouter.post(
  "/create",
  isLogin(),
  validate.body(
    "user_id",
    "movie_id",
    "payment_id",
    "ticket_count",
    "total_price",
    "seat_id",
    "tsm_id"
  ),
  create
);
module.exports = transactionRouter;
