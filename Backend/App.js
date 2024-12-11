import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import fs from "fs";
var app = express();
app.use(cors());
app.use(json());


const port = "8081";
const host = "localhost";
app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

// MongoDB constants
const url = "mongodb://127.0.0.1:27017";
const dbName = "voyage_viewer";
const client = new MongoClient(url);
const db = client.db(dbName);

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
app.get("/destination", async (req, res) => {
    await client.connect();
    const query = {};
    const results = await db.collection("destination").find(query).limit(100).toArray();
  
    if (!results) res.status(404);
    else res.send(results).status(200);
});