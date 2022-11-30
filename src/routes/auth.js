const authRouter = require("express").Router();
const validate = require("../middlewares/validate");
const isLogin = require("../middlewares/isLogin");
const { registerUser, loginUser } = require("../controller/auth");

authRouter.post("/register", validate.email("email", "password"), registerUser);
authRouter.post("/login", validate.email("email", "password"), loginUser);

module.exports = authRouter;
