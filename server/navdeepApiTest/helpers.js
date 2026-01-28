const { ethers } = require('ethers');

/**
 * Formats a blockchain address to a more readable short format
 * Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb -> 0x742d...f0bEb
 *
 * @param {string} address - The full Ethereum address
 * @returns {string} Shortened address for display
 */
function formatAddress(address) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

/**
 * Converts Wei (smallest unit) to a human-readable token amount
 * Takes into account the token's decimal places
 *
 * @param {BigNumber|string} weiAmount - Amount in Wei
 * @param {number} decimals - Number of decimal places (usually 18 for most tokens, 6 for USDT)
 * @returns {string} Formatted amount with proper decimals
 */
function formatTokenAmount(weiAmount, decimals = 18) {
  try {
    // Convert the Wei amount to a readable number with proper decimal places
    return ethers.formatUnits(weiAmount, decimals);
  } catch (error) {
    console.error('❌ Error formatting token amount:', error.message);
    return '0';
  }
}

/**
 * Formats a transaction event into a clean, readable object
 * Extracts the important information and makes it easy to understand
 *
 * @param {Object} event - Raw event object from ethers.js
 * @param {number} decimals - Token decimals for amount formatting
 * @returns {Object} Formatted event data
 */
function formatEvent(event, decimals = 18) {
  try {
    return {
      // Which block this event occurred in (helps track when it happened)
      blockNumber: event.blockNumber,

      // Unique identifier for the transaction that triggered this event
      transactionHash: event.transactionHash,

      // Who sent the tokens (shortened for readability)
      from: formatAddress(event.args.from),
      fromFull: event.args.from,

      // Who received the tokens (shortened for readability)
      to: formatAddress(event.args.to),
      toFull: event.args.to,

      // How many tokens were transferred (in human-readable format)
      amount: formatTokenAmount(event.args.value, decimals),
      amountRaw: event.args.value.toString(),

      // Event name for clarity
      eventName: event.eventName || 'Transfer'
    };
  } catch (error) {
    console.error('❌ Error formatting event:', error.message);
    return null;
  }
}

/**
 * Formats transaction data into a clean, readable object
 * Extracts key information from blockchain transactions
 *
 * @param {Object} tx - Raw transaction object
 * @param {Object} receipt - Transaction receipt (optional, contains more details)
 * @returns {Object} Formatted transaction data
 */
function formatTransaction(tx, receipt = null) {
  try {
    return {
      // Unique transaction identifier
      hash: tx.hash,

      // Who initiated this transaction
      from: formatAddress(tx.from),
      fromFull: tx.from,

      // Where the transaction was sent (contract or wallet)
      to: formatAddress(tx.to),
      toFull: tx.to,

      // How much ETH was sent with the transaction (usually 0 for token transfers)
      value: ethers.formatEther(tx.value),

      // Which block included this transaction
      blockNumber: tx.blockNumber,

      // How much gas was used (if receipt is available)
      gasUsed: receipt ? receipt.gasUsed.toString() : 'N/A',

      // Whether the transaction succeeded or failed
      status: receipt
        ? receipt.status === 1
          ? 'Success'
          : 'Failed'
        : 'Unknown'
    };
  } catch (error) {
    console.error('❌ Error formatting transaction:', error.message);
    return null;
  }
}

/**
 * Safely executes an async function and handles any errors gracefully
 * This prevents the entire application from crashing if one operation fails
 *
 * @param {Function} asyncFn - The async function to execute
 * @param {string} operationName - Name of the operation (for error messages)
 * @returns {Promise<any>} Result of the function or null if error
 */
async function safeExecute(asyncFn, operationName = 'Operation') {
  try {
    console.log(`\n🔄 Starting: ${operationName}...`);
    const result = await asyncFn();
    console.log(`✅ Completed: ${operationName}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed: ${operationName}`);
    console.error(`   Error: ${error.message}`);
    return null;
  }
}

/**
 * Formats a timestamp to a human-readable date string
 *
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Validates if a string is a valid Ethereum address
 *
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
}

/**
 * Formats a large number with commas for better readability
 * Example: 1000000 -> 1,000,000
 *
 * @param {string|number} num - Number to format
 * @returns {string} Formatted number with commas
 */
function formatNumberWithCommas(num) {
  try {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    return num;
  }
}

/**
 * Creates a beautiful console separator for better log readability
 *
 * @param {string} title - Title to display in the separator
 */
function logSeparator(title = '') {
  const line = '='.repeat(80);
  if (title) {
    console.log(`\n${line}`);
    console.log(`  ${title}`);
    console.log(line);
  } else {
    console.log(line);
  }
}

module.exports = {
  formatAddress,
  formatTokenAmount,
  formatEvent,
  formatTransaction,
  safeExecute,
  formatTimestamp,
  isValidAddress,
  formatNumberWithCommas,
  logSeparator
};
