require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_NETWORK,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
