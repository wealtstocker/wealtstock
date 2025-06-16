import pool from "../config/db.js";




export const createTrade = async (req, res) => {
  const {
    customer_id,
    instrument,
    buy_price,
    buy_quantity,
    exit_price,
    exit_quantity,
    brokerage,
    created_by
  } = req.body;

  const isAdmin = created_by === "admin";
  const status = isAdmin ? "approved" : "requested";
  const [lastTrade] = await pool.query(`
  SELECT trade_number FROM trades
  ORDER BY id DESC LIMIT 1
`);

    let trade_number = "T-1001";
    if (lastTrade.length > 0) {
        const lastNumber = parseInt(lastTrade[0].trade_number?.split("-")[1] || "1000", 10);
        trade_number = `T-${lastNumber + 1}`;
    }
  try {
    // 1. Calculate trade values
    const buyValue = parseFloat(buy_price) * parseFloat(buy_quantity);
    const exitValue = parseFloat(exit_price) * parseFloat(exit_quantity);
    const rawProfitLossValue = exitValue - buyValue;
    const netProfitLossValue = rawProfitLossValue - parseFloat(brokerage || 0);
    const profitLossValue = Math.abs(netProfitLossValue).toFixed(2);
    const profitLoss = netProfitLossValue >= 0 ? "profit" : "loss";

    // 2. Wallet validation for admin creating a loss
    if (isAdmin && profitLoss === "loss") {
      const [walletRows] = await pool.query(`
        SELECT balance FROM wallets
        WHERE customer_id = ?
        ORDER BY id DESC LIMIT 1
      `, [customer_id]);

      const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
      if (currentBalance < profitLossValue) {
        return res.status(400).json({
          message: "Insufficient balance for loss trade",
          currentBalance,
          required: profitLossValue
        });
      }
    }

    // 3. Insert Trade
    const [result] = await pool.query(
      `INSERT INTO trades (
        customer_id, trade_number, instrument, buy_price, buy_quantity, buy_value,
        exit_price, exit_quantity, exit_value,
        profit_loss, profit_loss_value, brokerage,
        status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id, trade_number, instrument, buy_price, buy_quantity, buyValue,
        exit_price, exit_quantity, exitValue,
        profitLoss, profitLossValue, brokerage,
        status, created_by
      ]
    );

    const tradeId = result.insertId;

    // 4. Add wallet & transaction if approved
    if (isAdmin && status === "approved") {
      const txnType = profitLoss === "profit" ? "credit" : "debit";
      const txnDesc = `Trade ${txnType} for Trade No: ${trade_number}`;

      const [txnResult] = await pool.query(`
        INSERT INTO transactions (customer_id, type, status, amount, description)
        VALUES (?, ?, 'completed', ?, ?)
      `, [
        customer_id,
        txnType,
        profitLossValue,
        txnDesc
      ]);

      const transactionId = txnResult.insertId;

      const [walletRows] = await pool.query(`
        SELECT balance FROM wallets
        WHERE customer_id = ?
        ORDER BY id DESC LIMIT 1
      `, [customer_id]);

      const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
      const newBalance = txnType === "credit"
        ? lastBalance + parseFloat(profitLossValue)
        : lastBalance - parseFloat(profitLossValue);

      await pool.query(`
        INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
        VALUES (?, ?, ?, ?, ?)
      `, [
        customer_id,
        profitLossValue,
        txnType,
        newBalance,
        transactionId
      ]);
    }

    res.status(201).json({
      message: "Trade created successfully",
      id: tradeId,
      trade: {
        trade_number,
        buyValue,
        exitValue,
        grossProfitLoss: rawProfitLossValue.toFixed(2),
        brokerage: parseFloat(brokerage || 0).toFixed(2),
        netProfitLossValue: profitLossValue,
        profitLoss,
        status
      }
    });

  } catch (error) {
    console.error("Error in createTrade:", error);
    res.status(500).json({ message: "Trade creation failed" });
  }
};

// export const createTrade = async (req, res) => {
//   const {
//     customer_id,
//     instrument,
//     buy_price,
//     buy_quantity,
//     exit_price,
//     exit_quantity,
//     brokerage,
//     created_by
//   } = req.body;

//   const isAdmin = created_by === "admin";
//   const status = isAdmin ? "approved" : "requested";

//   try {
//     // 1. Generate trade number
//     const [lastTrade] = await pool.query(`SELECT trade_number FROM trades ORDER BY id DESC LIMIT 1`);
//     let trade_number = "T-1001";
//     if (lastTrade.length > 0) {
//       const lastNumber = parseInt(lastTrade[0].trade_number?.split("-")[1] || "1000", 10);
//       trade_number = `T-${lastNumber + 1}`;
//     }

//     // 2. Calculate values
//     const buyValue = parseFloat(buy_price) * parseFloat(buy_quantity);
//     const exitValue = parseFloat(exit_price) * parseFloat(exit_quantity);
//     const netProfitLossValue = exitValue - buyValue - parseFloat(brokerage || 0);
//     const profitLoss = netProfitLossValue >= 0 ? "profit" : "loss";
//     const profitLossValue = Math.abs(netProfitLossValue).toFixed(2);

//     // 3. Check balance before admin loss trade
//     if (isAdmin && profitLoss === "loss") {
//       const [walletRows] = await pool.query(`
//         SELECT balance FROM wallets
//         WHERE customer_id = ?
//         ORDER BY id DESC LIMIT 1
//       `, [customer_id]);

//       const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
//       if (currentBalance < profitLossValue) {
//         return res.status(400).json({
//           message: "Insufficient balance for loss trade",
//           currentBalance,
//           required: profitLossValue
//         });
//       }
//     }

//     // 4. Insert trade
//     const [result] = await pool.query(
//       `INSERT INTO trades (
//         customer_id, trade_number, instrument, buy_price, buy_quantity, buy_value,
//         exit_price, exit_quantity, exit_value,
//         profit_loss, profit_loss_value, brokerage,
//         status, created_by
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         customer_id, trade_number, instrument, buy_price, buy_quantity, buyValue,
//         exit_price, exit_quantity, exitValue,
//         profitLoss, profitLossValue, brokerage,
//         status, created_by
//       ]
//     );

//     const tradeId = result.insertId;

//     // 5. Add wallet and transaction
//     if (isAdmin && status === "approved") {
//       const txnType = profitLoss === "profit" ? "credit" : "debit";
//       const txnDesc = `Trade ${txnType} for Trade No: ${trade_number}`;

//       // 🔍 Check if transaction already exists for same trade (e.g., retry)
//       const [existingTxn] = await pool.query(
//         `SELECT id FROM transactions WHERE description = ? AND customer_id = ?`,
//         [txnDesc, customer_id]
//       );

//       if (existingTxn.length === 0) {
//         // No existing txn — proceed
//         const [txnResult] = await pool.query(`
//           INSERT INTO transactions (customer_id, type, status, amount, description)
//           VALUES (?, ?, 'completed', ?, ?)`,
//           [customer_id, txnType, profitLossValue, txnDesc]);

//         const transactionId = txnResult.insertId;

//         const [walletRows] = await pool.query(`
//           SELECT balance FROM wallets
//           WHERE customer_id = ?
//           ORDER BY id DESC LIMIT 1
//         `, [customer_id]);

//         const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
//         const newBalance = txnType === "credit"
//           ? lastBalance + parseFloat(profitLossValue)
//           : lastBalance - parseFloat(profitLossValue);

//         await pool.query(`
//           INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
//           VALUES (?, ?, ?, ?, ?)`,
//           [customer_id, profitLossValue, txnType, newBalance, transactionId]);
//       }
//     }

//     res.status(201).json({
//       message: "Trade created successfully",
//       id: tradeId,
//       trade: {
//         trade_number,
//         buyValue,
//         exitValue,
//         netProfitLossValue: profitLossValue,
//         brokerage: parseFloat(brokerage || 0).toFixed(2),
//         profitLoss,
//         status
//       }
//     });

//   } catch (error) {
//     console.error("Error in createTrade:", error);
//     res.status(500).json({ message: "Trade creation failed" });
//   }
// };


// ✅ GET All Trades


export const getAllTrades = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM trades WHERE is_active = TRUE ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch trades" });
    }
};

// ✅ GET Trade by ID
export const getTradeById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM trades WHERE id = ? AND is_active = TRUE", [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: "Trade not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error getting trade" });
    }
};


export const updateTrade = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [tradeRows] = await pool.query("SELECT * FROM trades WHERE id = ? AND is_active = TRUE", [id]);
    if (tradeRows.length === 0) return res.status(404).json({ message: "Trade not found" });

    const oldTrade = tradeRows[0];
    const isAdmin = updates.created_by === "admin";
    const shouldSyncWallet = updates.status === "approved" && isAdmin;

    // 1. Recalculate values
    const buyValue = parseFloat(updates.buy_price) * parseFloat(updates.buy_quantity);
    const exitValue = parseFloat(updates.exit_price) * parseFloat(updates.exit_quantity);
    const brokerage = parseFloat(updates.brokerage || 0);
    const rawProfitLossValue = exitValue - buyValue;
    const netProfitLossValue = rawProfitLossValue - brokerage;
    const profitLoss = netProfitLossValue >= 0 ? "profit" : "loss";
    const profitLossValue = Math.abs(netProfitLossValue).toFixed(2);

    updates.buy_value = buyValue;
    updates.exit_value = exitValue;
    updates.profit_loss = profitLoss;
    updates.profit_loss_value = profitLossValue;

    // 2. Wallet balance check for updated loss
    if (isAdmin && profitLoss === "loss" && updates.status === "approved") {
      const [walletRows] = await pool.query(`
        SELECT balance FROM wallets
        WHERE customer_id = ?
        ORDER BY id DESC LIMIT 1
      `, [oldTrade.customer_id]);

      const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;

      // Fetch previous transaction to rollback
      const [prevTxnRows] = await pool.query(`
        SELECT t.*, w.balance AS wallet_balance
        FROM transactions t
        LEFT JOIN wallets w ON w.transaction_id = t.id
        WHERE t.description LIKE ? AND t.customer_id = ?
      `, [`%Trade No: ${oldTrade.trade_number}%`, oldTrade.customer_id]);

      let reversedAmount = 0;
      if (prevTxnRows.length > 0) {
        const prevTxn = prevTxnRows[0];
        reversedAmount = parseFloat(prevTxn.amount);
        if (prevTxn.type === "credit") {
          // Remove credit to simulate rollback
          if (currentBalance - reversedAmount < profitLossValue) {
            return res.status(400).json({
              message: "Insufficient balance to update trade as loss",
              currentBalance,
              required: profitLossValue + reversedAmount,
            });
          }
        } else {
          // Already deducted, just check available
          if (currentBalance < profitLossValue) {
            return res.status(400).json({
              message: "Insufficient balance to update trade as loss",
              currentBalance,
              required: profitLossValue,
            });
          }
        }
      }
    }

    // 3. Update trade record
    await pool.query("UPDATE trades SET ? WHERE id = ? AND is_active = TRUE", [updates, id]);

    // 4. Wallet & Transaction Update (Rollback and Apply New)
    if (shouldSyncWallet) {
      const txnType = profitLoss === "profit" ? "credit" : "debit";
      const txnAmount = parseFloat(profitLossValue);
      const newDescription = `Trade ${txnType} for Trade No: ${updates.trade_number}`;

      const [txnRows] = await pool.query(
        "SELECT id, amount, type FROM transactions WHERE description LIKE ? AND customer_id = ?",
        [`%Trade No: ${oldTrade.trade_number}%`, oldTrade.customer_id]
      );

      if (txnRows.length > 0) {
        const txnId = txnRows[0].id;
        const prevTxnAmount = parseFloat(txnRows[0].amount);
        const prevTxnType = txnRows[0].type;

        const [walletRows] = await pool.query(
          "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
          [oldTrade.customer_id]
        );

        const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;

        // Reverse previous transaction
        let intermediateBalance = prevTxnType === "credit"
          ? currentBalance - prevTxnAmount
          : currentBalance + prevTxnAmount;

        // Update the transaction
        await pool.query(
          `UPDATE transactions SET type = ?, amount = ?, description = ? WHERE id = ?`,
          [txnType, txnAmount, newDescription, txnId]
        );

        // Update wallet
        const updatedBalance = txnType === "credit"
          ? intermediateBalance + txnAmount
          : intermediateBalance - txnAmount;

        await pool.query(
          `UPDATE wallets SET amount = ?, type = ?, balance = ? WHERE transaction_id = ?`,
          [txnAmount, txnType, updatedBalance, txnId]
        );

      } else {
        // No previous transaction exists — Create new one
        const [txnResult] = await pool.query(
          `INSERT INTO transactions (customer_id, type, status, amount, description)
           VALUES (?, ?, 'completed', ?, ?)`,
          [
            oldTrade.customer_id,
            txnType,
            txnAmount,
            newDescription
          ]
        );

        const transactionId = txnResult.insertId;

        const [walletRows] = await pool.query(
          "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
          [oldTrade.customer_id]
        );

        const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
        const newBalance = txnType === "credit"
          ? lastBalance + txnAmount
          : lastBalance - txnAmount;

        await pool.query(
          `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
           VALUES (?, ?, ?, ?, ?)`,
          [
            oldTrade.customer_id,
            txnAmount,
            txnType,
            newBalance,
            transactionId
          ]
        );
      }
    }

    res.json({ message: "Trade updated successfully" });

  } catch (error) {
    console.error("Error in updateTrade:", error);
    res.status(500).json({ message: "Failed to update trade" });
  }
};


// ✅ DELETE (Soft Delete)
export const deleteTrade = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get trade
    const [tradeRows] = await pool.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE`,
      [id]
    );
    if (tradeRows.length === 0) {
      return res.status(404).json({ message: "Trade not found or already inactive" });
    }

    const trade = tradeRows[0];
    const isAdmin = trade.created_by === "admin";
    const isApproved = trade.status === "approved";
    const profitLossValue = parseFloat(trade.profit_loss_value);
    const txnType = trade.profit_loss === "profit" ? "credit" : "debit";
    const reverseType = txnType === "credit" ? "debit" : "credit";

    // 2. Wallet reversal only if admin & approved
    if (isAdmin && isApproved) {
      const txnDesc = `Trade ${txnType} for Trade No: ${trade.trade_number}`;
      const [txnRows] = await pool.query(
        `SELECT id FROM transactions WHERE description = ? AND customer_id = ?`,
        [txnDesc, trade.customer_id]
      );

      if (txnRows.length > 0) {
        const txnId = txnRows[0].id;

        // Get last wallet balance
        const [walletRows] = await pool.query(
          `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1`,
          [trade.customer_id]
        );
        const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;

        const newBalance = reverseType === "credit"
          ? lastBalance + profitLossValue
          : lastBalance - profitLossValue;

        // Insert reversal wallet entry
        await pool.query(`
          INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
          VALUES (?, ?, ?, ?, ?)`,
          [
            trade.customer_id,
            profitLossValue,
            reverseType,
            newBalance,
            txnId
          ]
        );

        // Optional: mark transaction as reversed
        await pool.query(
          `UPDATE transactions SET status = 'reversed' WHERE id = ?`,
          [txnId]
        );
      }
    }

    // 3. Soft delete the trade
    await pool.query(
      `UPDATE trades SET is_active = FALSE WHERE id = ?`,
      [id]
    );

    res.json({ message: "Trade deleted and wallet adjusted (if required)." });

  } catch (error) {
    console.error("Error in deleteTrade:", error);
    res.status(500).json({ message: "Failed to delete trade" });
  }
};


export const approveTrade = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Get the trade
        const [trades] = await pool.query("SELECT * FROM trades WHERE id = ? AND is_active = TRUE", [id]);
        if (!trades.length) return res.status(404).json({ message: "Trade not found" });

        const trade = trades[0];
        if (trade.status === "approved") {
            return res.status(400).json({ message: "Trade already approved" });
        }

        const txnType = trade.profit_loss === "profit" ? "credit" : "debit";
        const description = `Trade ${txnType} for Trade No: ${trade.trade_number}`;

        // 2. Insert into transactions
        const [txnResult] = await pool.query(`
      INSERT INTO transactions (customer_id, type, status, amount, description)
      VALUES (?, ?, 'completed', ?, ?)
    `, [
            trade.customer_id,
            txnType,
            trade.profit_loss_value,
            description
        ]);

        const transactionId = txnResult.insertId;

        // 3. Get last balance
        const [walletRows] = await pool.query(`
      SELECT balance FROM wallets
      WHERE customer_id = ?
      ORDER BY id DESC LIMIT 1
    `, [trade.customer_id]);

        const lastBalance = walletRows.length ? walletRows[0].balance : 0;
        const newBalance = txnType === 'credit'
            ? parseFloat(lastBalance) + parseFloat(trade.profit_loss_value)
            : parseFloat(lastBalance) - parseFloat(trade.profit_loss_value);

        // 4. Insert into wallet
        await pool.query(`
      INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
      VALUES (?, ?, ?, ?, ?)
    `, [
            trade.customer_id,
            trade.profit_loss_value,
            txnType,
            newBalance,
            transactionId
        ]);

        // 5. Update trade status
        await pool.query("UPDATE trades SET status = 'approved' WHERE id = ?", [id]);

        res.json({ message: "Trade approved, wallet updated", balance: newBalance });

    } catch (error) {
        console.error("Trade approval error:", error);
        res.status(500).json({ message: "Approval failed" });
    }
};

