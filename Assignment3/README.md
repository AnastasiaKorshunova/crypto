# Assignment 3 — Wallet, Chains, Transactions, Gas, Nonce

Target blockchain (from the ETH.Build sketch): **Cronos Mainnet** → all work done on **Cronos Testnet** (Chain ID 338, currency TCRO).

## Summary

| Part | Answer |
|------|--------|
| 1. Wallet | `0x71f39e36951d4e28531e5b218c8ebf20bd8b2801` |
| 2. Chains | [Incoming faucet transaction](https://explorer.cronos.com/testnet/tx/0x6006a180e3ec76b46a5af164451b138ed203f667fa01e8f6f4de40bff9d936db) |
| 3. Transactions | [Transfer Account 1 → Account 2](https://explorer.cronos.com/testnet/tx/0x6855e383650f8c543064c64ea7e3f46f844b877158bedea030e373130f0ecb06) |
| 4. Gas | Mainnet Gas Tracker: <https://www.quicknode.com/gas-tracker/cronos> (no testnet gas tracker found) |
| 5. Nonce | A (nonce 5): failed, rejected before reaching the network, no transaction hash · B (nonce 4): [transaction](https://explorer.cronos.com/testnet/tx/0xb834108639ae3a3387aeb437c83d67c79c6ef298d70f59f0d82762bbfece592b) |

---

## 1. Wallet

MetaMask account (Account 1): `0x71f39e36951d4e28531e5b218c8ebf20bd8b2801`

The ETH.Build sketch derives the private key, public key and address from the Secret Recovery Phrase. The resulting address matches the MetaMask account. (The phrase and the private key are hidden on the screenshot.)

![ETH.Build: mnemonic → key pair → address](screenshots/01-ethbuild-mnemonic-to-address.png)

## 2. Chains

The second ETH.Build sketch maps my address to **Cronos Mainnet**, so I used its testnet, **Cronos Testnet** (Chain ID 338).

![ETH.Build: target chain](screenshots/02-ethbuild-target-chain.png)

I added Cronos Testnet to MetaMask via chainlist.org:

![Chainlist: Cronos Testnet](screenshots/02-chainlist-cronos-testnet.png)

Then I requested 50 TCRO from the official faucet (<https://faucet.cronos.com>):

![Faucet](screenshots/02-faucet-success.png)

Incoming transaction: <https://explorer.cronos.com/testnet/tx/0x6006a180e3ec76b46a5af164451b138ed203f667fa01e8f6f4de40bff9d936db>

![Faucet transaction on the explorer](screenshots/02-faucet-tx-explorer.png)

## 3. Transactions

Accounts before reinstalling MetaMask:

- Account 1: `0x71f39e36951d4e28531e5b218c8ebf20bd8b2801`
- Account 2: `0xB90919949f72DE7F620BEea839D3E65ddD356e1A`

![Account 2 created](screenshots/03-account2-created.png)

After uninstalling and reinstalling MetaMask, I restored the wallet from the saved Secret Recovery Phrase. Both account addresses are the same as before:

![Accounts restored](screenshots/03-accounts-restored.png)

I first connected Cronos Testnet via chainlist.org, but the suggested third-party RPC did not respond. After reinstalling MetaMask, I added the network manually with the official Cronos RPC (`https://evm-t3.cronos.org`, Chain ID 338, TCRO).

Transfer of 1 TCRO from Account 1 to Account 2. The data in MetaMask (from, to, amount, network fee ≈ 0.0081 TCRO) matches the explorer (fee 0.00811 TCRO, gas price 386.25 Gwei, gas used 21,000, nonce 0).

Transaction: <https://explorer.cronos.com/testnet/tx/0x6855e383650f8c543064c64ea7e3f46f844b877158bedea030e373130f0ecb06>

![Transfer details in MetaMask](screenshots/03-transfer-details.png)

## 4. Gas

For Cronos Testnet, MetaMask only offers "Network suggested" (Market) and "Advanced"; Low and Aggressive options are not available.

![Fee options](screenshots/04-fee-options.png)

Market values: max base fee 386.25 Gwei, priority fee 386.25 Gwei, gas limit 21,000.

![Market fee](screenshots/04-market-fee.png)

**Zero / near-zero fee.** MetaMask does not allow a zero network fee: both fields show an error ("Max base fee must be greater than 0", "Priority fee must be greater than 0").

![Zero fee not allowed](screenshots/04-zero-fee-not-allowed.png)

So I set the minimum possible values instead: 0.000001 Gwei for both the max base fee and the priority fee (gas limit 21,000). The transaction failed immediately and was not included in a block. My balance stayed at 98.992 TCRO, so no fee was charged.

![Near-zero fee failed](screenshots/04-near-zero-failed.png)

The near-zero fee transaction was rejected before it reached the network (no transaction ID), so MetaMask offered no Retry button:

![No Retry](screenshots/04-near-zero-no-retry.png)

**1/2 and 1/10 of Market.** When I set the priority fee to 1/2 of Market (193.13 Gwei) but left the max fee at 386.25 Gwei, the transaction was still confirmed and charged at 386.25 Gwei: <https://explorer.cronos.com/testnet/tx/0x9765aa018054d7b0e9f47c361d5581bf03f15e03cf52b38cf91d3b23a5a86320>

![Half priority fee on the explorer](screenshots/04-half-priority-explorer.png)

When I lowered the max fee itself to 1/2 or 1/10 of Market (193.13 or 38.63 Gwei), the transaction failed immediately:

![Max fee below base fee failed](screenshots/04-max-fee-below-base-failed.png)

**Minimum price.** The base fee on Cronos Testnet is 375 Gwei, close to the Market price (386.25 Gwei), and it is the lowest gas price the network accepts. With max fee 375 Gwei and priority fee 0.0001 Gwei, the transaction was confirmed at 375 Gwei with a fee of 0.007875 TCRO, compared to 0.0081 TCRO at the Market price. Unlike the assignment's example, this testnet does not process underpriced transactions later: anything below the base fee is rejected at once.

Transaction: <https://explorer.cronos.com/testnet/tx/0xb3dc4ee66725e241dfb0fa73e5c831f2feb827a3db2d2de57d7fa6451314bcdc>

![Max fee 375 Gwei](screenshots/04-min-fee-375.png)
![375 Gwei transaction confirmed](screenshots/04-min-fee-375-confirmed.png)

**Gas Tracker.** Cronos Mainnet gas prices on Quicknode: Slow 378.75, Average 416.63, Fast 454.5 Gwei. These are the base fee (375 Gwei) plus a priority tip. No separate gas tracker exists for Cronos Testnet.

Mainnet Gas Tracker: <https://www.quicknode.com/gas-tracker/cronos>

![Gas Tracker](screenshots/04-gas-tracker.png)

## 5. Nonce

MetaMask suggested nonce 4 for the next transaction. For transaction A I increased it to 5:

![Edit nonce](screenshots/05-edit-nonce.png)

On Ethereum, transaction A would stay pending until the gap is filled. On Cronos Testnet it **failed immediately** and was never included in a block, so it has no explorer link. Cronos nodes appear to reject transactions whose nonce is not the next expected one instead of keeping them in a queue.

![Transaction A failed](screenshots/05-tx-a-failed.png)
![Transaction A details](screenshots/05-tx-a-details.png)

Then I sent transaction B (0.2 TCRO) with the default nonce 4, and it was confirmed: <https://explorer.cronos.com/testnet/tx/0xb834108639ae3a3387aeb437c83d67c79c6ef298d70f59f0d82762bbfece592b>

The explorer shows "Nonce: 4" for transaction B:

![Transaction B details](screenshots/05-tx-b-details.png)

After that, the account's next nonce was 5, which shows that transaction A was not kept in a queue and was not executed.

![Activity](screenshots/05-activity.png)

This MetaMask version has no separate "Activity log" section in transaction details, so I attached screenshots of the transaction details instead.
