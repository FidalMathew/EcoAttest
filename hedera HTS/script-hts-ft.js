import {
  Client,
  AccountId,
  PrivateKey,
  TokenType,
  TokenCreateTransaction,
  AccountBalanceQuery,
} from "@hashgraph/sdk";
import dotenv from "dotenv";

async function main() {
  // Ensure required environment variables are available
  dotenv.config();
  if (!process.env.ACCOUNT_ID || !process.env.ACCOUNT_PRIVATE_KEY) {
    throw new Error("Please set required keys in .env file.");
  }

  // Configure client using environment variables
  const accountId = AccountId.fromString(process.env.ACCOUNT_ID);
  const accountKey = PrivateKey.fromStringECDSA(
    process.env.ACCOUNT_PRIVATE_KEY
  );
  const client = Client.forTestnet().setOperator(accountId, accountKey);

  // Create the token
  let tokenCreateTx = await new TokenCreateTransaction()
    // NOTE: Configure HTS token to be created
    // Step (1) in the accompanying tutorial
    .setTokenType(TokenType.FungibleCommon)
    .setTokenName("Carbon Coin")
    .setTokenSymbol("CGC")
    .setDecimals(2)
    .setInitialSupply(1_000_000)
    .setTreasuryAccountId(accountId)
    .setAdminKey(accountKey)
    .setFreezeDefault(false)
    .freezeWith(client);
  const tokenCreateTxSigned = await tokenCreateTx.sign(accountKey);
  const tokenCreateTxSubmitted = await tokenCreateTxSigned.execute(client);
  const tokenCreateTxReceipt = await tokenCreateTxSubmitted.getReceipt(client);
  const tokenId = tokenCreateTxReceipt.tokenId;
  console.log(tokenId);
  const tokenExplorerUrl = `https://hashscan.io/testnet/token/${tokenId}`;

  console.log(tokenExplorerUrl);

  // Query token balance of acount (mirror node)
  // need to wait 3 seconds for the record files to be ingested by the mirror nodes
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // NOTE: Mirror Node API to query specified token balance
  // Step (2) in the accompanying tutorial
  const accountBalanceFetchApiUrl = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/tokens?token.id=${tokenId}&limit=1&order=desc`;
  const accountBalanceFetch = await fetch(accountBalanceFetchApiUrl);
  const accountBalanceJson = await accountBalanceFetch.json();
  const accountBalanceToken = accountBalanceJson?.tokens[0]?.balance;

  client.close();

  // output results
  console.log(`accountId: ${accountId}`);
  console.log(`tokenId: ${tokenId}`);
  console.log(`tokenExplorerUrl: ${tokenExplorerUrl}`);
  console.log(`accountTokenBalance: ${accountBalanceToken}`);
  console.log(`accountBalanceFetchApiUrl: ${accountBalanceFetchApiUrl}`);

  return {
    accountId,
    tokenId,
    tokenExplorerUrl,
    accountBalanceToken,
    accountBalanceFetchApiUrl,
  };
}

main();

export default main;
