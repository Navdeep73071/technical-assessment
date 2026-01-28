## DeFi Road Map

We are building an innovative DeFi platform similar to [Yam on RealT](https://staging-yam.realtoken.network), aiming to make decentralized finance accessible and efficient.
Our project is in advanced stages, with initial smart contracts and an frontend UI already implemented.
The role will focus on finalizing and enhancing our platform’s user interface, integrating wallet functionality, and developing a marketplace for token transactions.

## Modules

### navdeepApiTest - Ethereum USDT Integration

A comprehensive module for interacting with USDT smart contracts on Ethereum testnet. Located in `server/navdeepApiTest/`.

**Features:**

- Connect to Ethereum Sepolia testnet
- Read USDT contract information (name, symbol, decimals, total supply)
- Fetch latest Transfer events and transactions
- RESTful API endpoints for easy integration

**Quick Start:**

```bash
# Run the module directly to see all operations
node server/navdeepApiTest/index.js

# Or use the API endpoints (after starting the server)
npm run server
curl http://localhost:5000/api/navdeepApiTest/contract-info
```

**Documentation:** See [server/navdeepApiTest/README.md](server/navdeepApiTest/README.md) for detailed documentation.

## Environment

If you meet any error while running the project, check the options bellow. And if you are using Windows, it is recommended to run the project using powershell or cmd.

Node verion: v18 or later

OS: Mac, Linux, Windows(An unexpected issue may arise)
