import pool from "../config/db.js";

// Middleware to check if user is admin or superadmin
const isAdmin = (req) => req.user?.role === "admin" || req.user?.role === "superadmin";

export const createTrade = async (req, res) => {
  const {
    customer_id,
    stock_name,
    buy_price,
    buy_quantity,
    exit_price,
    exit_quantity,
    brokerage,
    created_by,
  } = req.body;

  if (!customer_id || !stock_name || !buy_price || !buy_quantity || !exit_price || !exit_quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const isAdminUser = isAdmin(req);
  const status = created_by === "admin" ? "approved" : "hold"; // Customer trades start as 'hold'

  const [lastTrade] = await pool.query(`
    SELECT trade_number FROM trades
    ORDER BY id DESC LIMIT 1
  `);

  let trade_number = "T-1001";
  if (lastTrade.length > 0) {
    const lastNumber = parseInt(lastTrade[0].trade_number?.split("-")[1] || "1000", 10);
    trade_number = `T-${lastNumber + 1}`;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Calculate trade values
    const buyValue = parseFloat(buy_price) * parseFloat(buy_quantity);
    const exitValue = parseFloat(exit_price) * parseFloat(exit_quantity);
    const rawProfitLossValue = exitValue - buyValue;
    const netProfitLossValue = rawProfitLossValue - parseFloat(brokerage || 0);
    const profitLossValue = Math.abs(netProfitLossValue).toFixed(2);
    const profitLoss = netProfitLossValue >= 0 ? "profit" : "loss";


    // Wallet validation for loss trades
    if (isAdminUser && profitLoss === "loss" && status === "approved") {
      const [walletRows] = await connection.query(
        `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
        [customer_id]
      );
      const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
      if (currentBalance < parseFloat(profitLossValue)) {
        await connection.rollback();
        return res.status(400).json({
          message: "Insufficient balance for loss trade",
          currentBalance,
          required: profitLossValue,
        });
      }
    }

    // Insert trade
    const [result] = await connection.query(
      `INSERT INTO trades (
        customer_id, trade_number, stock_name, buy_price, buy_quantity, buy_value,
        exit_price, exit_quantity, exit_value, profit_loss, profit_loss_value,
        brokerage, status, created_by, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        customer_id,
        trade_number,
        stock_name,
        buy_price,
        buy_quantity,
        buyValue,
        exit_price,
        exit_quantity,
        exitValue,
        profitLoss,
        profitLossValue,
        brokerage || 0,
        status,
        created_by,
      ]
    );

    const tradeId = result.insertId;

    // Update wallet and transactions for approved trades
    if (isAdminUser && status === "approved") {
      const txnType = profitLoss === "profit" ? "credit" : "debit";
      const txnDesc = `Trade ${txnType} for Trade No: ${trade_number}`;

      const [txnResult] = await connection.query(
        `INSERT INTO transactions (customer_id, type, status, amount, description)
         VALUES (?, ?, 'completed', ?, ?)`,
        [customer_id, txnType, profitLossValue, txnDesc]
      );

      const transactionId = txnResult.insertId;

      const [walletRows] = await connection.query(
        `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
        [customer_id]
      );

      const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
      const newBalance =
        txnType === "credit"
          ? lastBalance + parseFloat(profitLossValue)
          : lastBalance - parseFloat(profitLossValue);

      await connection.query(
        `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
         VALUES (?, ?, ?, ?, ?)`,
        [customer_id, profitLossValue, txnType, newBalance, transactionId]
      );
    }

    await connection.commit();
    res.status(201).json({
      message: `Trade ${status === "hold" ? "held" : "created"} successfully`,
      id: tradeId,
      trade: {
        trade_number,
        buyValue,
        exitValue,
        profitLoss,
        profitLossValue,
        status,
      },
    });
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
  const updates = req.body;
  const isAdminUser = isAdmin(req);

  if (!isAdminUser) {
    return res.status(403).json({ message: "Only admins can update trades" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Fetch existing trade
    const [tradeRows] = await connection.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE FOR UPDATE`,
      [id]
    );
    if (!tradeRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Trade not found" });
    }

    const oldTrade = tradeRows[0];

    // Reverse previous transaction if it exists
    const [txnRows] = await connection.query(
      `SELECT * FROM transactions WHERE customer_id = ? AND type IN ('credit', 'debit') AND is_reversed = FALSE`,
      [oldTrade.customer_id]
    );

    let currentBalance = 0;
    const [walletRows] = await connection.query(
      `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [oldTrade.customer_id]
    );
    if (walletRows.length) {
      currentBalance = parseFloat(walletRows[0].balance);
    }

    if (txnRows.length) {
      const txn = txnRows[0];
      const rollbackAmount = parseFloat(txn.amount);
      const reverseType = txn.type === "credit" ? "debit" : "credit";

      currentBalance =
        reverseType === "credit"
          ? currentBalance + rollbackAmount
          : currentBalance - rollbackAmount;

      await connection.query(
        `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
         VALUES (?, ?, ?, ?, ?)`,
        [oldTrade.customer_id, rollbackAmount, reverseType, currentBalance, txn.id]
      );

      await connection.query(
        `UPDATE transactions SET is_reversed = TRUE WHERE id = ?`,
        [txn.id]
      );
    }

    // Calculate new trade values
    const buy_price = parseFloat(updates.buy_price || oldTrade.buy_price);
    const buy_quantity = parseInt(updates.buy_quantity || oldTrade.buy_quantity);
    const exit_price = parseFloat(updates.exit_price || oldTrade.exit_price);
    const exit_quantity = parseInt(updates.exit_quantity || oldTrade.exit_quantity);
    const brokerage = parseFloat(updates.brokerage || oldTrade.brokerage || 0);
    const status = updates.status || oldTrade.status;

    const buy_value = buy_price * buy_quantity;
    const exit_value = exit_price * exit_quantity;
    const netPnl = exit_value - buy_value - brokerage;
    const profit_loss = netPnl >= 0 ? "profit" : "loss";
    const profit_loss_value = Math.abs(netPnl).toFixed(2);

    // Validate balance for loss trades
    if (status === "approved" && profit_loss === "loss") {
      if (currentBalance < parseFloat(profit_loss_value)) {
        await connection.rollback();
        return res.status(400).json({
          message: "Insufficient balance for loss trade",
          currentBalance,
          required: profit_loss_value,
        });
      }
    }

    // Update trade
    await connection.query(
      `UPDATE trades SET
        customer_id = ?, stock_name = ?, buy_price = ?, buy_quantity = ?,
        buy_value = ?, exit_price = ?, exit_quantity = ?, exit_value = ?,
        brokerage = ?, profit_loss = ?, profit_loss_value = ?, status = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        updates.customer_id || oldTrade.customer_id,
        updates.stock_name || oldTrade.stock_name,
        buy_price,
        buy_quantity,
        buy_value,
        exit_price,
        exit_quantity,
        exit_value,
        brokerage,
        profit_loss,
        profit_loss_value,
        status,
        id,
      ]
    );

    // Update wallet and transactions for approved trades
    if (status === "approved") {
      const txnType = profit_loss === "profit" ? "credit" : "debit";
      const newDesc = `Trade ${txnType} for Trade No: ${oldTrade.trade_number}`;

      const [txnResult] = await connection.query(
        `INSERT INTO transactions (customer_id, type, status, amount, description)
         VALUES (?, ?, 'completed', ?, ?)`,
        [oldTrade.customer_id, txnType, profit_loss_value, newDesc]
      );

      const newBalance =
        txnType === "credit"
          ? currentBalance + parseFloat(profit_loss_value)
          : currentBalance - parseFloat(profit_loss_value);

      await connection.query(
        `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
         VALUES (?, ?, ?, ?, ?)`,
        [oldTrade.customer_id, profit_loss_value, txnType, newBalance, txnResult.insertId]
      );
    }

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

export const approveTrade = async (req, res) => {
  const { id } = req.params;
  const isAdminUser = isAdmin(req);

  if (!isAdminUser) {
    return res.status(403).json({ message: "Only admins can approve trades" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Fetch trade
    const [tradeRows] = await connection.query(
      `SELECT * FROM trades WHERE id = ? AND is_active = TRUE AND status = 'hold' FOR UPDATE`,
      [id]
    );
    if (!tradeRows.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Trade not found or not in hold status" });
    }

    const trade = tradeRows[0];

    // Calculate trade values (for validation)
    const buyValue = parseFloat(trade.buy_price) * parseFloat(trade.buy_quantity);
    const exitValue = parseFloat(trade.exit_price) * parseFloat(trade.exit_quantity);
    const rawProfitLossValue = exitValue - buyValue;
    const netProfitLossValue = rawProfitLossValue - parseFloat(trade.brokerage || 0);
    const profitLossValue = Math.abs(netProfitLossValue).toFixed(2);
    const profitLoss = netProfitLossValue >= 0 ? "profit" : "loss";

    // Wallet validation for loss trades
    if (profitLoss === "loss") {
      const [walletRows] = await connection.query(
        `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
        [trade.customer_id]
      );
      const currentBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
      if (currentBalance < parseFloat(profitLossValue)) {
        await connection.rollback();
        return res.status(400).json({
          message: "Insufficient balance for loss trade",
          currentBalance,
          required: profitLossValue,
        });
      }
    }

    // Update trade status to approved
    await connection.query(
      `UPDATE trades SET status = 'approved', updated_at = NOW() WHERE id = ?`,
      [id]
    );

    // Create transaction and update wallet
    const txnType = profitLoss === "profit" ? "credit" : "debit";
    const txnDesc = `Trade ${txnType} for Trade No: ${trade.trade_number}`;

    const [txnResult] = await connection.query(
      `INSERT INTO transactions (customer_id, type, status, amount, description)
       VALUES (?, ?, 'completed', ?, ?)`,
      [trade.customer_id, txnType, profitLossValue, txnDesc]
    );

    const transactionId = txnResult.insertId;

    const [walletRows] = await connection.query(
      `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [trade.customer_id]
    );

    const lastBalance = walletRows.length ? parseFloat(walletRows[0].balance) : 0;
    const newBalance =
      txnType === "credit"
        ? lastBalance + parseFloat(profitLossValue)
        : lastBalance - parseFloat(profitLossValue);

    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
       VALUES (?, ?, ?, ?, ?)`,
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