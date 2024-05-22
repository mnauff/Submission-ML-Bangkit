const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  return tf.loadGraphModel(
    "https://storage.googleapis.com/ml_model-150524/model-prod/model.json"
  );
}
module.exports = loadModel;
