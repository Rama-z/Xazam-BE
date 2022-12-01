const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploader = async (req, res, next) => {
  const { body, file, userPayload } = req;
  if (!file) return next();

  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);
  const fileName = `user_${userPayload.user_id}`;
  const cloudinaryOpt = {
    public_id: fileName,
    folder: "RIMA-Tech",
  };

  try {
    const result = await cloudinary.uploader.upload(
      datauri.content,
      cloudinaryOpt
    );
    req.file = result;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(err).json({ msg: "Internal Server Error" });
  }
};

module.exports = uploader;
