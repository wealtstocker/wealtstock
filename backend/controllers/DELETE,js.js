
// export const updateTrade = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   try {
//     const [tradeRows] = await pool.query("SELECT * FROM trades WHERE id = ? AND is_active = TRUE", [id]);
//     if (tradeRows.length === 0) return res.status(404).json({ message: "Trade not found" });

//     const oldTrade = tradeRows[0];
//     const isAdmin = updates.created_by === "admin";
//     const shouldSyncWallet = updates.status === "approved" && isAdmin;

//     // 1. Recalculate values
//     const buyValue = parseFloat(updates.buy_price) * parseFloat(updates.buy_quantity);
//     const exitValue = parseFloat(updates.exit_price) * parseFloat(updates.exit_quantity);
//     const brokerage = parseFloat(updates.brokerage || 0);
//     const rawProfitLossValue = exitValue - buyValue;
//     const netProfitLossValue = rawProfitLossValue - brokerage;
//     const profitLoss = netProfitLossValue >= 0 ? "profit" : "loss";
//     const profitLossValue = Math.abs(netProfitLossValue).toFixed(2);

//     updates.buy_value = buyValue;
//     updates.exit_value = exitValue;
//     updates.profit_loss = profitLoss;
//     updates.profit_loss_value = profitLossValue;

//     // 2. Wallet balance check for updated loss
//     if (isAdmin && profitLoss === "loss" && updates.status === "approved") {
//       const [walletRows] = await pool.query(`
//         SELECT balance FROM wallets
//         WHERE customer_id = ?
//         ORDER BY id DESC LIMIT 1
//       `, [oldTrade.customer_id]);

//       const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;

//       // Fetch previous transaction to rollback
//       const [prevTxnRows] = await pool.query(`
//         SELECT t.*, w.balance AS wallet_balance
//         FROM transactions t
//         LEFT JOIN wallets w ON w.transaction_id = t.id
//         WHERE t.description LIKE ? AND t.customer_id = ?
//       `, [`%Trade No: ${oldTrade.trade_number}%`, oldTrade.customer_id]);

//       let reversedAmount = 0;
//       if (prevTxnRows.length > 0) {
//         const prevTxn = prevTxnRows[0];
//         reversedAmount = parseFloat(prevTxn.amount);
//         if (prevTxn.type === "credit") {
//           // Remove credit to simulate rollback
//           if (currentBalance - reversedAmount < profitLossValue) {
//             return res.status(400).json({
//               message: "Insufficient balance to update trade as loss",
//               currentBalance,
//               required: profitLossValue + reversedAmount,
//             });
//           }
//         } else {
//           // Already deducted, just check available
//           if (currentBalance < profitLossValue) {
//             return res.status(400).json({
//               message: "Insufficient balance to update trade as loss",
//               currentBalance,
//               required: profitLossValue,
//             });
//           }
//         }
//       }
//     }

//     // 3. Update trade record
//     await pool.query("UPDATE trades SET ? WHERE id = ? AND is_active = TRUE", [updates, id]);

//     // 4. Wallet & Transaction Update (Rollback and Apply New)
//     if (shouldSyncWallet) {
//       const txnType = profitLoss === "profit" ? "credit" : "debit";
//       const txnAmount = parseFloat(profitLossValue);
//       const newDescription = `Trade ${txnType} for Trade No: ${updates.trade_number}`;

//       const [txnRows] = await pool.query(
//         "SELECT id, amount, type FROM transactions WHERE description LIKE ? AND customer_id = ?",
//         [`%Trade No: ${oldTrade.trade_number}%`, oldTrade.customer_id]
//       );

//       if (txnRows.length > 0) {
//         const txnId = txnRows[0].id;
//         const prevTxnAmount = parseFloat(txnRows[0].amount);
//         const prevTxnType = txnRows[0].type;

//         const [walletRows] = await pool.query(
//           "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
//           [oldTrade.customer_id]
//         );

//         const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;

//         // Reverse previous transaction
//         let intermediateBalance = prevTxnType === "credit"
//           ? currentBalance - prevTxnAmount
//           : currentBalance + prevTxnAmount;

//         // Update the transaction
//         await pool.query(
//           `UPDATE transactions SET type = ?, amount = ?, description = ? WHERE id = ?`,
//           [txnType, txnAmount, newDescription, txnId]
//         );

//         // Update wallet
//         const updatedBalance = txnType === "credit"
//           ? intermediateBalance + txnAmount
//           : intermediateBalance - txnAmount;

//         await pool.query(
//           `UPDATE wallets SET amount = ?, type = ?, balance = ? WHERE transaction_id = ?`,
//           [txnAmount, txnType, updatedBalance, txnId]
//         );

//       } else {
//         // No previous transaction exists — Create new one
//         const [txnResult] = await pool.query(
//           `INSERT INTO transactions (customer_id, type, status, amount, description)
//            VALUES (?, ?, 'completed', ?, ?)`,
//           [
//             oldTrade.customer_id,
//             txnType,
//             txnAmount,
//             newDescription
//           ]
//         );

//         const transactionId = txnResult.insertId;

//         const [walletRows] = await pool.query(
//           "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
//           [oldTrade.customer_id]
//         );

//         const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
//         const newBalance = txnType === "credit"
//           ? lastBalance + txnAmount
//           : lastBalance - txnAmount;

//         await pool.query(
//           `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
//            VALUES (?, ?, ?, ?, ?)`,
//           [
//             oldTrade.customer_id,
//             txnAmount,
//             txnType,
//             newBalance,
//             transactionId
//           ]
//         );
//       }
//     }

//     res.json({ message: "Trade updated successfully" });

//   } catch (error) {
//     console.error("Error in updateTrade:", error);
//     res.status(500).json({ message: "Failed to update trade" });
//   }
// };




// ✅ DELETE 


