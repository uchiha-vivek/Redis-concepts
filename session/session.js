const express = require("express");
const session = require("express-session");
const Redis = require("redis");
const RedisStore = require("connect-redis").RedisStore;


const redisClient = Redis.createClient({
  legacyMode: true 
});
redisClient.connect().catch(console.error);

const app = express();


app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "viveksharma", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 60000 }, 
  })
);


app.get("/", (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  console.log('Count views :',req.session.views)
  res.send(`
    <h1>Session with Redis</h1>
    <p>You have visited this page ${req.session.views} times.</p>
    <p>Session ID: ${req.session.id}</p>
  `);
});


app.get("/reset", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Error destroying session");
    res.send("Session reset!");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
