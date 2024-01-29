require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });


const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: API_KEY,
      accounts: [PRIVATE_KEY],
    },
  },

};