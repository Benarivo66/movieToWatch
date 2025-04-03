const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL;

exports.init = async () => {
  try {
    await mongoose.connect(mongoURL);

    console.log("Database connected!");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB Connection Error:", err);
    });

  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); 
  }
};
