const express = require("express");
const session = require("express-session");
const Redis = require("redis");
const { RedisStore } = require("connect-redis");
const path = require("path");
const cors = require("cors");
// Create Redis client
const redisClient = Redis.createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

const app = express();
app.use(cors({ origin: "*" })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve HTML + JS

// Session setup
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 5 * 60 * 1000 } // 5 min
  })
);

// API: Login
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  req.session.username = username;
  req.session.views = 0;
  res.json({ message: "Login successful", username });
});

// API: Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out" });
  });
});

// API: Get current session data
app.get("/me", (req, res) => {
  if (!req.session.username) return res.status(401).json({ error: "Not logged in" });

  req.session.views++;
  res.json({
    username: req.session.username,
    views: req.session.views,
    sessionId: req.session.id
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
