import express, { json } from "express";
import cors from "cors";
import fs from "fs";
var app = express();
app.use(cors());
app.use(json());

const { MongoClient } = require("mongodb");

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
app.get("/login", async (req, res) => {
  await client.connect();
  const query = {};

  const user = db.collection("user").find(query).limit(1);
});

// GET All
app.get("/destination", async (req, res) => {
    await client.connect();
    const query = {};
    const results = await db.collection("destination").find(query).limit(100).toArray();
  
    if (!results) res.status(404);
    else res.send(results).status(200);
});