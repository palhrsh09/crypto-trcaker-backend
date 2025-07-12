// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./allowed.route'); 
const coinRoutes = require('./coin.route');
const historyRoutes = require('./history.route');
const verifyToken = require('../middleware');


router.use('/auth', userRoutes);    
router.use('/coins',verifyToken, coinRoutes);      
router.use('/history',verifyToken, historyRoutes);     

module.exports = router;
