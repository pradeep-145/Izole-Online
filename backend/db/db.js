const mongoose = require("mongoose");

// Keep the connection across Lambda invocations
let cachedDb = null;

const connectToDB = async () => {
  // If we already have a connection, use it
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using existing DB connection");
    return cachedDb;
  }

  try {
    // Set serverSelectionTimeoutMS to a lower value for faster Lambda cold starts
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log("New DB connection established");
    cachedDb = connection;
    return connection;
  } catch (error) {
    console.error("Error in DB connection", error);
    throw error;
  }
};

module.exports = connectToDB;