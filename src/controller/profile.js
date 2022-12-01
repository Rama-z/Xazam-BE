const profileRepo = require("../repo/profile");

const editProfile = async (req, res) => {
  const result = await profileRepo.editPorfile(
    req.body,
    req.userPayload,
    req.file
  );
  res.status(result.statusCode).send(result);
};

const getProfile = async (req, res) => {
  const result = await profileRepo.getProfile(req.userPayload);
  res.status(result.statusCode).send(result);
};

const profileControllers = {
  editProfile,
  getProfile,
};

module.exports = profileControllers;
