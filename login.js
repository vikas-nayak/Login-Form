const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const SECRET_KEY = process.env.SECRET_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

// Define user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Define user model
const User = mongoose.model("User", userSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to authenticate user
function authMiddleware(req, res, next) {
  const { username, password } = req.body;

  User.findOne({ username, password })
    .then((user) => {
      if (!user) {
        return res.status(401).send("Invalid username or password");
      }
      req.username = username; // Store username in request for later use
      next();
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).send("Internal server error");
    });
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("No token provided");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }
    req.username = decoded.username; // Store username in request for later use
    next();
  });
}

// Login endpoint
app.post("/login", authMiddleware, (req, res) => {
  const { username } = req;
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Logged in successfully!!", token });
});

// Signup endpoint
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  User.create({ username, password })
    .then(() => {
      res.send("Signed up successfully!!");
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      res.status(500).send("Error creating user");
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
