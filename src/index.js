const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./routes");
const loadModel = require("./service/loadModel");
const multer = require("multer");
const ClientError = require("./exception/clientError");
const InputError = require("./exception/inputError");
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

async function startServer() {
  try {
    const model = await loadModel();
    app.locals.model = model;
    app.get("/", (req, res) => {
      res.send("API is running");
    });

    app.use("/", router());

    app.use((err, req, res, next) => {
      if (err instanceof ClientError || err instanceof InputError) {
        res.status(err.statusCode).json({
          status: "fail",
          message: err.message,
        });
      } else {
        // For other types of errors, you can provide a generic error response
        res.status(413).json({
          status: "fail",
          message:
            "Payload content length greater than maximum allowed: 1000000",
        });
      }
    });

    const port = 8080;
    app.listen(8080, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

startServer();
