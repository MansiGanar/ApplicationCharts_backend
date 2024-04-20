const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const dbURL = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(`${dbURL}`, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectToMongoDB();

// Define Schema
const dataSchema = new mongoose.Schema({
  end_year: String,
  intensity: Number,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: String,
  impact: String,
  added: Date,
  published: Date,
  country: String,
  relevance: Number,
  pestle: String,
  source: String,
  title: String,
  likelihood: Number,
});

const DataModel = mongoose.model("Data", dataSchema);

// Read data from jsondata.json and save to MongoDB
const rawData = fs.readFileSync("jsondata.json");
const jsonData = JSON.parse(rawData);
async function insertData() {
  try {
    for (let i = 0; i < jsonData.length; i++) {
      await DataModel.create(jsonData[i]);
    }
    console.log("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

insertData();

// Define route to fetch data from MongoDB
app.get("/api/data", async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
