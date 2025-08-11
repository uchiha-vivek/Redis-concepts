const express = require("express");
const Redis = require("redis");

const app = express();
app.use(express.json());

// Primary Redis (writes)
const primaryClient = Redis.createClient({ url: "redis://127.0.0.1:6379" });

// Replica Redis (reads)
const replicaClient = Redis.createClient({ url: "redis://127.0.0.1:6380" });

primaryClient.on("error", (err) => console.error("Primary Redis Error", err));
replicaClient.on("error", (err) => console.error("Replica Redis Error", err));

(async () => {
  await primaryClient.connect();
  await replicaClient.connect();
  console.log("Connected to Primary and Replica Redis");
})();

// Write data to primary
app.post("/set", async (req, res) => {
  const { key, value } = req.body;
  if (!key || !value) return res.status(400).json({ error: "Key and value required" });

  await primaryClient.set(key, value);
  res.json({ message: `Stored {${key}:${value}} in Primary Redis` });
});

// Read data from replica
app.get("/get/:key", async (req, res) => {
  const key = req.params.key;
  const value = await replicaClient.get(key);

  if (!value) {
    return res.status(404).json({ error: "Key not found" });
  }
  res.json({ key, value, source: "Replica Redis" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
