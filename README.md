## Redis Concepts :



### Installation of Redis in Ubuntu

```bash
sudo apt update
sudo apt install redis-server -y
```

Enable Redis to start automatically

Edit the redis config:
```bash
sudo nano /etc/redis/redis.conf
```

Change the following line 

change ```supervised no``` to ```supervised systemd```
Save and exit


Open Redis CLI
```bash
redis-cli
```

Test
```
127.0.0.1:6379> ping
PONG
```

[Official Installation Docs](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/)





The following repository contains the performance of api using redis . We generally see the response time of request with both caching and no-caching


## Installation Steps:

```bash
git clone https://github.com/uchiha-vivek/Redis-concepts.git
```

```bash
cd Redis-concepts
```

Install the dependencies
```bash
npm install
```

Run the file
```bash
node index.js
```









