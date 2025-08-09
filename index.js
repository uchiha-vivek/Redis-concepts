const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('redis');

const app = express();
app.use(cors());

const DEFAULT_EXPIRATION = 3600;


const client = Redis.createClient();
client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await client.connect();
})();


let metrics = {
    cached: {
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        totalResponseTime: 0,
        averageResponseTime: 0
    },
    nocache: {
        totalRequests: 0,
        totalResponseTime: 0,
        averageResponseTime: 0
    }
};


app.get('/photos', async (req, res) => {
    const start = Date.now();
    const albumId = req.query.albumId;

    if (!albumId) {
        return res.status(400).json({ error: 'albumId query parameter is required' });
    }

    const cacheKey = `photos?albumId=${albumId}`;
    metrics.cached.totalRequests++;

    try {
        const cachedPhotos = await client.get(cacheKey);

        if (cachedPhotos) {
            metrics.cached.cacheHits++;
            console.log('Cache hit');

            const duration = Date.now() - start;
            metrics.cached.totalResponseTime += duration;
            metrics.cached.averageResponseTime = metrics.cached.totalResponseTime / metrics.cached.totalRequests;

            return res.json({
                source: 'Redis Cache',
                durationMs: duration,
                data: JSON.parse(cachedPhotos)
            });
        }

        metrics.cached.cacheMisses++;
        console.log('Cache miss');

        const { data } = await axios.get(
            'https://jsonplaceholder.typicode.com/photos',
            { params: { albumId } }
        );

        await client.setEx(cacheKey, DEFAULT_EXPIRATION, JSON.stringify(data));

        const duration = Date.now() - start;
        metrics.cached.totalResponseTime += duration;
        metrics.cached.averageResponseTime = metrics.cached.totalResponseTime / metrics.cached.totalRequests;

        res.json({
            source: 'API (cached now)',
            durationMs: duration,
            data
        });

    } catch (error) {
        console.error('Error in cached endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/photos-nocache', async (req, res) => {
    const start = Date.now();
    const albumId = req.query.albumId;

    if (!albumId) {
        return res.status(400).json({ error: 'albumId query parameter is required' });
    }

    metrics.nocache.totalRequests++;

    try {
        const { data } = await axios.get(
            'https://jsonplaceholder.typicode.com/photos',
            { params: { albumId } }
        );

        const duration = Date.now() - start;
        metrics.nocache.totalResponseTime += duration;
        metrics.nocache.averageResponseTime = metrics.nocache.totalResponseTime / metrics.nocache.totalRequests;

        console.log(`[No Cache] Response time: ${duration} ms`);

        res.json({
            source: 'API',
            durationMs: duration,
            data
        });

    } catch (error) {
        console.error('Error in non-cached endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/metrics', (req, res) => {
    res.json({
        cachedEndpoint: {
            totalRequests: metrics.cached.totalRequests,
            cacheHits: metrics.cached.cacheHits,
            cacheMisses: metrics.cached.cacheMisses,
            cacheHitRate: metrics.cached.cacheHits / (metrics.cached.cacheHits + metrics.cached.cacheMisses) || 0,
            averageResponseTimeMs: metrics.cached.averageResponseTime.toFixed(2)
        },
        nocacheEndpoint: {
            totalRequests: metrics.nocache.totalRequests,
            averageResponseTimeMs: metrics.nocache.averageResponseTime.toFixed(2)
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
