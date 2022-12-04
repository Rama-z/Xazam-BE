const profileRouter = require("express").Router();
const isLogin = require("../middlewares/isLogin");
const validate = require("../middlewares/validate");
const { memoryUpload, errorHandler } = require("../middlewares/upload");
const profileUploader = require("../middlewares/profileUpload");

const { editProfile, getProfile, editPwd } = require("../controller/profile");

profileRouter.patch(
  "/edit",
  isLogin(),
  validate.body("firstname", "lastname", "notelp"),
  (req, res, next) =>
    memoryUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  profileUploader,
  validate.img(),
  editProfile
);
profileRouter.get("/", isLogin(), getProfile);
profileRouter.patch(
  "/change-password",
  isLogin(),
  validate.body("password", "new_password"),
  editPwd
);
module.exports = profileRouter;
