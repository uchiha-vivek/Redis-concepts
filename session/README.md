## Redis Concepts :

<p align="center">
   <img src="../assets/redis.png" width="150" alt="Redis Logo" style="margin-right: 20px;">
   <img src="../assets/db.png" width="150" alt="Database Logo">
</p>


<h1 align="center">
Redis
</h1>





# Redis Session Login Demo

This is a simple **Node.js + Express** application demonstrating how to use **Redis** for session storage with `express-session` and `connect-redis`.  
It tracks the number of times a user visits the site during their session.

---

## Features
- Session storage in Redis for persistence across server restarts.
- Visit counter that increments each time the page is visited.
- Route to reset/destroy the session.
- Cookie-based session ID management.

---

## Tech Stack
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Redis** - In-memory data store for sessions
- **express-session** - Session middleware for Express
- **connect-redis** - Redis session store adapter
---


