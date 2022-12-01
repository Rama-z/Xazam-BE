const bcrypt = require("bcrypt");
const response = require("../helpers/response");
const {
  success,
  notFound,
  systemError,
  created,
  emailreadyexsits,
  datareadyexsits,
  custMsg,
  phonealreadyexsits,
} = require("../helpers/templateResponse");
const db = require("../config/database");

const editPorfile = (body, token, file) => {
  return new Promise((resolve) => {
    const { password, firstname, lastname, noTelp } = body;
    let query = "update users set ";
    const values = [];
    const userId = token.user_id;
    let imageProduct = "";
    let data = {};
    if (file) {
      imageProduct = file.url;
      if (!password && !firstname && !lastname && !noTelp) {
        if (file && file.resource_type == "image") {
          query += `image = '${imageProduct}',updated_at = now() where id = $1`;
          values.push(userId);
          data["image"] = imageProduct;
        }
      } else {
        if (file && file.resource_type == "image") {
          query += `image = '${imageProduct}',`;
          data["image"] = imageProduct;
        }
      }
    }
    const getData = "select * from users where id = $1";
    db.query(getData, [userId], (err, resData) => {
      if (err) {
        console.log(err);
        return resolve(systemError());
      }
      if (resData.rows.length < 1) {
        return resolve(notFound());
      }
      Object.keys(body).forEach((key, idx, array) => {
        if (key == "image") key = "image";
        if (idx === array.length - 1) {
          query += `${key} = $${idx + 1},updated_at = now() where id = $${
            idx + 2
          }`;
          values.push(body[key], userId);
          data[key] = body[key];
          return;
        }
        query += `${key} = $${idx + 1},`;
        values.push(body[key]);
        data[key] = body[key];
      });
      db.query(query, values)
        .then((response) => {
          resolve(success(data));
        })
        .catch((err) => {
          console.log(err);
          resolve(systemError());
        });
    });
  });
};

const getProfile = (token) => {
  return new Promise((resolve) => {
    const query =
      "select firstname,lastname,notelp,image from users where id = $1";
    db.query(query, [token.user_id], (err, profiles) => {
      if (err) {
        resolve(systemError());
      }
      resolve(success(profiles.rows[0]));
    });
  });
};

const profileRepo = {
  editPorfile,
  getProfile,
};

module.exports = profileRepo;
