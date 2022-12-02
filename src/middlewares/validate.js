module.exports = {
  body: (...allowedKeys) => {
    return (req, res, next) => {
      const { body } = req;
      const sanitizedKey = Object.keys(body).filter((key) =>
        allowedKeys.includes(key)
      );
      const newBody = {};
      for (let key of sanitizedKey) {
        Object.assign(newBody, { [key]: body[key] });
      }
      req.body = newBody;
      next();
    };
  },
  params: (...allowedKeys) => {
    return (req, res, next) => {
      const { params } = req;
      const sanitizedKey = Object.keys(params).filter((key) =>
        allowedKeys.includes(key)
      );
      const newParams = {};
      for (let key of sanitizedKey) {
        Object.assign(newParams, { [key]: params[key] });
      }
      req.params = newParams;
      next();
    };
  },
  img: () => {
    return (req, res, next) => {
      let { file } = req;
      if (!file) {
        file = null;
      }
      next();
    };
  },
  imgs: () => {
    return (req, res, next) => {
      let { files } = req;
      // console.log(files);
      if (!files) {
        files = null;
      }
      next();
    };
  },
  email: (...allowedKeys) => {
    return (req, res, next) => {
      const { body } = req;
      const sanitizedKey = Object.keys(body).filter((key) =>
        allowedKeys.includes(key)
      );
      const newBody = {};
      let isEmail = null;
      for (let key of sanitizedKey) {
        if (key == "email" && typeof key == "string") {
          let atps = body[key].indexOf("@");
          let dots = body[key].lastIndexOf(".");
          if (atps < 1 || dots < atps + 2 || dots + 2 >= body[key].length) {
            return res
              .status(400)
              .json({ msg: "Error Input Data Email!", data: null });
          }
        }
        if (key == "emailOrusername" && typeof key == "string") {
          let atps = body[key].indexOf("@");
          let dots = body[key].lastIndexOf(".");
          isEmail = true;
          if (atps < 1 || dots < atps + 2 || dots + 2 >= body[key].length)
            isEmail = false;
        }
        if (key == "phone") {
          let regexPhone =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          if (!regexPhone.test(body[key])) {
            return res
              .status(400)
              .json({ msg: "wrong input number phone", data: null });
          }
        }
        if (key == "password") {
          if (body[key].length < 8) {
            return res
              .status(400)
              .json({ msg: "password is at least 8 letters", data: null });
          }
        }
        Object.assign(newBody, { [key]: body[key] });
        if (isEmail !== null)
          Object.assign(newBody, { [key]: body[key], isEmail: isEmail });
      }
      req.body = newBody;
      next();
    };
  },
};
