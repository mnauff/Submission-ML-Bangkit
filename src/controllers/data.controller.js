const Firestore = require("@google-cloud/firestore");

// Firestore setup
const firestore = new Firestore();

// Function to retrieve data from Firestore
async function getDataFromFirestore() {
  try {
    const predictCollection = firestore.collection("prediction");
    const snapshot = await predictCollection.get();

    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });

    return data;
  } catch (error) {
    console.error("Error retrieving data from Firestore:", error);
    throw error;
  }
}

module.exports = { getDataFromFirestore };
