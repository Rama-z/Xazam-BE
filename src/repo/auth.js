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

const register = (body) => {
  return new Promise((resolve) => {
    const { email, password } = body;
    const validasiEmail = `select users from users where email like $1`;
    db.query(validasiEmail, [email], (err, resEmail) => {
      if (err) {
        console.log(err);
        return resolve(systemError());
      }
      if (resEmail.rows.length > 0) {
        return resolve(emailreadyexsits());
      }
      const digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      sendVerifMail({
        to: email,
        OTP: OTP,
        name: email,
      }).then((result) => {
        client.get(OTP).then((results) => {
          if (results) return resolve(custMsg("Code already send to email!"));
          const data = {
            email: email,
            password: password,
          };
          client.set(OTP, JSON.stringify(data)).then(() => {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) {
                console.log(err);
                return resolve(systemError());
              }
              const id_user = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                  var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                  return v.toString(16);
                }
              );
              const query =
                "INSERT INTO users (id, email, password, roles_id) VALUES ($1, $2, $3, $4) RETURNING id";
              const values = [id_user, email, hashedPassword, "1"];
              db.query(query, values, (err, result) => {
                if (err) {
                  console.log(err);
                  return resolve(systemError());
                }
                const response = {
                  id: id_user,
                };
                return resolve(success(response));
              });
            });
          });
        });
      });
    });
  });
};

const login = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password } = body;
    const getEmail = `SELECT u.id, u.email, r.name as role, u.status, u.password from users u left join roles r on u.roles_id = r.id where email like $1`;
    db.query(getEmail, [email], (err, response) => {
      if (err) {
        console.log(err);
        return resolve(wrongData());
      }
      if (response.rows.length === 0) return resolve(wrongData());
      if (response.rows[0].status === "pending")
        return resolve(custMsg("Account not active"));
      const hashedPassword = response.rows[0].password;
      bcrypt.compare(password, hashedPassword, (err, isSame) => {
        if (err) {
          console.log(err);
          return resolve(wrongData());
        }
        if (!isSame) return resolve(wrongData());
        const payload = {
          user_id: response.rows[0].id,
          email,
          role: response.rows[0].role,
        };
        jwtr
          .sign(payload, process.env.SECRET_KEY, {
            expiresIn: "1d",
            issuer: process.env.ISSUER,
          })
          .then((token) => {
            const sendData = {
              user_id: response.rows[0].id,
              email,
              role: response.rows[0].role,
              token: token,
            };
            return resolve(userLogin(sendData));
          });
      });
    });
  });
};

const logout = (token) => {
  return new Promise((resolve, reject) => {
    const jwtr = new JWTR(client);
    jwtr.destroy(token.jti).then((res) => {
      if (!res) resolve(unauthorized());
      console.log(res);
      resolve(success("Success logout account"));
    });
  });
};

const resetpassword = (body) => {
  return new Promise((resolve) => {
    const { email, linkDirect } = body;
    const validasiEmail = `select users from users where email like $1`;
    db.query(validasiEmail, [email], (err, resEmail) => {
      if (err) {
        console.log(err);
        return resolve(systemError());
      }
      if (resEmail.rows.length === 0) return resolve(wrongData());
      const digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      sendMails({
        to: email,
        OTP: OTP,
        link: `${linkDirect}/${OTP}`,
      }).then((result) => {
        client
          .set(OTP, email, {
            EX: 120,
            NX: true,
          })
          .then(() => {
            const data = {
              message: "Check your email for get link reset-password",
            };
            resolve(success(data));
          });
      });
    });
  });
};

const confirmReset = (body) => {
  return new Promise((resolve) => {
    const { pincode, newPassword } = body;
    client.get(pincode).then((results) => {
      if (!results)
        return resolve(
          custMsg("Your keys is not valid, please repeat step forgot password")
        );
      bcrypt.hash(newPassword, 10, (err, newHashedPassword) => {
        if (err) {
          console.log(err);
          return resolve(systemError());
        }
        const editPwdQuery =
          "UPDATE users SET password = $1, updated_at = now() WHERE email = $2";
        const editPwdValues = [newHashedPassword, results];
        db.query(editPwdQuery, editPwdValues, (err, response) => {
          if (err) {
            console.log(err);
            return resolve(systemError());
          }
          client.del(pincode);
          resolve(success(null));
        });
      });
    });
  });
};

const authRepo = {
  register,
  login,
  logout,
  resetpassword,
  confirmReset,
};

module.exports = authRepo;
