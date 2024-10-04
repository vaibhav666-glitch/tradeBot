import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

//This is how we can fetch Data from API


// const fetchData=async()=>{
//     const response=await axios.get("fetch API");
//     return response.data;
// }


// Mock stock price data
let mockStockPrice = 100; // Initial mock price
const stockPrices = []; // Array to store stock prices
let position = null; // buy or sell
let balance = 1000; // Initial balance
let shares = 0;
let dataCount = 0;
let trades = [];

// Moving Average settings
const shortTermPeriod = 5; // Short-term moving average window 
const longTermPeriod = 20; // Long-term moving average window 

// Function to simulate stock price changes
function getStockPrice() {
  const randomChange = (Math.random() * 2 - 1).toFixed(2); // Random price change
  mockStockPrice = parseFloat((mockStockPrice + parseFloat(randomChange)).toFixed(2));
  stockPrices.push(mockStockPrice);

  // Keep prices array limited to longTermPeriod
  if (stockPrices.length > longTermPeriod) {
    stockPrices.shift();
  }

  return mockStockPrice;
}

// Function to calculate moving average
function calculateMovingAverage(period, prices) {
  if (prices.length < period) {
    return null; // Not enough data yet
  }
  const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
  return sum / period;
}

// Trading logic based on moving average crossover
function executeTradingStrategy() {
  const shortTermMA = calculateMovingAverage(shortTermPeriod, stockPrices);
  const longTermMA = calculateMovingAverage(longTermPeriod, stockPrices);

  if (shortTermMA && longTermMA) {
    // Check for crossover signals
    if (shortTermMA > longTermMA && position !== 'buy') {
      // Buy signal when Short term MA crosses above long term MA
      if (balance >= mockStockPrice) {
        shares = Math.floor(balance / mockStockPrice); // Buy as many shares as possible
        const cost = shares * mockStockPrice;
        balance -= cost;
        position = 'buy';
        trades.push({ type: 'BUY', shares, price: mockStockPrice, cost });
        console.log(`BUY: Bought ${shares} shares at $${mockStockPrice}. New balance: $${balance}`);
      }
    } else if (shortTermMA < longTermMA && position === 'buy') {
      // Sell signal  Short term MA crosses below long term MA
      const revenue = shares * mockStockPrice;
      balance += revenue;
      trades.push({ type: 'SELL', shares, price: mockStockPrice, revenue });
      console.log(`SELL: Sold ${shares} shares at $${mockStockPrice}. New balance: $${balance}`);
      shares = 0;
      position = 'sell';
    }
  }
}

function generateSummaryReport() {
  const initialBalance = 1000;
  const finalBalance = balance + (shares * mockStockPrice);
  const profitLoss = finalBalance - initialBalance;

  console.log("\n--- Trading Bot Summary Report ---");
  console.log(`Initial Balance: $${initialBalance}`);
  console.log(`Final Balance: $${finalBalance.toFixed(2)}`);
  console.log(`Profit/Loss: $${profitLoss.toFixed(2)}`);
  console.log(`Final Shares Held: ${shares}`);
  console.log(`Final Share Price: $${mockStockPrice}`);
  console.log("\nTrade History:");
  trades.forEach((trade, index) => {
    console.log(`${index + 1}. ${trade.type}: ${trade.shares} shares at $${trade.price} (${trade.type === 'BUY' ? 'Cost' : 'Revenue'}: $${trade.type === 'BUY' ? trade.cost.toFixed(2) : trade.revenue.toFixed(2)}) ${trade.type=='SELL' && trade.revenue-trade.cost<0?'Loss':'Profit'}`);
  });
  console.log("\n--- End of Report ---");

  return {
    initialBalance,
    finalBalance,
    profitLoss,
    finalShares: shares,
    finalSharePrice: mockStockPrice,
    trades
  };
}

io.on('connection', (socket) => {
  console.log('A client connected');

  const interval = setInterval(() => {
    if (dataCount >= 60) {
      clearInterval(interval);
      const summaryReport = generateSummaryReport();
      io.emit('tradingSummary', summaryReport);
      return;
    }

    const price = getStockPrice();
    executeTradingStrategy();
    
    // Emit price and balance to clients
    io.emit('stockPriceUpdate', { price, balance, shares });
    
    dataCount++;
  }, 1000);

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// REST API endpoint to fetch current stock price
app.get('/stockPrice', (req, res) => {
  res.json({ price: mockStockPrice, balance, shares });
});

// Start server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});