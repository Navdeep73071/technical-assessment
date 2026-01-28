// Sepolia Testnet Configuration
const NETWORK_CONFIG = {
  name: 'sepolia',
  chainId: 11155111,
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
};

// USDT Contract on Sepolia Testnet
const CONTRACT_CONFIG = {
  // USDT contract address on Sepolia testnet
  address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',

  // This ABI covers: balanceOf, transfer, approve, allowance, totalSupply, name, symbol, decimals
  abi: [
    // Read-only functions (view/pure)
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',

    // Events we want to monitor
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)'
  ]
};

// Query Configuration
const QUERY_CONFIG = {
  maxEvents: 5,
  maxTransactions: 5,
  blockLookback: 10000
};

// Sample addresses for testing read operations
const SAMPLE_ADDRESSES = {
  nullAddress: '0x0000000000000000000000000000000000000000',
  exampleWallet: '0x0aB442ADf62723cF7A7C8C518Fc211b1134A0B67'
};

module.exports = {
  NETWORK_CONFIG,
  CONTRACT_CONFIG,
  QUERY_CONFIG,
  SAMPLE_ADDRESSES
};
