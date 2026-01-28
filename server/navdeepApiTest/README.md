# Ethereum USDT Integration Module

A comprehensive module for interacting with USDT smart contracts on Ethereum testnet. This module provides easy-to-use functions for reading contract state, fetching events, and retrieving transaction history.

## 🌟 Features

- ✅ Connect to Ethereum Sepolia testnet
- ✅ Read USDT contract information (name, symbol, decimals, total supply)
- ✅ Fetch latest Transfer events
- ✅ Retrieve latest transactions
- ✅ Check token balances for any address
- ✅ RESTful API endpoints for easy integration
- ✅ Comprehensive error handling
- ✅ Humanized console output with emojis
- ✅ Well-documented code with detailed comments

## 📁 Module Structure

```
navdeepApiTest/
├── index.js              # Main module with contract interaction logic
├── config.js             # Configuration (RPC URL, contract address, ABI)
├── helpers.js            # Utility functions for formatting and error handling
├── CODING_STANDARDS.md   # Coding standards and best practices
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or later
- npm or yarn
- Internet connection (to connect to Ethereum testnet)

### Installation

The module uses `ethers.js` v6 for blockchain interaction. It should already be installed if you ran `npm install` in the project root.

### Running the Module Directly

You can run the module directly to see all operations in action:

Preffered

```bash
node server/navdeepApiTest/index.js
```

This will:

1. Connect to Ethereum Sepolia testnet
2. Connect to the USDT smart contract
3. Read contract information
4. Fetch latest 5 Transfer events
5. Fetch latest 5 transactions
6. Display all data in the console with beautiful formatting

### Using the API Endpoints

**Important:** You need to restart the server to see the new routes!

Start the server:

```bash
npm run server
```

The server will start on a random port (check console output). Let's assume it's port 5025.

#### Original Endpoints

Then access the API endpoints:

#### Get Contract Information

```bash
curl http://localhost:5025/api/navdeepApiTest/contract-info
```

#### Get Latest Events

```bash
curl http://localhost:5025/api/navdeepApiTest/events
```

#### Get Latest Transactions

```bash
curl http://localhost:5025/api/navdeepApiTest/transactions
```

#### Get Balance for an Address

```bash
curl http://localhost:5025/api/navdeepApiTest/balance/0x0aB442ADf62723cF7A7C8C518Fc211b1134A0B67
```

#### Get All Data at Once

```bash
curl http://localhost:5025/api/navdeepApiTest/all
```

---

### 🎯 Constructor Function Endpoints

These endpoints directly call each of the 5 main functions from the constructor:

#### 1. Network Connection (connectToNetwork)

```bash
curl http://localhost:5025/api/navdeepApiTest/network
```

Returns current block number and network connection status.

#### 2. Contract Connection (connectToContract)

```bash
curl http://localhost:5025/api/navdeepApiTest/contract
```

Returns smart contract connection details and ABI info.

#### 3. Read Contract Info (readContractInfo)

```bash
curl http://localhost:5025/api/navdeepApiTest/read-contract-info
```

Calls the readContractInfo() function and returns fresh contract data.

#### 4. Read State Variables (readPublicStateVariables)

```bash
curl http://localhost:5025/api/navdeepApiTest/read-state-variables
```

Calls the readPublicStateVariables() function and returns balances and allowances.

#### 5. Fetch Events (fetchLatestEvents)

```bash
curl http://localhost:5025/api/navdeepApiTest/fetch-events
```

Calls the fetchLatestEvents() function and returns latest 5 transfer events.

#### 6. Fetch Transactions (fetchLatestTransactions)

```bash
curl http://localhost:5025/api/navdeepApiTest/fetch-transactions
```

Calls the fetchLatestTransactions() function and returns latest 5 transactions.

## 📖 API Documentation

### Available Endpoints

| Endpoint                               | Method | Description                               |
| -------------------------------------- | ------ | ----------------------------------------- |
| `/api/navdeepApiTest/`                 | GET    | API documentation and available endpoints |
| `/api/navdeepApiTest/contract-info`    | GET    | Get contract basic information            |
| `/api/navdeepApiTest/events`           | GET    | Get latest Transfer events                |
| `/api/navdeepApiTest/transactions`     | GET    | Get latest transactions                   |
| `/api/navdeepApiTest/balance/:address` | GET    | Get token balance for an address          |
| `/api/navdeepApiTest/all`              | GET    | Get all data at once                      |

### Response Format

All API responses follow this format:

**Success Response:**

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "timestamp": "2026-01-28T14:30:00.000Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2026-01-28T14:30:00.000Z"
}
```

## ⚙️ Configuration

All configuration is in `config.js`:

### Network Configuration

```javascript
const NETWORK_CONFIG = {
  name: 'sepolia',
  chainId: 11155111,
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
};
```

**To use your own RPC:**

1. Get an API key from [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/)
2. Update the `rpcUrl` in `config.js`:
   ```javascript
   rpcUrl: 'https://sepolia.infura.io/v3/YOUR_API_KEY',
   ```

### Contract Configuration

```javascript
const CONTRACT_CONFIG = {
  address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
  abi: [
    /* ERC20 ABI */
  ]
};
```

**To use a different contract:**

1. Update the `address` in `config.js`
2. If it's not a standard ERC20 token, update the `abi` array

### Query Configuration

```javascript
const QUERY_CONFIG = {
  maxEvents: 5, // Number of events to fetch
  maxTransactions: 5, // Number of transactions to fetch
  blockLookback: 10000 // How many blocks to search
};
```

## 🔧 Usage Examples

### Using in Your Own Code

```javascript
const USDTContractService = require('./server/navdeepApiTest');

// Create an instance (automatically initializes and runs)
const service = new USDTContractService();

// Wait a moment for initialization
setTimeout(async () => {
  // Access contract information
  console.log('Token Name:', service.contractInfo.name);
  console.log('Token Symbol:', service.contractInfo.symbol);

  // Fetch fresh events
  const events = await service.fetchLatestEvents();
  console.log('Events:', events);

  // Check a balance
  const balance = await service.contract.balanceOf('0x...');
  console.log('Balance:', balance.toString());
}, 3000);
```

### Using Helper Functions

```javascript
const helpers = require('./server/navdeepApiTest/helpers');

// Format an address
const short = helpers.formatAddress(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
);
// Output: "0x742d...f0bEb"

// Format token amount
const amount = helpers.formatTokenAmount('1000000', 6);
// Output: "1.0" (for USDT with 6 decimals)

// Format number with commas
const formatted = helpers.formatNumberWithCommas(1000000);
// Output: "1,000,000"

// Validate address
const isValid = helpers.isValidAddress(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
);
// Output: true
```

## 🎨 Console Output

The module produces beautiful, emoji-enhanced console output:

```
================================================================================
  🚀 ETHEREUM USDT CONTRACT INTEGRATION STARTED
================================================================================
📅 Timestamp: 1/28/2026, 7:56:00 PM
🌐 Network: SEPOLIA
📡 RPC URL: https://ethereum-sepolia-rpc.publicnode.com
📝 Contract Address: 0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0

🔄 Starting: Connect to Ethereum Network...
   📦 Current Block Number: 7,234,567
   ✅ Successfully connected to Ethereum network
✅ Completed: Connect to Ethereum Network

================================================================================
  📊 CONTRACT BASIC INFORMATION
================================================================================
   Token Name: Tether USD
   Token Symbol: USDT
   Decimals: 6
   Total Supply: 1,000,000,000 USDT
```

## 🛠️ Troubleshooting

### Common Issues

**Issue: "Cannot connect to RPC"**

- Check your internet connection
- Try a different RPC URL in `config.js`
- Verify the RPC endpoint is working: visit it in a browser

**Issue: "No events found"**

- The contract might not have recent activity
- Increase `blockLookback` in `config.js`
- Try a different contract address

**Issue: "Invalid address format"**

- Ensure the address starts with `0x`
- Verify the address is 42 characters long
- Check for typos in the address

### Debug Mode

To see more detailed logs, you can add console.log statements in the code or use Node.js debugging:

```bash
node --inspect server/navdeepApiTest/index.js
```

## 📚 Additional Resources

- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Ethereum Sepolia Testnet](https://sepolia.etherscan.io/)
- [ERC20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Coding Standards](./CODING_STANDARDS.md)

## 🤝 Contributing

When contributing to this module, please follow the coding standards outlined in `CODING_STANDARDS.md`:

1. Use humanized comments
2. Add emojis to console logs
3. Handle errors gracefully
4. Format blockchain data for readability
5. Write descriptive function names

## 📄 License

This module is part of the technical assessment project and follows the project's license.

## 👨‍💻 Author

**Navdeep API Test Module**  
Created: 2026-01-28

---

**Need help?** Check the [Coding Standards](./CODING_STANDARDS.md) or review the inline comments in the code files.
