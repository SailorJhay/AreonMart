require('@nomiclabs/hardhat-ethers');

module.exports = {
  // ... other configurations

  paths: {
    artifacts: './artifacts',
  },

  networks: {

  },

  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
