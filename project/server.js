const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/api/summaries', async (req, res) => {
    try {
        const response = await fetch('https://indodax.com/api/summaries');
        const data = await response.json();

        res.json(data.tickers || {});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => {
    console.log('Server running http://localhost:3000');
});