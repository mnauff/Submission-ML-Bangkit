// const { predict } = require("../controllers/predict.controller");
const { predict } = require("../controllers/predict.controller");
const { upload } = require("../service/upload");

const crypto = require("crypto");

const Firestore = require("@google-cloud/firestore");
const { getDataFromFirestore } = require("../controllers/data.controller");

// Firestore setup
const firestore = new Firestore();

async function storeData(id, data) {
  const predictCollection = firestore.collection("predictions");
  return predictCollection.doc(id).set(data);
}

module.exports = (router) => {
  router.post("/predict", upload.single("image"), async (req, res) => {
    try {
      const model = req.app.locals.model;
      const image = req.file.buffer;

      const { label, suggestion } = await predict(model, image);
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      const data = {
        id,
        result: label,
        suggestion,
        createdAt,
      };

      await storeData(id, data);

      res.status(201).json({
        status: "success",
        message: "Model is predicted successfully",
        data: data,
      });
    } catch (err) {
      return res.status(400).json({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });
    }
  });
  router.get("/predict/histories", async (req, res) => {
    try {
      // Retrieve data from Firestore
      const data = await getDataFromFirestore();

      // Send data as response
      res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve data from Firestore",
      });
    }
  });
};
