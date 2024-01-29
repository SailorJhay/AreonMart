require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  solidity: { version: "0.8.19" },
  networks: {
    testnet: {
      url: `https://testnet-rpc.areon.network`,
      accounts: [`0x${privateKey}`],
    },
    ganache: {
      url: `http://127.0.0.1:7545`,
    },
  },
  customChains: [
    {
      name: "areon-testnet",
      chainId: 2021,
      shortName: "areon",
      chain: "AREON",
      networkId: 2021,
      network: "testnet",
      nativeCurrency: {
        name: "AREON",
        symbol: "AREON",
        decimals: 18,
      },
      rpc: ["https://testnet-rpc.areon.network"],
      faucets: [],
      explorers: [],
    },
  ]
};
