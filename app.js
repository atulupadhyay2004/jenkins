const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'CI/CD Demo App'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: process.env.APP_VERSION || '1.0.0',
        uptime: process.uptime()
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});