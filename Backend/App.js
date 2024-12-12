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

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Create "uploads" folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


// Login
app.post("/login", async (req, res) => {
  await client.connect();
  
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
    await client.connect();
    const results = await db.collection("destination").find({}).toArray();
  
    if (!results) res.status(404);
    else res.send(results).status(200);
});

// POST a new contact (with image)
app.post("/contact", upload.single("image"), (req, res) => {
  const { contact_name, phone_number, message } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
});