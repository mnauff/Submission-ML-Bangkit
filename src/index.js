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

app.get("/", (req, res) => {
  res.send("API is running");
});

async function startServer() {
  try {
    const model = await loadModel();
    app.locals.model = model;

    app.use("/", router());

    app.use((err, req, res, next) => {
      if (err instanceof ClientError || err instanceof InputError) {
        res.status(err.statusCode).json({
          status: "fail",
          message: err.message,
        });
      } else {
        // For other types of errors, you can provide a generic error response
        res.status(400).json({
          status: "fail",
          message: "Terjadi kesalahan dalam melakukan prediksi",
        });
      }
    });

    const port = 5000;
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

startServer();
