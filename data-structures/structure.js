const express = require("express");
const Redis = require("redis");

const app = express();
const client = Redis.createClient();

client.on("error", (err) => console.error("Redis Error:", err));
(async () => {
  await client.connect();
})();




// Understanding List Data structure
//  Links : https://redis.io/glossary/lists-in-redis/
app.get('/api/v1/list', async(req,res)=> {
    await client.lPush('task1','task2','task3')
    await client.rPush('task1','task4','task5')
    const tasks = await client.lRange('task1',0,-1)
    console.log('TAsks:',tasks)
    res.json({tasks})
})


// Understanding String Data Structure
// on every refresh of the page the task count increment by 1
// Links : https://redis.io/docs/latest/develop/data-types/strings/
app.get('/api/v1/string', async(req,res)=> {
    await client.set("Name","Vivek")
    await client.incr('visit')
    const name = await client.get("Name")
    const tasks = await client.get('visit')
    console.log('Name',name)
    console.log('Tasks',tasks)
    res.json({tasks})
})

// Understanding Set Data structure
// Links : https://redis.io/docs/latest/develop/data-types/sets/
app.get('/api/v1/set',async(req,res)=> {
    await client.sAdd('candidate','vivek','rohit','harsh')
    const candidate = await client.SMEMBERS("candidate")
    console.log(candidate)
})

// 4. Understanding  Sorted SET (ZSET)
// Links : https://redis.io/docs/latest/develop/data-types/sorted-sets/
app.get("/api/v1/zset", async (req, res) => {
    await client.zAdd("leaderboard", [
      { score: 10, value: "vivek" },
      { score: 8, value: "harsh" },
    ]);
    const scores = await client.zRangeWithScores("leaderboard", 0, -1);
    console.log(scores)
    res.json({ scores });
  });
  
  // 5. Understanding HASH Data structure
  // Links : https://redis.io/docs/latest/develop/data-types/hashes/
  app.get("/api/v1/hash", async (req, res) => {
    await client.hSet("user:100", { name: "Vivek", age: "22" });
    const user = await client.hGetAll("user:100");
    console.log(user)
    res.json({ user });
  });

  // Understanding JSON
  // https://redis.io/docs/latest/develop/data-types/json/
  app.get("/api/v1/json", async (req, res) => {
  try {
    await client.sendCommand(["JSON.SET", "user:1", "$", '{"name":"Vivek","age":25}']);
    const name = await client.sendCommand(["JSON.GET", "user:1", "$.name"]);
    res.json({ jsonName: name });
  } catch (err) {
    res.json({ error: "RedisJSON module not installed" });
  }
});

app.listen(3000,()=> {
    console.log('Server is running on PORT 3000')
})