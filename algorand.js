import algosdk from "algosdk";

// Convert mnemonic (25-word recovery phrase) into account object
export function getAccountFromMnemonic(mnemonic) {
  return algosdk.mnemonicToSecretKey(mnemonic);
}

// Send ALGO from one account to another (escrow funding)
export async function sendAlgo(sender, receiver, amount, sk) {
  const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: receiver,
    amount: Math.round(amount * 1e6), // convert ALGO → microAlgos
    suggestedParams: params,
  });

  const signedTxn = txn.signTxn(sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  return txId;
}

// Release bounty (escrow → worker payout)
export async function releaseBounty(sender, receiver, amount, sk) {
  const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: receiver,
    amount: Math.round(amount * 1e6),
    suggestedParams: params,
  });

  const signedTxn = txn.signTxn(sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  return txId;
}