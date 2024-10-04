import express from 'express';
import http from 'http';
import cors from 'cors'
import axios from 'axios'
import { Server } from 'socket.io';

const app=express();
const server=http.createServer(app);


const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
    }
})
//This is how we can fetch Data from API


// const fetchData=async()=>{
//     const response=await axios.get("fetch API");
//     return response.data;
// }

let mockStockPrice=100;
const stockPrices=[];
let position=null;
let balance=1000;
let shares=0;
let dataCount=0;
let trades=[];

const shortTermPeriod=5;
const longTermPeriod=20;

function getStockPrice(){
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
        // Buy signal when Short Term MA crosses above long term MA
        if (balance >= mockStockPrice) {
          shares = Math.floor(balance / mockStockPrice); // Buy as many shares as possible
          const cost = shares * mockStockPrice;
          balance -= cost;
          position = 'buy';
          trades.push({ type: 'BUY', shares, price: mockStockPrice, cost });
          console.log(`BUY: Bought ${shares} shares at $${mockStockPrice}. New balance: $${balance}`);
        }
      } else if (shortTermMA < longTermMA && position === 'buy') {
        // Sell signal when Short term MA crosses below long term MA
        const revenue = shares * mockStockPrice;
        balance += revenue;
        trades.push({ type: 'SELL', shares, price: mockStockPrice, revenue });
        console.log(`SELL: Sold ${shares} shares at $${mockStockPrice}. New balance: $${balance}`);
        shares = 0;
        position = 'sell';
      }
    }
  }



//connecting server and client  for real time communication using socket.io which uses websocket protocol
io.on('connection',(socket)=>{
    console.log('a user connected');

    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    })
})

app.listen(3200,()=>{
    console.log('server is running on port 3200')
})