/*-
 *
 * Hedera Hardhat Example Project
 *
 * Copyright (C) 2023 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const { ethers } = require("hardhat");

module.exports = async () => {
  //Assign the first signer, which comes from the first privateKey from our configuration in hardhat.config.js, to a wallet variable.
  let wallet = (await ethers.getSigners())[0];

  //Initialize a contract factory object
  //name of contract as first parameter
  //wallet/signer used for signing the contract calls/transactions with this contract
  const EcoAttest = await ethers.getContractFactory("EcoAttest", wallet);
  //Using already initialized contract factory object with our contract, we can invoke deploy function to deploy the contract.
  //Accepts constructor parameters from our contract
  const ecoAttest = await EcoAttest.deploy();
  //We use wait to receive the transaction (deployment) receipt, which contains contractAddress
  const contractAddress = (await ecoAttest.deployTransaction.wait())
    .contractAddress;

  console.log(`ecoAttest deployed to: ${contractAddress}`);

  return contractAddress;
};

// const deployContract = async () => {
//   //Assign the first signer, which comes from the first privateKey from our configuration in hardhat.config.js, to a wallet variable.
//   let wallet = (await ethers.getSigners())[0];

//   //Initialize a contract factory object
//   //name of contract as first parameter
//   //wallet/signer used for signing the contract calls/transactions with this contract
//   const EcoAttest = await ethers.getContractFactory("EcoAttest", wallet);
//   //Using already initialized contract factory object with our contract, we can invoke deploy function to deploy the contract.
//   //Accepts constructor parameters from our contract
//   const ecoAttest = await EcoAttest.deploy();
//   //We use wait to receive the transaction (deployment) receipt, which contains contractAddress
//   const contractAddress = (await ecoAttest.deployTransaction.wait())
//     .contractAddress;

//   console.log(`ecoAttest deployed to: ${contractAddress}`);
// };

// deployContract()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

// 0x5DaD32b3495dA900F1c52882f31c2788104d418f
