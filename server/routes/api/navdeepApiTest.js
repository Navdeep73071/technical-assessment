const express = require('express');
const router = express.Router();
const USDTContractService = require('../../navdeepApiTest');

// Create a single instance of the service to reuse across requests
// This avoids creating multiple connections to the blockchain
let serviceInstance = null;

/**
 * Helper function to get or create the service instance
 * Ensures we only have one active connection to the blockchain
 */
async function getServiceInstance() {
  if (!serviceInstance) {
    serviceInstance = new USDTContractService();
    // Give it a moment to initialize
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return serviceInstance;
}

/**
 * @route   GET /api/navdeepApiTest/contract-info
 * @desc    Get basic contract information (name, symbol, decimals, total supply)
 * @access  Public
 */
router.get('/contract-info', async (req, res) => {
  try {
    console.log('📡 API Request: GET /contract-info');

    const service = await getServiceInstance();

    // Return the contract information that was fetched during initialization
    res.json({
      success: true,
      data: {
        name: service.contractInfo.name,
        symbol: service.contractInfo.symbol,
        decimals: service.contractInfo.decimals.toString(),
        totalSupply: service.contractInfo.totalSupply.toString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /contract-info:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/events
 * @desc    Get latest Transfer events from the contract
 * @access  Public
 */
router.get('/events', async (req, res) => {
  try {
    console.log('📡 API Request: GET /events');

    const service = await getServiceInstance();

    // Fetch fresh events from the blockchain
    const events = await service.fetchLatestEvents();

    res.json({
      success: true,
      data: {
        events: events || [],
        count: events ? events.length : 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /events:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/transactions
 * @desc    Get latest transactions related to the contract
 * @access  Public
 */
router.get('/transactions', async (req, res) => {
  try {
    console.log('📡 API Request: GET /transactions');

    const service = await getServiceInstance();

    // Fetch fresh transactions from the blockchain
    const transactions = await service.fetchLatestTransactions();

    res.json({
      success: true,
      data: {
        transactions: transactions || [],
        count: transactions ? transactions.length : 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /transactions:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/balance/:address
 * @desc    Get token balance for a specific address
 * @access  Public
 * @param   {string} address - Ethereum address to check balance for
 */
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    console.log('📡 API Request: GET /balance/' + address);

    // Validate the address format
    const { isValidAddress } = require('../../navdeepApiTest/helpers');
    if (!isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address format',
        timestamp: new Date().toISOString()
      });
    }

    const service = await getServiceInstance();

    // Fetch the balance for the specified address
    const balance = await service.contract.balanceOf(address);
    const { formatTokenAmount } = require('../../navdeepApiTest/helpers');
    const formattedBalance = formatTokenAmount(
      balance,
      service.contractInfo.decimals
    );

    res.json({
      success: true,
      data: {
        address: address,
        balance: formattedBalance,
        balanceRaw: balance.toString(),
        symbol: service.contractInfo.symbol,
        decimals: service.contractInfo.decimals.toString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /balance:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/all
 * @desc    Get all contract data in one request (contract info, events, transactions)
 * @access  Public
 */
router.get('/all', async (req, res) => {
  try {
    console.log('📡 API Request: GET /all');

    const service = await getServiceInstance();

    // Fetch all data concurrently for better performance
    const [events, transactions] = await Promise.all([
      service.fetchLatestEvents(),
      service.fetchLatestTransactions()
    ]);

    res.json({
      success: true,
      data: {
        contractInfo: {
          name: service.contractInfo.name,
          symbol: service.contractInfo.symbol,
          decimals: service.contractInfo.decimals.toString(),
          totalSupply: service.contractInfo.totalSupply.toString()
        },
        latestEvents: events || [],
        latestTransactions: transactions || [],
        network: 'sepolia',
        contractAddress: service.contract.target
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /all:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/network
 * @desc    Connect to Ethereum network and get network info
 * @access  Public
 *
 * This endpoint directly calls the connectToNetwork() function from the constructor
 */
router.get('/network', async (req, res) => {
  try {
    console.log('📡 API Request: GET /network');

    const service = await getServiceInstance();

    // Get current block number to verify connection
    const blockNumber = await service.provider.getBlockNumber();

    res.json({
      success: true,
      data: {
        network: 'sepolia',
        chainId: 11155111,
        rpcUrl: service.provider._getConnection().url,
        currentBlockNumber: blockNumber,
        connected: true
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /network:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/contract
 * @desc    Get smart contract connection details
 * @access  Public
 *
 * This endpoint directly calls the connectToContract() function from the constructor
 */
router.get('/contract', async (req, res) => {
  try {
    console.log('📡 API Request: GET /contract');

    const service = await getServiceInstance();

    res.json({
      success: true,
      data: {
        contractAddress: service.contract.target,
        abiLoaded: true,
        functionsCount: service.contract.interface.fragments.length,
        network: 'sepolia'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /contract:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/read-contract-info
 * @desc    Read basic contract information (calls readContractInfo() from constructor)
 * @access  Public
 *
 * This endpoint directly calls the readContractInfo() function from the constructor
 */
router.get('/read-contract-info', async (req, res) => {
  try {
    console.log('📡 API Request: GET /read-contract-info');

    const service = await getServiceInstance();

    // Call the readContractInfo function directly
    const contractInfo = await service.readContractInfo();

    res.json({
      success: true,
      data: contractInfo
        ? {
            name: contractInfo.name,
            symbol: contractInfo.symbol,
            decimals: contractInfo.decimals.toString(),
            totalSupply: contractInfo.totalSupply.toString()
          }
        : service.contractInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /read-contract-info:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/read-state-variables
 * @desc    Read public state variables (calls readPublicStateVariables() from constructor)
 * @access  Public
 *
 * This endpoint directly calls the readPublicStateVariables() function from the constructor
 */
router.get('/read-state-variables', async (req, res) => {
  try {
    console.log('📡 API Request: GET /read-state-variables');

    const service = await getServiceInstance();
    const helpers = require('../../navdeepApiTest/helpers');

    // Call the readPublicStateVariables function directly
    const stateData = await service.readPublicStateVariables();

    res.json({
      success: true,
      data: stateData
        ? {
            nullAddressBalance: helpers.formatTokenAmount(
              stateData.nullBalance,
              service.contractInfo.decimals
            ),
            exampleWalletBalance: helpers.formatTokenAmount(
              stateData.walletBalance,
              service.contractInfo.decimals
            ),
            allowance: helpers.formatTokenAmount(
              stateData.allowance,
              service.contractInfo.decimals
            ),
            symbol: service.contractInfo.symbol
          }
        : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /read-state-variables:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/fetch-events
 * @desc    Fetch latest transfer events (calls fetchLatestEvents() from constructor)
 * @access  Public
 *
 * This endpoint directly calls the fetchLatestEvents() function from the constructor
 */
router.get('/fetch-events', async (req, res) => {
  try {
    console.log('📡 API Request: GET /fetch-events');

    const service = await getServiceInstance();

    // Call the fetchLatestEvents function directly
    const events = await service.fetchLatestEvents();

    res.json({
      success: true,
      data: {
        events: events || [],
        count: events ? events.length : 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /fetch-events:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/fetch-transactions
 * @desc    Fetch latest transactions (calls fetchLatestTransactions() from constructor)
 * @access  Public
 *
 * This endpoint directly calls the fetchLatestTransactions() function from the constructor
 */
router.get('/fetch-transactions', async (req, res) => {
  try {
    console.log('📡 API Request: GET /fetch-transactions');

    const service = await getServiceInstance();

    // Call the fetchLatestTransactions function directly
    const transactions = await service.fetchLatestTransactions();

    res.json({
      success: true,
      data: {
        transactions: transactions || [],
        count: transactions ? transactions.length : 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /fetch-transactions:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/navdeepApiTest/
 * @desc    Root endpoint - provides API documentation
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ethereum USDT Integration API',
    version: '1.0.0',
    description:
      'All 5 constructor functions are available as direct API endpoints',
    endpoints: [
      {
        path: '/api/navdeepApiTest/contract-info',
        method: 'GET',
        description: 'Get basic contract information (cached)'
      },
      {
        path: '/api/navdeepApiTest/events',
        method: 'GET',
        description: 'Get latest Transfer events'
      },
      {
        path: '/api/navdeepApiTest/transactions',
        method: 'GET',
        description: 'Get latest transactions'
      },
      {
        path: '/api/navdeepApiTest/balance/:address',
        method: 'GET',
        description: 'Get token balance for an address'
      },
      {
        path: '/api/navdeepApiTest/all',
        method: 'GET',
        description: 'Get all data at once'
      },
      {
        path: '/api/navdeepApiTest/network',
        method: 'GET',
        description: '[Constructor Function 1] Connect to Ethereum network'
      },
      {
        path: '/api/navdeepApiTest/contract',
        method: 'GET',
        description:
          '[Constructor Function 2] Get smart contract connection details'
      },
      {
        path: '/api/navdeepApiTest/read-contract-info',
        method: 'GET',
        description: '[Constructor Function 3] Read contract info (fresh call)'
      },
      {
        path: '/api/navdeepApiTest/read-state-variables',
        method: 'GET',
        description: '[Constructor Function 4] Read public state variables'
      },
      {
        path: '/api/navdeepApiTest/fetch-events',
        method: 'GET',
        description: '[Constructor Function 5] Fetch latest transfer events'
      },
      {
        path: '/api/navdeepApiTest/fetch-transactions',
        method: 'GET',
        description: '[Constructor Function 6] Fetch latest transactions'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
