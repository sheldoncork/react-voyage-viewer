import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import fs from "fs";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve images

const port = "8081";
const host = "localhost";
app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

// MongoDB constants
const url = "mongodb://127.0.0.1:27017";
const dbName = "voyage-viewer";
const client = new MongoClient(url);
const db = client.db(dbName);

// Instant function auto connects for all endpoints
(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
})();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Create "uploads" folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


// Login
app.post("/login", async (req, res) => {
  
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const user = await db.collection("user").findOne({ username, password });

    if (!user) {
      console.log(user)
      return res.status(401).send({ error: "Invalid username or password." });
    }

    // Login successful
    res.status(200).send({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "An error occurred during login." });
  }
});

// GET All
app.get("/destinations", async (req, res) => {
    const results = await db.collection("destination").find({}).toArray();
  
    if (!results) res.status(404);
    else res.send(results).status(200);
});

// GET saved locations /saved-locations?username=user
app.get("/saved-locations", async (req, res) => {
  const { username } = req.query;
      try {
        const user = await db.collection("user").findOne({ username });
        if (!user) {
          return res.status(404);
        }

        res.status(200).json({data: user.saved || [] });
      } catch (error) {
        console.error("Error querying user:", error);
        res.status(500);
      }
    });

// POST multiple images and multiple descriptions
app.post("/destination", upload.fields([
  { name: 'image', maxCount: 1 },  // Main image
  { name: 'individualImages' },  // Individual images
]), async (req, res) => {
  console.log('Files:', req.files);
console.log('Body:', req.body);

  var url = `http://${host}:${port}`
  try {
    const lastDestination = await db.collection("destination").find().limit(1).sort({ $natural: -1 }).toArray();
    const nextId = lastDestination.length > 0 ? lastDestination[0].id + 1 : 0;

    // Prepare destination data
    const destinationData = {
      id: nextId,
      location: req.body.location,
      type: req.body.type,
      description: req.body.description,

      // Handle main image upload
      image: req.files['image'] ? `${url}/uploads/${req.files['image'][0].filename}` : req.body.image || '',

      // Handle individual images uploads
      individualImages: req.files['individualImages']
        ? req.files['individualImages'].map(file => `${url}/uploads/${file.filename}`)
        : [],

      // Handle individual descriptions
      individualDescriptions: req.body.individualDescriptions 
      ? JSON.parse(req.body.individualDescriptions)
        : [],

      // Handle activities
      activities: req.body.activities
        ? JSON.parse(req.body.activities)
        : [],

      // Handle pros and cons
      pros_and_cons: req.body.pros_and_cons
        ? JSON.parse(req.body.pros_and_cons)
        : []
    };

    // Insert into MongoDB
    const result = await db.collection("destination").insertOne(destinationData);

    res.status(200).json({
      message: "Destination added successfully",
      destination: destinationData
    });
  } catch (error) {
    console.error("Destination upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error.message
    });
  }
});

// GET single using ?id=5
app.get("/destination", async (req, res) => {
  const id = parseInt(req.query.id);
  if (isNaN(id)) { 
    return res.status(400).send('ID query parameter is required');
  }

  try{
    const destination = await db.collection("destination").findOne({id: id});
    if (!destination){
      res.status(404).send('ID not found!');
    }
    res.status(200).send(destination);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }

});

// PUT to save destination
app.put("/save-destination", async (req, res) => {
  const { username, destinationID } = req.body;

  if (!username || isNaN(destinationID)) {
    return res.status(400).send({ message: "Username and destinationID are required" });
  }

  try {
    const result = await db.collection("user").updateOne(
      { username },  // Find the user
      { $addToSet: { saved: destinationID } } // add to array
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "User not found or destination already saved" });
    }

    res.status(200).send({ message: "Destination saved successfully" });
  } catch (error) {
    console.error("Error saving destination:", error);
    res.status(500).send({ message: "Error saving destination", error });
  }
});

// PUT to remove a saved destination
app.put("/save-destination/remove", async (req, res) => {
  const { username, destinationID } = req.body;

  if (!username || isNaN(destinationID)) {
    return res.status(400).send({ message: "Username and destinationID are required" });
  }

  try {
    const result = await db.collection("user").updateOne(
      { username },  // Find the user
      { $pull: { saved: destinationID } } // remove from array
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "User not found or destination already unsaved" });
    }

    res.status(200).send({ message: "Sucessfully unsaved!"});
  } catch (error) {
    console.error("Error unsaving destination:", error);
    res.status(500).send({ message: "Error unsaving destination", error });
  }
});

// DELETE a destination by ID
app.delete("/destination/:id", async (req, res) => {
  try {
    const destinationId = parseInt(req.params.id);

    // Find the destination to get the image filenames
    const destination = await db.collection("destination").findOne({ id: destinationId });

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    // Delete the destination from the database
    const result = await db.collection("destination").deleteOne({ id: destinationId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    // Delete associated image files
    const imagesToDelete = [destination.image, ...destination.individualImages];
    for (let imageUrl of imagesToDelete) {
      if (imageUrl) {
        const filename = imageUrl.split('/').pop();
        const filepath = path.join(__dirname, 'uploads', filename);
        fs.unlink(filepath, (err) => {
          if (err) console.error(`Failed to delete file: ${filepath}`, err);
        });
      }
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Destination deletion error:", error);
    res.status(500).json({
      error: "Deletion failed",
      details: error.message
    });
  }
});
