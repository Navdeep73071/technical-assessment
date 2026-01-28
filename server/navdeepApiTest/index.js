const { ethers } = require('ethers');
const config = require('./config');
const helpers = require('./helpers');

class USDTContractService {
  /**
   * Constructor - Initializes the connection and automatically runs all operations
   */
  constructor() {
    // These will store our blockchain connection objects
    this.provider = null;
    this.contract = null;

    // Store contract metadata once we fetch it
    this.contractInfo = {};

    // Initialize everything automatically when the class is instantiated
    this.initialize();
  }

  /**
   * Initializes the blockchain connection and runs all operations
   */
  async initialize() {
    try {
      helpers.logSeparator('🚀 ETHEREUM USDT CONTRACT INTEGRATION STARTED');
      console.log('📅 Timestamp:', new Date().toLocaleString());
      console.log('🌐 Network:', config.NETWORK_CONFIG.name.toUpperCase());
      console.log('📡 RPC URL:', config.NETWORK_CONFIG.rpcUrl);
      console.log('📝 Contract Address:', config.CONTRACT_CONFIG.address);

      // Step 1: Connect to the Ethereum network
      await this.connectToNetwork();

      // Step 2: Connect to the USDT smart contract
      await this.connectToContract();

      // Step 3: Read basic contract information (name, symbol, decimals, total supply)
      await this.readContractInfo();

      // Step 4: Read public state variables and demonstrate read operations
      await this.readPublicStateVariables();

      // Step 5: Fetch the latest Transfer events from the contract
      await this.fetchLatestEvents();

      // Step 6: Fetch the latest transactions related to the contract
      await this.fetchLatestTransactions();

      helpers.logSeparator('✅ ALL OPERATIONS COMPLETED SUCCESSFULLY');
    } catch (error) {
      console.error(
        '\n❌ CRITICAL ERROR during initialization:',
        error.message
      );
      console.error('Stack trace:', error.stack);
    }
  }

  /**
   * Establishes connection to the Ethereum testnet
   */
  async connectToNetwork() {
    return helpers.safeExecute(async () => {
      // Create a JSON-RPC provider to connect to the Ethereum network
      this.provider = new ethers.JsonRpcProvider(config.NETWORK_CONFIG.rpcUrl);

      // Verify the connection by fetching the current block number
      const blockNumber = await this.provider.getBlockNumber();

      console.log(
        '   📦 Current Block Number:',
        helpers.formatNumberWithCommas(blockNumber)
      );
      console.log('   ✅ Successfully connected to Ethereum network');

      return this.provider;
    }, 'Connect to Ethereum Network');
  }

  /**
   * Connects to the USDT smart contract using its address and ABI
   */
  async connectToContract() {
    return helpers.safeExecute(async () => {
      // Create a contract instance that we can use to call contract functions
      this.contract = new ethers.Contract(
        config.CONTRACT_CONFIG.address,
        config.CONTRACT_CONFIG.abi,
        this.provider
      );

      console.log(
        '   📋 Contract ABI loaded with',
        config.CONTRACT_CONFIG.abi.length,
        'functions/events'
      );
      console.log('   ✅ Successfully connected to USDT contract');

      return this.contract;
    }, 'Connect to USDT Smart Contract');
  }

  /**
   * This includes the token name, symbol, decimals, and total supply
   */
  async readContractInfo() {
    return helpers.safeExecute(async () => {
      helpers.logSeparator('📊 CONTRACT BASIC INFORMATION');

      // Read the token name (e.g., "Tether USD")
      const name = await this.contract.name();
      console.log('   Token Name:', name);

      // Read the token symbol (e.g., "USDT")
      const symbol = await this.contract.symbol();
      console.log('   Token Symbol:', symbol);

      // Read the number of decimal places (usually 6 for USDT, 18 for most tokens)
      const decimals = await this.contract.decimals();
      console.log('   Decimals:', decimals.toString());

      // Read the total supply of tokens in circulation
      const totalSupply = await this.contract.totalSupply();
      const formattedSupply = helpers.formatTokenAmount(totalSupply, decimals);
      console.log(
        '   Total Supply:',
        helpers.formatNumberWithCommas(formattedSupply),
        symbol
      );
      console.log('   Total Supply (Raw):', totalSupply.toString(), 'wei');

      // Store this info for later use
      this.contractInfo = { name, symbol, decimals, totalSupply };

      return this.contractInfo;
    }, 'Read Contract Basic Information');
  }

  /**
   * Shows how to check balances and allowances for specific addresses
   */
  async readPublicStateVariables() {
    return helpers.safeExecute(async () => {
      helpers.logSeparator('🔍 READ-ONLY OPERATIONS DEMONSTRATION');

      const { decimals, symbol } = this.contractInfo;

      // Example 1: Check balance of the null address (often used in minting)
      console.log('\n   📌 Example 1: Checking balance of null address');
      const nullBalance = await this.contract.balanceOf(
        config.SAMPLE_ADDRESSES.nullAddress
      );
      console.log('   Address:', config.SAMPLE_ADDRESSES.nullAddress);
      console.log(
        '   Balance:',
        helpers.formatTokenAmount(nullBalance, decimals),
        symbol
      );

      // Example 2: Check balance of an example wallet
      console.log('\n   📌 Example 2: Checking balance of example wallet');
      const walletBalance = await this.contract.balanceOf(
        config.SAMPLE_ADDRESSES.exampleWallet
      );
      console.log(
        '   Address:',
        helpers.formatAddress(config.SAMPLE_ADDRESSES.exampleWallet)
      );
      console.log('   Full Address:', config.SAMPLE_ADDRESSES.exampleWallet);
      console.log(
        '   Balance:',
        helpers.formatTokenAmount(walletBalance, decimals),
        symbol
      );

      // Example 3: Check allowance (how much one address is allowed to spend on behalf of another)
      console.log('\n   📌 Example 3: Checking allowance');
      const allowance = await this.contract.allowance(
        config.SAMPLE_ADDRESSES.exampleWallet,
        config.SAMPLE_ADDRESSES.nullAddress
      );
      console.log(
        '   Owner:',
        helpers.formatAddress(config.SAMPLE_ADDRESSES.exampleWallet)
      );
      console.log(
        '   Spender:',
        helpers.formatAddress(config.SAMPLE_ADDRESSES.nullAddress)
      );
      console.log(
        '   Allowance:',
        helpers.formatTokenAmount(allowance, decimals),
        symbol
      );

      return { nullBalance, walletBalance, allowance };
    }, 'Read Public State Variables');
  }

  /**
   * Fetches the latest Transfer events from the contract
   */
  async fetchLatestEvents() {
    return helpers.safeExecute(async () => {
      helpers.logSeparator('📡 LATEST TRANSFER EVENTS');

      // Get the current block number so we know where to search from
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(
        0,
        currentBlock - config.QUERY_CONFIG.blockLookback
      );

      console.log(
        '   🔎 Searching from block:',
        helpers.formatNumberWithCommas(fromBlock)
      );
      console.log(
        '   🔎 Searching to block:',
        helpers.formatNumberWithCommas(currentBlock)
      );
      console.log(
        '   🔎 Block range:',
        helpers.formatNumberWithCommas(config.QUERY_CONFIG.blockLookback),
        'blocks'
      );

      // Query the contract for Transfer events in the specified block range
      const transferFilter = this.contract.filters.Transfer();
      const events = await this.contract.queryFilter(
        transferFilter,
        fromBlock,
        currentBlock
      );

      console.log('   📊 Total events found:', events.length);

      // Get only the latest N events as configured
      const latestEvents = events.slice(-config.QUERY_CONFIG.maxEvents);
      console.log('   📋 Showing latest', latestEvents.length, 'events:\n');

      // Display each event in a readable format
      latestEvents.forEach((event, index) => {
        const formatted = helpers.formatEvent(
          event,
          this.contractInfo.decimals
        );
        if (formatted) {
          console.log(`   Event #${index + 1}:`);
          console.log(
            '   ├─ Block:',
            helpers.formatNumberWithCommas(formatted.blockNumber)
          );
          console.log('   ├─ Transaction:', formatted.transactionHash);
          console.log('   ├─ From:', formatted.from, `(${formatted.fromFull})`);
          console.log('   ├─ To:', formatted.to, `(${formatted.toFull})`);
          console.log(
            '   └─ Amount:',
            helpers.formatNumberWithCommas(formatted.amount),
            this.contractInfo.symbol
          );
          console.log('');
        }
      });

      return latestEvents;
    }, 'Fetch Latest Transfer Events');
  }

  /**
   * Fetches the latest transactions related to the contract
   * This shows actual blockchain transactions that interacted with the contract
   */
  async fetchLatestTransactions() {
    return helpers.safeExecute(async () => {
      helpers.logSeparator('💳 LATEST TRANSACTIONS');

      // Get the current block number
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(
        0,
        currentBlock - config.QUERY_CONFIG.blockLookback
      );

      console.log(
        '   🔎 Searching from block:',
        helpers.formatNumberWithCommas(fromBlock)
      );
      console.log(
        '   🔎 Searching to block:',
        helpers.formatNumberWithCommas(currentBlock)
      );

      // We'll collect transactions by looking at Transfer events
      // (since each event corresponds to a transaction)
      const transferFilter = this.contract.filters.Transfer();
      const events = await this.contract.queryFilter(
        transferFilter,
        fromBlock,
        currentBlock
      );

      // Get unique transaction hashes from the events
      const uniqueTxHashes = [...new Set(events.map((e) => e.transactionHash))];
      console.log(
        '   📊 Total unique transactions found:',
        uniqueTxHashes.length
      );

      // Get the latest N transaction hashes
      const latestTxHashes = uniqueTxHashes.slice(
        -config.QUERY_CONFIG.maxTransactions
      );
      console.log(
        '   📋 Showing latest',
        latestTxHashes.length,
        'transactions:\n'
      );

      // Fetch detailed information for each transaction
      for (let i = 0; i < latestTxHashes.length; i++) {
        const txHash = latestTxHashes[i];

        // Get the transaction details
        const tx = await this.provider.getTransaction(txHash);

        // Get the transaction receipt (contains gas used and status)
        const receipt = await this.provider.getTransactionReceipt(txHash);

        // Format and display the transaction
        const formatted = helpers.formatTransaction(tx, receipt);
        if (formatted) {
          console.log(`   Transaction #${i + 1}:`);
          console.log('   ├─ Hash:', formatted.hash);
          console.log(
            '   ├─ Block:',
            helpers.formatNumberWithCommas(formatted.blockNumber)
          );
          console.log('   ├─ From:', formatted.from, `(${formatted.fromFull})`);
          console.log('   ├─ To:', formatted.to, `(${formatted.toFull})`);
          console.log('   ├─ Value:', formatted.value, 'ETH');
          console.log(
            '   ├─ Gas Used:',
            helpers.formatNumberWithCommas(formatted.gasUsed)
          );
          console.log('   └─ Status:', formatted.status);
          console.log('');
        }
      }

      return latestTxHashes;
    }, 'Fetch Latest Transactions');
  }

  /**
   * Gets all contract data in a single object
   * Useful for API responses
   */
  async getAllData() {
    const data = {
      contractInfo: this.contractInfo,
      network: config.NETWORK_CONFIG.name,
      contractAddress: config.CONTRACT_CONFIG.address,
      timestamp: new Date().toISOString()
    };

    return data;
  }
}

// Export the class so it can be used by other modules
module.exports = USDTContractService;

// If this file is run directly (not imported), create an instance and run it
// This allows you to test the module by running: node index.js
if (require.main === module) {
  console.log('🎯 Running USDT Contract Service directly...\n');
  new USDTContractService();
}
