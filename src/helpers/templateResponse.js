exports.templateResponse = (statusCode, message, data, error) => {
  return { statusCode, message, data, error };
};
exports.invalidParameter = () => {
  return this.templateResponse(
    this.responseCode.BADREQUEST,
    this.msgList.INVALID_PARAMETER
  );
};
exports.unauthorized = () => {
  return this.templateResponse(
    this.responseCode.UNAUTHORIZED,
    this.msgList.UNAUTHORIZED
  );
};
exports.emailreadyexsits = () => {
  return this.templateResponse(
    this.responseCode.EMAIL_ALREADY_EXIST,
    this.msgList.EMAIL_ALREADY_EXIST
  );
};
exports.phonealreadyexsits = () => {
  return this.templateResponse(
    this.responseCode.PHONE_ALREADY_EXIST,
    this.msgList.PHONE_ALREADY_EXIST
  );
};
exports.datareadyexsits = () => {
  return this.templateResponse(
    this.responseCode.DATA_ALREADY_EXIST,
    this.msgList.DATA_ALREADY_EXIST
  );
};
exports.wrongData = () => {
  return this.templateResponse(
    this.responseCode.UNAUTHORIZED,
    this.msgList.WRONG_DATA
  );
};
exports.forbiddenAccess = () => {
  return this.templateResponse(
    this.responseCode.FORBIDDEN,
    this.msgList.UNAUTHORIZED
  );
};
exports.success = (data) => {
  return this.templateResponse(this.responseCode.OK, this.msgList.OK, data);
};
exports.custMsg = (data) => {
  return this.templateResponse(this.responseCode.BADREQUEST, data);
};
exports.created = (data) => {
  return this.templateResponse(
    this.responseCode.CREATED,
    this.msgList.CREATED,
    data
  );
};
exports.notFound = () => {
  return this.templateResponse(
    this.responseCode.NOT_FOUND,
    this.msgList.NOT_FOUND
  );
};
exports.userLogin = (data) => {
  return this.templateResponse(
    this.responseCode.USER_LOGIN,
    this.msgList.USER_LOGIN,
    data
  );
};
exports.systemError = (error) => {
  return this.templateResponse(
    this.responseCode.INTERNAL_SERVER_ERROR,
    this.msgList.SYSTEM_ERROR,
    {},
    error
  );
};

exports.responseCode = {
  NOT_FOUND: 404,
  BADREQUEST: 400,
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  EMAIL_ALREADY_EXIST: 400,
  PHONE_ALREADY_EXIST: 400,
  DATA_ALREADY_EXIST: 400,
  USER_LOGIN: 200,
};

exports.msgList = {
  OK: "success!",
  CREATED: `created!`,
  INVALID_PARAMETER: "invalid_parameter",
  UNAUTHORIZED: "unauthorized",
  SYSTEM_ERROR: "system_error",
  USER_NOT_FOUND: "user_not_found",
  NOT_FOUND: `data_not_found`,
  INVALID_TOKEN: "invalid_token",
  NO_TOKEN_PROVIDED: "no_token_provided",
  EMAIL_ALREADY_EXIST: "*email already exists*",
  PHONE_ALREADY_EXIST: "*phone already exists*",
  DATA_ALREADY_EXIST: "data already exists",
  USER_LOGIN: "login success",
  WRONG_DATA: "Email/Password is Wrong",
};
