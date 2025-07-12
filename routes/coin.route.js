const express = require('express');
const axios = require('axios');
const Coin = require('../models/Coin');
const router = express.Router();

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// GET /api/coins - Fetch and store current coin data
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(COINGECKO_API);
    // console.log(response.data);
    const coins = response?.data?.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date(coin.last_updated),
    }));

    // Overwrite current data in Coin collection
    await Coin.deleteMany({});
    await Coin.insertMany(coins);

    res.json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Failed to fetch coin data' });
  }
});

module.exports = router;