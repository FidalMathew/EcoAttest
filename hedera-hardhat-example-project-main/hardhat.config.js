require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
// Import dotenv module to access variables stored in the .env file
require("dotenv").config();

// Define Hardhat tasks here, which can be accessed in our test file (test/rpc.js) by using hre.run('taskName')
task("show-balance", async () => {
  const showBalance = require("./scripts/showBalance");
  return showBalance();
});

task("deploy-contract", async () => {
  const deployContract = require("./scripts/deployContract");
  return deployContract();
});

task("contract-view-call", async (taskArgs) => {
  const contractViewCall = require("./scripts/contractViewCall");
  return contractViewCall(taskArgs.contractAddress);
});

task("contract-call", async (taskArgs) => {
  const contractCall = require("./scripts/contractCall");
  return contractCall(taskArgs.contractAddress, taskArgs.msg);
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  mocha: {
    timeout: 3600000,
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 500,
      },
    },
  },
  // This specifies network configurations used when running Hardhat tasks
  defaultNetwork: "testnet",
  networks: {
    // local: {
    //   // Your Hedera Local Node address pulled from the .env file
    //   url: process.env.LOCAL_NODE_ENDPOINT,
    //   // Your local node operator private key pulled from the .env file
    //   accounts: [process.env.LOCAL_NODE_OPERATOR_PRIVATE_KEY],
    // },
    testnet: {
      // HashIO testnet endpoint from the TESTNET_ENDPOINT variable in the .env file
      url: process.env.TESTNET_ENDPOINT,
      // Your ECDSA account private key pulled from the .env file
      accounts: [process.env.TESTNET_OPERATOR_PRIVATE_KEY],
    },

    /**
     * Uncomment the following to add a mainnet network configuration
     */
    //   mainnet: {
    //     // HashIO mainnet endpoint from the MAINNET_ENDPOINT variable in the .env file
    //     url: process.env.MAINNET_ENDPOINT,
    //     // Your ECDSA account private key pulled from the .env file
    //     accounts: [process.env.MAINNET_OPERATOR_PRIVATE_KEY],
    // },

    /**
     * Uncomment the following to add a previewnet network configuration
     */
    //   previewnet: {
    //     // HashIO previewnet endpoint from the PREVIEWNET_ENDPOINT variable in the .env file
    //     url: process.env.PREVIEWNET_ENDPOINT,
    //     // Your ECDSA account private key pulled from the .env file
    //     accounts: [process.env.PREVIEWNET_OPERATOR_PRIVATE_KEY],
    // },
  },
};
