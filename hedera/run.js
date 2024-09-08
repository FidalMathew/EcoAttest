import HTS from "./HTS.json" assert { type: "json" };
import {
  FileCreateTransaction,
  Client,
  PrivateKey,
  AccountId,
} from "@hashgraph/sdk"; // Ensure to import the necessary classes
import dotenv from "dotenv";

async function main() {
  // Get the contract bytecode
  const bytecode = HTS.data.bytecode.object;
  dotenv.config();
  // Create a Hedera client instance (make sure to replace with your actual client setup)
  dotenv.config();
  if (!process.env.ACCOUNT_ID || !process.env.ACCOUNT_PRIVATE_KEY) {
    throw new Error("Please set required keys in .env file.");
  }
  // const operatorId = process.env.ACCOUNT_ID;
  // const operatorKey = process.env.ACCOUNT_PRIVATE_KEY;

  console.log(process.env.ACCOUNT_ID, process.env.ACCOUNT_PRIVATE_KEY);

  // Configure client using environment variables
  const accountId = AccountId.fromString(process.env.ACCOUNT_ID);
  const accountKey = PrivateKey.fromStringECDSA(
    process.env.ACCOUNT_PRIVATE_KEY
  );
  const client = Client.forTestnet().setOperator(accountId, accountKey);

  // Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction().setContents(bytecode);

  // Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
  const submitTx = await fileCreateTx.execute(client);

  // Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  // Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  // Log the file ID
  console.log("The smart contract bytecode file ID is " + bytecodeFileId);
}

main();

export default main;
