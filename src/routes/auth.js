const authRouter = require("express").Router();
const validate = require("../middlewares/validate");
const isLogin = require("../middlewares/isLogin");
const {
  registerUser,
  loginUser,
  logoutUser,
  resetPwd,
  confirmPwd,
} = require("../controller/auth");

authRouter.post(
  "/register",
  validate.email("email", "password", "firstName", "lastName"),
  registerUser
);
authRouter.post("/login", validate.email("email", "password"), loginUser);
authRouter.delete("/logout", isLogin(), logoutUser);
authRouter.post(
  "/reset-password",
  validate.body("email", "linkDirect"),
  resetPwd
);

authRouter.patch(
  "/reset-password",
  validate.body("pincode", "newPassword"),
  confirmPwd
);
module.exports = authRouter;
