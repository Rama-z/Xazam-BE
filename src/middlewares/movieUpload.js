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
  const id_movie = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
  const fileName = `movie_${id_movie}`;
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
    req.id = id_movie;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(err).json({ msg: "Internal Server Error" });
  }
};

module.exports = uploader;
