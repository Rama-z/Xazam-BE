const express = require("express");
const mainRouter = express.Router();
const db = require("../config/database");
const client = require("../config/redis");

const authRouter = require("./auth");
const profileRouter = require("./profile");
const movieRouter = require("./movie");
const transactionRouter = require("./transaction");
// const promoRouter = require("./promo");
// const reviewsRouter = require("./reviews");
const transactionRouter = require("./transaction");
// const favoriteRouter = require("./favorite");
const prefix = "/api/xazam";

mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/profile`, profileRouter);
mainRouter.use(`${prefix}/movie`, movieRouter);
mainRouter.use(`${prefix}/transaction`, transactionRouter);
// mainRouter.use(`${prefix}/promo`, promoRouter);
// mainRouter.use(`${prefix}/reviews`, reviewsRouter);
mainRouter.use(`${prefix}/transaction`, transactionRouter);
// mainRouter.use(`${prefix}/favorite`, favoriteRouter);

mainRouter.get("/", (req, res) => {
  res.json({
    msg: "This Is API from XAZAM-Ticketz",
  });
});

mainRouter.get("/verify/:id", function (req, res) {
  client
    .get(req.params.id)
    .then((results) => {
      if (!results)
        res.status(400).send(`
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
        <div>
          <image src="https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png" alt="ceklist" style="width: 75px; height: 75px"/>
        </div>
        <div>
          <p style="font-weight:800;font-size:25px;font-family:Consolas">Bad Request</p>
        </div>
      </div>
      `);
      if (results) {
        const query = `update users set status = 'verified'`;
        db.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.json({
              msg: "System Error !",
            });
          }
          client.del(req.params.id);
          // res.status(200).send("<h1>Email  is been Successfully verified");
          res.status(200).send(`
          <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
            <div>
              <image src="https://www.pngall.com/wp-content/uploads/5/Checklist-Logo.png" alt="ceklist" style="width: 75px; height: 75px"/>
            </div>
            <div>
              <p style="font-weight:800;font-size:25px;font-family:Consolas">Your Email Was Successfully verified</p>
            </div>
          </div>
          `);
        });
      } else {
        res.status(400).send(`
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
          <div>
            <image src="https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png" alt="ceklist" style="width: 75px; height: 75px"/>
          </div>
          <div>
            <p style="font-weight:800;font-size:25px;font-family:Consolas">Bad Request</p>
          </div>
        </div>
        `);
      }
    })
    .catch((err) => {
      res.status(400).send(`
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
        <div>
          <image src="https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png" alt="ceklist" style="width: 75px; height: 75px"/>
        </div>
        <div>
          <p style="font-weight:800;font-size:25px;font-family:Consolas">Bad Request</p>
        </div>
      </div>
      `);
    });
});

module.exports = mainRouter;
