const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploader = async (req, res, next) => {
  const { body, files, userPayload } = req;
  if (files.length === 0) return next();
  try {
    let count = 0;
    req.file = [];
    files.forEach(async (element, index) => {
      try {
        const parser = new DatauriParser();
        const buffer = element.buffer;
        const ext = path.extname(element.originalname).toString();
        const datauri = parser.format(ext, buffer);
        const filesName = `product_${body.name}_${index + 1}`;
        const cloudinaryOpt = {
          public_id: filesName,
          folder: "RIMA-Tech",
        };
        const rest = await cloudinary.uploader.upload(
          datauri.content,
          cloudinaryOpt
        );
        req.file.push(rest.url);
        count += 1;
        console.log(count);
        if (count === files.length) next();
      } catch (err) {
        console.log(err);
        res.status(err).json({ msg: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.log(error);
  }

  // next();
};

module.exports = uploader;
