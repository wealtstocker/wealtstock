import pool from "../config/db.js";
const isAdmin = (req) => req.user?.role === "admin" || req.user?.role === "superadmin";

export const createTrade = async (req, res) => {
  const { customer_id, stock_name, buy_price, buy_quantity, exit_price, exit_quantity, brokerage, position_call } = req.body;
  const created_by = req.user?.role === "admin" ? "admin" : "customer";

  if (!customer_id || !stock_name || !buy_price || !buy_quantity) {
    return res.status(400).json({ message: "Please fill Customer ID, Stock Name, Buy Price, and Buy Quantity" });
  }

  const status = created_by === "admin" ? "approved" : "hold";
  if (exit_quantity && parseFloat(exit_quantity) > parseFloat(buy_quantity)) {
    return res.status(400).json({ message: "Exit quantity cannot exceed buy quantity" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [lastTrade] = await connection.query("SELECT trade_number FROM trades ORDER BY id DESC LIMIT 1");
    let trade_number = "T-1001";
    if (lastTrade.length > 0) {
      const lastNumber = parseInt(lastTrade[0].trade_number.split("-")[1] || "1000", 10);
      trade_number = `T-${lastNumber + 1}`;
    }

    const buyValue = parseFloat(buy_price) * parseFloat(buy_quantity);
    const exitValue = exit_price && exit_quantity ? parseFloat(exit_price) * parseFloat(exit_quantity) : 0;
    const profitLossValue = exitValue > 0 ? Math.abs(exitValue - buyValue - (parseFloat(brokerage) || 0)).toFixed(2) : 0;
    const profitLoss = exitValue > buyValue ? "profit" : exitValue < buyValue ? "loss" : "neutral";

    const [result] = await connection.query(
      `INSERT INTO trades (customer_id, trade_number, stock_name, buy_price, buy_quantity, buy_value, exit_price, exit_quantity, exit_value, profit_loss, profit_loss_value, brokerage, status, created_by, is_active, position_call, entry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, NOW())`,
      [customer_id, trade_number, stock_name, buy_price, buy_quantity, buyValue, exit_price || null, exit_quantity || null, exitValue, profitLoss, profitLossValue, brokerage || 0, status, created_by, position_call || "Equity Shares"]
    );

    await connection.commit();
    res.status(201).json({ message: `Trade ${status === "hold" ? "held" : "created"} successfully`, id: result.insertId, trade: { trade_number, buyValue, status } });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error in createTrade:", error.message);
    res.status(500).json({ message: "Trade creation failed", error: error.message });
  } finally {
    connection.release();
  }
};

export const updateTrade = async (req, res) => {
  const { id } = req.params;
  const { exit_price, exit_quantity, brokerage, position_call } = req.body;
  const isAdminUser = isAdmin(req);

  if (!isAdminUser) return res.status(403).json({ message: "Only admins can update trades" });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [tradeRows] = await connection.query(`SELECT * FROM trades WHERE id = ? AND is_active = TRUE FOR UPDATE`, [id]);
    if (!tradeRows.length) return res.status(404).json({ message: "Trade not found" });

    const oldTrade = tradeRows[0];
    if (exit_quantity && parseFloat(exit_quantity) > parseFloat(oldTrade.buy_quantity)) {
      return res.status(400).json({ message: "Exit quantity cannot exceed buy quantity" });
    }

    const buyValue = parseFloat(oldTrade.buy_price) * parseFloat(oldTrade.buy_quantity);
    const exitValue = exit_price && exit_quantity ? parseFloat(exit_price) * parseFloat(exit_quantity) : 0;
    const netPnl = exitValue - buyValue - (parseFloat(brokerage) || 0);
    const profitLoss = netPnl >= 0 ? "profit" : "loss";
    const profitLossValue = Math.abs(netPnl).toFixed(2);

    await connection.query(
      `UPDATE trades SET exit_price = ?, exit_quantity = ?, exit_value = ?, brokerage = ?, profit_loss = ?, profit_loss_value = ?, position_call = ?, updated_at = NOW() WHERE id = ?`,
      [exit_price || null, exit_quantity || null, exitValue, brokerage || 0, profitLoss, profitLossValue, position_call || oldTrade.position_call, id]
    );

    await connection.commit();
    res.status(200).json({ message: "Trade updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error in updateTrade:", error.message);
    res.status(500).json({ message: "Failed to update trade" });
  } finally {
    connection.release();
  }
};


export const approveTrade = async (req, res) => {
  const { id } = req.params;
  const isAdminUser = isAdmin(req);

  if (!isAdminUser) {
    return res.status(403).json({ message: "Only admins can approve trades" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [tradeRows] = await connection.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE AND status = 'hold' FOR UPDATE`,
      [id]
    );
    if (!tradeRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Trade not found or not in hold status" });
    }

    const trade = tradeRows[0];
    const buyPrice = parseFloat(trade.buy_price || 0);
    const buyQty = parseFloat(trade.buy_quantity || 0);
    const exitPrice = parseFloat(trade.exit_price || 0);
    const exitQty = parseFloat(trade.exit_quantity || 0);
    const brokerage = parseFloat(trade.brokerage || 0);

    if (
      isNaN(buyPrice) || isNaN(buyQty) || isNaN(exitPrice) ||
      isNaN(exitQty) || isNaN(brokerage)
    ) {
      await connection.rollback();
      return res.status(400).json({ message: "Invalid trade values for calculation" });
    }

    const buyValue = buyPrice * buyQty;
    const exitValue = exitPrice * exitQty;
    const netProfitLossValue = exitValue - buyValue - brokerage;
    const profitLossValue = Math.abs(netProfitLossValue).toFixed(2);


    const profitLoss = netProfitLossValue >= 0 ? "profit" : "loss";

    if (profitLoss === "loss") {
      const [walletRows] = await connection.query(
        `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
        [trade.customer_id]
      );
      const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
      if (currentBalance < parseFloat(profitLossValue)) {
        await connection.rollback();
        return res.status(400).json({
          message: "Not enough money in wallet for this loss",
          currentBalance,
          required: profitLossValue,
        });
      }
    }

    await connection.query(`UPDATE trades SET status = 'approved', updated_at = NOW() WHERE id = ?`, [id]);

    const txnType = profitLoss === "profit" ? "credit" : "debit";
    const txnDesc = `Trade ${txnType} for Trade No: ${trade.trade_number}`;
    const [txnResult] = await connection.query(
      `INSERT INTO transactions (customer_id, type, status, amount, description) VALUES (?, ?, 'completed', ?, ?)`,
      [trade.customer_id, txnType, profitLossValue, txnDesc]
    );

    const transactionId = txnResult.insertId;
    const [walletRows] = await connection.query(
      `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [trade.customer_id]
    );
    const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
    const newBalance = txnType === "credit" ? lastBalance + parseFloat(profitLossValue) : lastBalance - parseFloat(profitLossValue);

    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id) VALUES (?, ?, ?, ?, ?)`,
      [trade.customer_id, profitLossValue, txnType, newBalance, transactionId]
    );

    await connection.commit();
    res.status(200).json({ message: "Trade approved successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error in approveTrade:", error.message);
    res.status(500).json({ message: "Failed to approve trade", error: error.message });
  } finally {
    connection.release();
  }
};

// ... (other existing functions remain unchanged)

export const deleteTrade = async (req, res) => {
  const { id } = req.params;
  const isAdminUser = isAdmin(req);

  if (!isAdminUser) {
    return res.status(403).json({ message: "Only admins can delete trades" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [tradeRows] = await connection.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE FOR UPDATE`,
      [id]
    );
    if (!tradeRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Trade not found" });
    }

    const trade = tradeRows[0];
    const isApproved = trade.status === "approved";

    if (isApproved) {
      const [txnRows] = await connection.query(
        `SELECT * FROM transactions WHERE customer_id = ? AND type IN ('credit', 'debit') AND is_reversed = FALSE`,
        [trade.customer_id]
      );

      if (txnRows.length) {
        const txn = txnRows[0];
        const rollbackAmount = parseFloat(txn.amount);
        const reverseType = txn.type === "credit" ? "debit" : "credit";

        const [walletRows] = await connection.query(
          `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
          [trade.customer_id]
        );
        const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;

        const newBalance =
          reverseType === "credit"
            ? lastBalance + rollbackAmount
            : lastBalance - rollbackAmount;

        await connection.query(
          `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
           VALUES (?, ?, ?, ?, ?)`,
          [trade.customer_id, rollbackAmount, reverseType, newBalance, txn.id]
        );

        await connection.query(
          `UPDATE transactions SET is_reversed = TRUE WHERE id = ?`,
          [txn.id]
        );
      }
    }

    await connection.query(`UPDATE trades SET is_active = FALSE WHERE id = ?`, [id]);
    await connection.commit();
    res.json({ message: "Trade deleted and wallet adjusted" });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error in deleteTrade:", error);
    res.status(500).json({ message: "Failed to delete trade" });
  } finally {
    connection.release();
  }
};

export const deactivateTrade = async (req, res) => {
  const { id } = req.params;
  const isAdminUser = isAdmin(req);

  if (!isAdminUser) {
    return res.status(403).json({ message: "Only admins can deactivate trades" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [tradeRows] = await connection.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE FOR UPDATE`,
      [id]
    );
    if (!tradeRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Trade not found" });
    }

    const trade = tradeRows[0];
    const isApproved = trade.status === "approved";

    if (isApproved) {
      const [txnRows] = await connection.query(
        `SELECT * FROM transactions WHERE customer_id = ? AND type IN ('credit', 'debit') AND is_reversed = FALSE`,
        [trade.customer_id]
      );

      if (txnRows.length) {
        const txn = txnRows[0];
        const rollbackAmount = parseFloat(txn.amount);
        const reverseType = txn.type === "credit" ? "debit" : "credit";

        const [walletRows] = await connection.query(
          `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
          [trade.customer_id]
        );
        const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;

        const newBalance =
          reverseType === "credit"
            ? lastBalance + rollbackAmount
            : lastBalance - rollbackAmount;

        await connection.query(
          `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
           VALUES (?, ?, ?, ?, ?)`,
          [trade.customer_id, rollbackAmount, reverseType, newBalance, txn.id]
        );

        await connection.query(
          `UPDATE transactions SET is_reversed = TRUE WHERE id = ?`,
          [txn.id]
        );
      }
    }

    await connection.query(
      `UPDATE trades SET status = 'deactivated', updated_at = NOW() WHERE id = ?`,
      [id]
    );
    await connection.commit();
    res.json({ message: "Trade deactivated and wallet adjusted" });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error in deactivateTrade:", error);
    res.status(500).json({ message: "Failed to deactivate trade" });
  } finally {
    connection.release();
  }
};

export const getAllTransactions = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Only admins can view all transactions" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.customer_id, c.full_name AS customer_name, t.type, t.status, t.amount, t.description, t.created_at
      FROM transactions t
      JOIN customers c ON c.id = t.customer_id
      ORDER BY t.created_at DESC
    `);
    res.status(200).json({ transactions: rows });
  } catch (err) {
    res.status(500).json({ message: "Error loading transactions", error: err.message });
  }
};

export const getMyTransactions = async (req, res) => {
  const customerId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.type, t.amount, t.description, t.created_at
       FROM transactions t
       WHERE t.customer_id = ? AND t.status = 'completed'
       ORDER BY t.created_at DESC`,
      [customerId]
    );
    res.status(200).json({ transactions: rows });
  } catch (err) {
    res.status(500).json({ message: "Error loading transactions", error: err.message });
  }
};

export const getAllTrades = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Only admins can view all trades" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.customer_id, c.full_name AS customer_name, t.trade_number, t.stock_name,
             t.buy_price, t.buy_quantity, t.buy_value, t.exit_price, t.exit_quantity, t.exit_value,
             t.profit_loss, t.profit_loss_value, t.brokerage, t.status, t.created_by, t.is_active,
             t.created_at, t.updated_at
      FROM trades t
      JOIN customers c ON c.id = t.customer_id
      WHERE t.is_active = TRUE
      ORDER BY t.created_at DESC
    `);
    res.status(200).json({ trades: rows });
  } catch (err) {
    console.error("❌ Error in getAllTrades:", err.message);
    res.status(500).json({ message: "Error loading trades", error: err.message });
  }
};

export const getMyTrades = async (req, res) => {
  const customerId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.trade_number, t.stock_name, t.buy_price, t.buy_quantity, t.buy_value,
              t.exit_price, t.exit_quantity, t.exit_value, t.profit_loss, t.profit_loss_value,
              t.brokerage, t.status, t.created_at
       FROM trades t
       WHERE t.customer_id = ? AND t.is_active = TRUE
       ORDER BY t.created_at DESC`,
      [customerId]
    );
    res.status(200).json({ trades: rows });
  } catch (err) {
    console.error("❌ Error in getMyTrades:", err.message);
    res.status(500).json({ message: "Error loading trades", error: err.message });
  }
};

export const getTradeById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.customer_id, c.full_name AS customer_name, t.trade_number, t.stock_name,
              t.buy_price, t.buy_quantity, t.buy_value, t.exit_price, t.exit_quantity, t.exit_value,
              t.profit_loss, t.profit_loss_value, t.brokerage, t.status, t.created_by, t.is_active,
              t.created_at, t.updated_at
       FROM trades t
       JOIN customers c ON c.id = t.customer_id
       WHERE t.id = ? AND t.is_active = TRUE`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.status(200).json({ trade: rows[0] });
  } catch (err) {
    console.error("❌ Error in getTradeById:", err.message);
    res.status(500).json({ message: "Error loading trade", error: err.message });
  }
};

