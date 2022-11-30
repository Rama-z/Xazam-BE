const authRepo = require("../repo/auth");

const registerUser = async (req, res) => {
  const result = await authRepo.register(req.body);
  res.status(result.statusCode).send(result);
};

const loginUser = async (req, res) => {
  const result = await authRepo.login(req.body);
  res.status(result.statusCode).send(result);
};

const logoutUser = async (req, res) => {
  const result = await authRepo.logout(req.userPayload);
  res.status(result.statusCode).send(result);
};

const resetPwd = async (req, res) => {
  const result = await authRepo.resetpassword(req.body);
  res.status(result.statusCode).send(result);
};

const confirmPwd = async (req, res) => {
  const result = await authRepo.confirmReset(req.body);
  res.status(result.statusCode).send(result);
};

const authController = {
  registerUser,
  loginUser,
  logoutUser,
  resetPwd,
  confirmPwd,
};

module.exports = authController;
