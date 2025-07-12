const cron = require('node-cron');
const axios = require('axios');
const History = require('../models/History');
const connectDB = require('../config/db');

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// Connect to MongoDB
connectDB();

// Schedule task to run every hour
cron.schedule('* * * * *', async () => {
  try {
    console.log('Running cron job to fetch and store coin data...');
    const response = await axios.get(COINGECKO_API);
    const historyRecords = response.data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date(coin.last_updated),
    }));

    await History.insertMany(historyRecords);
    console.log('History snapshot saved');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

console.log('Cron job scheduler started');