const response = (message, code, data = null) => {
  if (data) {
    return {
      message: message,
      statusCode: code,
      data: data,
    };
  } else {
    return {
      message: message,
      statusCode: code,
    };
  }
};

module.exports = response;
