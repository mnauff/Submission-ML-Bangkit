const express = require("express");
const predict = require("./predict");

const router = express.Router();

predict(router);

module.exports = () => {
  return router;
};
