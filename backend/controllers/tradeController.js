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

// ✅ UPDATE Trade (rollback old txn, apply new if admin+approved)
export const updateTrade = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Step 1: Fetch original trade
    const [tradeRows] = await pool.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE`,
      [id]
    );
    if (!tradeRows.length)
      return res.status(404).json({ message: "Trade not found" });

    const oldTrade = tradeRows[0];
    const isAdmin = updates.created_by === "admin";
    const isApproved = updates.status === "approved";

    // Step 2: Reverse existing transaction if any
    const txnDesc = `Trade ${oldTrade.profit_loss === "profit" ? "credit" : "debit"} for Trade No: ${oldTrade.trade_number}`;
    const [txnRows] = await pool.query(
      `SELECT * FROM transactions WHERE description = ? AND customer_id = ? AND is_reversed = FALSE`,
      [txnDesc, oldTrade.customer_id]
    );

    let currentBalance = 0;
    const [walletRows] = await pool.query(
      `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1`,
      [oldTrade.customer_id]
    );
    if (walletRows.length) currentBalance = parseFloat(walletRows[0].balance);

    if (txnRows.length) {
      const txn = txnRows[0];
      const rollbackAmount = parseFloat(txn.amount);

      // Adjust balance
      currentBalance = txn.type === "credit"
        ? currentBalance - rollbackAmount
        : currentBalance + rollbackAmount;

      await pool.query(`DELETE FROM wallets WHERE transaction_id = ?`, [txn.id]);
      await pool.query(`DELETE FROM transactions WHERE id = ?`, [txn.id]);
    }

    // Step 3: Recalculate new trade values
    const buyValue = parseFloat(updates.buy_price) * parseFloat(updates.buy_quantity);
    const exitValue = parseFloat(updates.exit_price) * parseFloat(updates.exit_quantity);
    const brokerage = parseFloat(updates.brokerage || 0);
    const netPnl = exitValue - buyValue - brokerage;
    const profitLossValue = Math.abs(netPnl).toFixed(2);
    const profitLoss = netPnl >= 0 ? "profit" : "loss";

    // Update calculated fields
    updates.buy_value = buyValue;
    updates.exit_value = exitValue;
    updates.profit_loss = profitLoss;
    updates.profit_loss_value = profitLossValue;

    // Step 4: Admin balance check if new trade is a loss
    if (isAdmin && isApproved && profitLoss === "loss") {
      if (currentBalance < profitLossValue) {
        return res.status(400).json({
          message: "Insufficient balance for loss trade",
          currentBalance,
          required: profitLossValue
        });
      }
    }

    // Step 5: Apply updates to trade
    await pool.query(`UPDATE trades SET ? WHERE id = ?`, [updates, id]);

    // Step 6: If approved + admin, create transaction and wallet entry
    if (isAdmin && isApproved) {
      const txnType = profitLoss === "profit" ? "credit" : "debit";
      const newDesc = `Trade ${txnType} for Trade No: ${oldTrade.trade_number}`;

      const [txnResult] = await pool.query(
        `INSERT INTO transactions (customer_id, type, status, amount, description)
         VALUES (?, ?, 'completed', ?, ?)`,
        [oldTrade.customer_id, txnType, profitLossValue, newDesc]
      );
      const txnId = txnResult.insertId;

      const newBalance = txnType === "credit"
        ? currentBalance + parseFloat(profitLossValue)
        : currentBalance - parseFloat(profitLossValue);

      await pool.query(
        `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
         VALUES (?, ?, ?, ?, ?)`,
        [oldTrade.customer_id, profitLossValue, txnType, newBalance, txnId]
      );
    }

    res.json({ message: "Trade updated successfully" });

  } catch (error) {
    console.error("Error in updateTrade:", error);
    res.status(500).json({ message: "Failed to update trade" });
  }
};


// ✅ DELETE Trade (with wallet & txn rollback if admin)
export const deleteTrade = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Fetch trade
    const [tradeRows] = await pool.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE`,
      [id]
    );
    if (tradeRows.length === 0)
      return res.status(404).json({ message: "Trade not found or already inactive" });

    const trade = tradeRows[0];
    const isAdmin = trade.created_by === "admin";
    const isApproved = trade.status === "approved";
    const txnType = trade.profit_loss === "profit" ? "credit" : "debit";
    const reverseType = txnType === "credit" ? "debit" : "credit";

    // Step 2: Reverse wallet only if admin + approved
    if (isAdmin && isApproved) {
      const txnDesc = `Trade ${txnType} for Trade No: ${trade.trade_number}`;
      const [txnRows] = await pool.query(
        `SELECT * FROM transactions WHERE description = ? AND customer_id = ? AND is_reversed = FALSE`,
        [txnDesc, trade.customer_id]
      );

      if (txnRows.length) {
        const txn = txnRows[0];

        const [walletRows] = await pool.query(
          `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1`,
          [trade.customer_id]
        );
        const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
        const profitLossValue = parseFloat(trade.profit_loss_value);

        const newBalance = reverseType === "credit"
          ? lastBalance + profitLossValue
          : lastBalance - profitLossValue;

        // Insert reversal wallet entry
        await pool.query(
          `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
           VALUES (?, ?, ?, ?, ?)`,
          [trade.customer_id, profitLossValue, reverseType, newBalance, txn.id]
        );

        // Mark original transaction as reversed
        await pool.query(
          `UPDATE transactions SET is_reversed = TRUE WHERE id = ?`,
          [txn.id]
        );
      }
    }

    // Step 3: Soft-delete the trade
    await pool.query(
      `UPDATE trades SET is_active = FALSE WHERE id = ?`,
      [id]
    );

    res.json({ message: "Trade deleted and wallet adjusted (if applicable)." });
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

