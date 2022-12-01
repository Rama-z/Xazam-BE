require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mainRouter = require("./src/routes/main");
const server = express();
const cors = require("cors");

server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
server.use(mainRouter.get);
server.listen(8080, () => {
  console.log(`Server is running at port 8080`);
});
