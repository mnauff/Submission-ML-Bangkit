const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exception/inputError");

async function predict(model, image) {
  const tensor = tf.node
    .decodeImage(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();
  const classes = ["Non-cancer", "Cancer"];
  try {
    const prediction = model.predict(tensor);
    const predictionData = await prediction.data();
    let classIndex = -1; // Initialize classIndex with a default value

    let suggestion = "";

    predictionData.forEach((item) => {
      if (item >= 1) {
        suggestion = "Segera periksa ke dokter!";
        classIndex = 1;
      } else if (item < 1) {
        suggestion = "Anda sehat!";
        classIndex = 0;
      }
    });

    const label = classes[classIndex];
    return { label, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
  }
}

module.exports = { predict };
