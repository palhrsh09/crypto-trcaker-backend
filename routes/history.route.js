const express = require('express');
const Coin = require('../models/Coin');
const History = require('../models/History');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const coins = await Coin.find();
    const historyRecords = coins.map(coin => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      change24h: coin.change24h,
      timestamp: new Date(),
    }));

    await History.insertMany(historyRecords);
    res.json({ message: 'History snapshot saved' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Failed to save history' });
  }
});

router.get('/:coinId', async (req, res) => {
  try {
    const history = await History.aggregate([
      { $match: {coinId: req.params.coinId}},
      { $sort: {timestamp: 1}},
      { $project: {
         _id: 0,
         coinId: 1,
         name: 1,
        symbol: 1,
        price: 1,
        marketCap: 1,
        change24h: 1
      }}
    ])
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;