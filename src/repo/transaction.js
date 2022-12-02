const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWTR = require("jwt-redis").default;
const db = require("../config/database");
const client = require("../config/redis");
const response = require("../helpers/response");
const jwtr = new JWTR(client);
const { sendVerifMail, sendMails } = require("../config/email");
const {
  success,
  systemError,
  created,
  emailreadyexsits,
  wrongData,
  userLogin,
  custMsg,
} = require("../helpers/templateResponse");

const createTransaction = (body) => {
  return new Promise((resolve) => {
    const {} = body;
    const query = ``;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      resolve(success(result.rows));
    });
  });
};

const getHistory = (queryParams) => {
  return new Promise((resolve) => {
    const { search, filter, sort } = queryParams;
    const query = `select t.id, m."name", m.synopsis, s."name", u.firstname, u.lastname, u.image, t.status from transactions t
    join movies m on lower(m.id) like lower(t.movie_id) 
    join studios s on s.id = t.studio_id 
    join users u on u.id = t.user_id 
    where lower(u.id) like lower('%${search}%')`;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      resolve(success(result.rows));
    });
  });
};

module.exports = { createTransaction, getHistory };
