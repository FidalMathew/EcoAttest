import dotenv from "dotenv";
import {
  Hbar,
  Client,
  AccountId,
  TokenType,
  PrivateKey,
  AccountBalanceQuery,
  FileCreateTransaction,
  TokenCreateTransaction,
  ContractCreateTransaction,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  AccountCreateTransaction,
  AccountAllowanceApproveTransaction,
  TokenAssociateTransaction,
} from "@hashgraph/sdk";
import htsContract from "./HTS.json" assert { type: "json" };

dotenv.config();

async function htsContractFunction() {
  // console.log(process.env.MY_ACCOUNT_ID, accountKeyTest);
  // Grab your Hedera testnet account ID and private key from your .env file
  const accountIdTest = AccountId.fromString(process.env.ACCOUNT_ID);
  const accountKeyTest = PrivateKey.fromString(process.env.ACCOUNT_PRIVATE_KEY);

  // If we weren't able to grab it, we should throw a new error
  if (!accountIdTest || !accountKeyTest) {
    throw new Error(
      "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
    );
  }

  const client = Client.forTestnet();
  client.setOperator(accountIdTest, accountKeyTest);

  // Get the contract bytecode
  const bytecode = htsContract.data.bytecode.object;

  // Treasury Key
  const treasuryKey = PrivateKey.generateED25519();

  // Create token treasury account
  const treasuryAccount = new AccountCreateTransaction()
    .setKey(treasuryKey)
    .setInitialBalance(new Hbar(5))
    .setAccountMemo("treasury account");

  // Submit the transaction to a Hedera network
  const submitAccountCreateTx = await treasuryAccount.execute(client);

  // Get the receipt of the transaction
  const newAccountReceipt = await submitAccountCreateTx.getReceipt(client);

  // Get the account ID from the receipt
  const treasuryAccountId = newAccountReceipt.accountId;

  console.log("The new account ID is " + treasuryAccountId);

  // Create a token to interact with
  const createToken = new TokenCreateTransaction()
    .setTokenName("HTS demo")
    .setTokenSymbol("H")
    .setTokenType(TokenType.FungibleCommon)
    .setTreasuryAccountId(treasuryAccountId)
    .setInitialSupply(500);

  // Sign with the treasury key
  const signTokenTx = await createToken.freezeWith(client).sign(treasuryKey);

  // Submit the transaction to a Hedera network
  const submitTokenTx = await signTokenTx.execute(client);

  // Get the token ID from the receipt
  const tokenId = (await submitTokenTx.getReceipt(client)).tokenId;

  // Log the token ID
  console.log("The new token ID is " + tokenId);

  // Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction().setContents(bytecode);

  // Submit the file to the Hedera test network
  const submitTx = await fileCreateTx.execute(client);

  // Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  // Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  // Log the file ID
  console.log("The smart contract bytecode file ID is " + bytecodeFileId);

  // Deploy the contract instance
  const contractTx = await new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(2000000);

  // Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client);

  // Get the receipt of the contract creation transaction
  const contractReceipt = await contractResponse.getReceipt(client);

  // Get the smart contract ID
  const newContractId = contractReceipt.contractId;

  // Log the smart contract ID
  console.log("The smart contract ID is " + newContractId);

  // Associate the token to an account using the SDK
  const transaction = new TokenAssociateTransaction()
    .setAccountId(accountIdTest)
    .setTokenIds([tokenId])
    .freezeWith(client);

  // Sign the transaction with the client
  const signTx = await transaction.sign(accountKeyTest);

  // Submit the transaction
  const submitAssociateTx = await signTx.execute(client);

  // Get the receipt
  const txReceipt = await submitAssociateTx.getReceipt(client);

  // Get transaction status
  const txStatus = txReceipt.status;

  console.log("The associate transaction was " + txStatus.toString());

  // Approve the token allowance
  const transactionAllowance = new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(tokenId, treasuryAccountId, newContractId, 5)
    .freezeWith(client);

  // Sign the transaction with the owner account key
  const signTxAllowance = await transactionAllowance.sign(treasuryKey);

  // Sign the transaction with the client operator private key and submit to a Hedera network
  const txResponseAllowance = await signTxAllowance.execute(client);

  // Request the receipt of the transaction
  const receiptAllowance = await txResponseAllowance.getReceipt(client);

  // Get the transaction consensus status
  const transactionStatusAllowance = receiptAllowance.status;

  console.log(
    "The transaction consensus status for the allowance function is " +
      transactionStatusAllowance.toString()
  );

  // Transfer the new token to the account
  const tokenTransfer = new ContractExecuteTransaction()
    .setContractId(newContractId)
    .setGas(2000000)
    .setFunction(
      "tokenTransfer",
      new ContractFunctionParameters()
        .addAddress(tokenId.toSolidityAddress())
        .addAddress(treasuryAccountId.toSolidityAddress())
        .addAddress(accountIdTest.toSolidityAddress())
        .addInt64(5)
    );

  // Sign the token transfer transaction with the treasury account to authorize the transfer and submit
  const signTokenTransfer = await tokenTransfer
    .freezeWith(client)
    .sign(treasuryKey);

  // Submit transfer transaction
  const submitTransfer = await signTokenTransfer.execute(client);

  // Get transaction status
  const transferTxStatus = (await submitTransfer.getReceipt(client)).status;

  // Get the transaction status
  console.log("The transfer transaction status " + transferTxStatus.toString());

  // Verify your account received the tokens
  const newAccountBalance = await new AccountBalanceQuery()
    .setAccountId(accountIdTest)
    .execute(client);

  console.log(
    "My new account balance is " + newAccountBalance.tokens.toString()
  );
}

// Call the function
void htsContractFunction();
