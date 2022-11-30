const express = require("express");
const mainRouter = express.Router();
// const authRouter = require("./auth");
// const profileRouter = require("./profile");
// const productRouter = require("./product");
// const promoRouter = require("./promo");
// const reviewsRouter = require("./reviews");
// const transactionRouter = require("./transactions");
// const favoriteRouter = require("./favorite");
// const prefix = "/api/v1";

// mainRouter.use(`${prefix}/auth`, authRouter);
// mainRouter.use(`${prefix}/profile`, profileRouter);
// mainRouter.use(`${prefix}/product`, productRouter);
// mainRouter.use(`${prefix}/promo`, promoRouter);
// mainRouter.use(`${prefix}/reviews`, reviewsRouter);
// mainRouter.use(`${prefix}/transaction`, transactionRouter);
// mainRouter.use(`${prefix}/favorite`, favoriteRouter);

mainRouter.get("/", (req, res) => {
  res.json({
    msg: "This Is API from XAZAM-Ticketz",
  });
});

module.exports = mainRouter;
