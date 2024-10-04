# Stock Trading Bot

This is a stock trading bot developed using Node.js, Express, and Socket.io. It simulates stock trading through moving average crossover strategies by generating mock stock prices and executing buy/sell trades based on calculated moving averages. Although I considered using a mock API, the dataset did not meet my requirements, so I have commented out the code that demonstrates how to fetch data using an API.


## Technologies Used

- Node.js
- Express
- Socket.io
- Axios

## Features

- Simulates stock price changes
- Implements a moving average crossover trading strategy
- Real-time stock price updates via WebSocket
- REST API to fetch the current stock price and account balance
- Trade history logging

## Trading Logic

The trading bot employs a moving average crossover strategy, utilizing two moving averages:
- **Short-Term Moving Average:** Calculated over the last 5 stock prices.
- **Long-Term Moving Average:** Calculated over the last 20 stock prices.

### Strategy Overview:

1. **Buy Signal:** When the short-term moving average crosses above the long-term moving average, the bot executes a buy order if there are sufficient funds.
2. **Sell Signal:** When the short-term moving average crosses below the long-term moving average, the bot sells all shares held.

The bot tracks the balance, number of shares, and logs each trade.

## API Usage

### Fetch Current Stock Price

- **Endpoint:** `GET /stockPrice`
- **Response:**
  ```json
  {
    "price": 100,
    "balance": 1000,
    "shares": 0
  }

## How to Run The Application
**Clone the repository:**
- 1. git clone https://github.com/vaibhav666-glitch/tradeBot.git
- 2. cd tradeBot

**Install dependencies:**
- npm i
**Start the server**
- node index.js

### Client side usage
- 1. **Open** client.html
- 2. press the **Go-Live** button (if you're using Visual Studio Code Live Server extension) to launch the client-side interface.

