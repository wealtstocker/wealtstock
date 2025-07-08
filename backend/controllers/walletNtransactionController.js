import pool from "../config/db.js";

const getFileUrl = (req, field) => {
  return req.files?.[field]?.[0]?.path || null;
};

export async function addFundRequest(req, res) {
  const customerId = req.user.id;
  const { amount, method, utr_number, note } = req.body;

  const screenshot = getFileUrl(req, "screenshot"); // ✅ Cloudinary URL here

  if (!amount || isNaN(amount) || amount <= 0 || !utr_number) {
    return res.status(400).json({
      message: "Amount and UTR number are required",
      error: "Invalid input",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO add_funds 
        (customer_id, amount, method, utr_number, screenshot, note, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [customerId, amount, method || null, utr_number, screenshot, note || null]
    );

    return res.status(201).json({
      message: "Fund request submitted successfully",
      data: { fund_request_id: result.insertId },
    });
  } catch (error) {
    console.error("Add Fund Error:", error.message);
    return res.status(500).json({
      message: "Failed to submit fund request",
      error: error.message,
    });
  }
}


export async function getMyFundRequests(req, res) {
  const customerId = req.user.id;

  try {
    const [pending] = await pool.query(
      `SELECT * FROM add_funds 
       WHERE customer_id = ? AND status = 'pending' AND is_active = TRUE
       ORDER BY created_at DESC`,
      [customerId]
    );

    const [completed] = await pool.query(
      `SELECT * FROM add_funds 
       WHERE customer_id = ? AND status = 'successful' AND is_active = TRUE
       ORDER BY created_at DESC`,
      [customerId]
    );

    return res.status(200).json({
      message: "Fund requests fetched successfully",
      data: { pending, completed },
    });
  } catch (error) {
    console.error("Error fetching fund requests:", error.message);
    return res.status(500).json({ message: "Failed to fetch fund requests", error: error.message });
  }
}

export async function requestWithdrawal(req, res) {
  const customerId = req.user.id;
  const { amount, bank_account_id } = req.body;

  try {
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount", error: "Amount must be a positive number" });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [[wallet]] = await connection.query(
        "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
        [customerId]
      );
      const balance = Number(wallet?.balance || 0);
      if (balance < amount) {
        await connection.rollback();
        return res.status(400).json({ message: "Insufficient balance", error: "Balance too low" });
      }

      const [[bankAccount]] = await connection.query(
        "SELECT * FROM customer_bank_accounts WHERE id = ? AND customer_id = ?",
        [bank_account_id, customerId]
      );
      if (!bankAccount) {
        await connection.rollback();
        return res.status(400).json({ message: "Invalid bank account", error: "Bank account not found" });
      }

      const [txResult] = await connection.query(
        `INSERT INTO transactions (customer_id, type, amount, description, status) 
         VALUES (?, 'debit', ?, 'Withdrawal Request', 'pending')`,
        [customerId, amount]
      );

      await connection.query(
        `INSERT INTO withdrawals (customer_id, amount, bank_account_id, status, transaction_id)
         VALUES (?, ?, ?, 'requested', ?)`,
        [customerId, amount, bank_account_id, txResult.insertId]
      );

      await connection.commit();
      return res.status(201).json({ message: "Withdrawal request submitted successfully", data: { transaction_id: txResult.insertId } });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Withdrawal request error:", err.message);
    return res.status(500).json({ message: "Failed to submit withdrawal request", error: err.message });
  }
}

export async function checkBalance(req, res) {
  const customerId = req.user.id;

  try {
    const [[wallet]] = await pool.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
      [customerId]
    );
    return res.status(200).json({
      message: "Balance fetched successfully",
      data: { balance: wallet?.balance || 0 },
    });
  } catch (err) {
    console.error("Balance fetch error:", err.message);
    return res.status(500).json({ message: "Failed to fetch balance", error: err.message });
  }
}

export async function getMyWallet(req, res) {
  const customerId = req.user.id;

  try {
    const [walletHistory] = await pool.query(
      `SELECT id, amount, type, balance, created_at 
       FROM wallets 
       WHERE customer_id = ? 
       ORDER BY created_at DESC`,
      [customerId]
    );

    return res.status(200).json({
      message: "Wallet history fetched successfully",
      data: walletHistory,
    });
  } catch (err) {
    console.error("Wallet fetch error:", err.message);
    return res.status(500).json({ message: "Failed to fetch wallet history", error: err.message });
  }
}

export async function getMyWithdrawals(req, res) {
  const customerId = req.user.id;
  const { status } = req.query;

  let query = `
    SELECT w.id, w.amount, w.status, w.created_at, w.updated_at,
           t.status AS transaction_status, cb.account_number
    FROM withdrawals w
    JOIN transactions t ON w.transaction_id = t.id
    LEFT JOIN customer_bank_accounts cb ON cb.id = w.bank_account_id
    WHERE w.customer_id = ?
  `;

  const params = [customerId];

  if (status) {
    query += " AND w.status = ?";
    params.push(status);
  }

  query += " ORDER BY w.created_at DESC";

  try {
    const [rows] = await pool.query(query, params);
    return res.status(200).json({
      message: "Withdrawals fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Get withdrawals error:", err.message);
    return res.status(500).json({ message: "Failed to fetch withdrawals", error: err.message });
  }
}

export async function getAllTransactions(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.customer_id, c.full_name AS customer_name, t.type, t.status, t.amount, t.description, t.created_at
      FROM transactions t
      JOIN customers c ON c.id = t.customer_id
      ORDER BY t.created_at DESC
    `);
    return res.status(200).json({
      message: "Transactions fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching transactions:", err.message);
    return res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
}

export async function getAllFundRequests(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, c.full_name 
       FROM add_funds f
       JOIN customers c ON f.customer_id = c.id
       ORDER BY f.created_at DESC`
    );
    return res.status(200).json({
      message: "Fund requests fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Fund fetch error:", err.message);
    return res.status(500).json({ message: "Failed to fetch fund requests", error: err.message });
  }
}

export async function getPendingFundRequests(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, c.full_name 
       FROM add_funds f
       JOIN customers c ON f.customer_id = c.id
       WHERE f.status = 'pending'
       ORDER BY f.created_at DESC`
    );
    return res.status(200).json({
      message: "Pending fund requests fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Pending fund fetch error:", err.message);
    return res.status(500).json({ message: "Failed to fetch pending fund requests", error: err.message });
  }
}

export async function getApprovedFundRequests(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, c.full_name 
       FROM add_funds f
       JOIN customers c ON f.customer_id = c.id
       WHERE f.status = 'successful'
       ORDER BY f.created_at DESC`
    );
    return res.status(200).json({
      message: "Approved fund requests fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Approved fund fetch error:", err.message);
    return res.status(500).json({ message: "Failed to fetch approved fund requests", error: err.message });
  }
}

export async function approveFundRequest(req, res) {
  const { requestId } = req.params;
  const { amount: overrideAmount } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[fund]] = await connection.query(
      "SELECT * FROM add_funds WHERE id = ? FOR UPDATE",
      [requestId]
    );

    if (!fund) {
      await connection.rollback();
      return res.status(404).json({ message: "Fund request not found", error: "Invalid request ID" });
    }

    if (fund.status !== "pending") {
      await connection.rollback();
      return res.status(400).json({ message: "Fund request already processed", error: "Invalid status" });
    }

    const customerId = fund.customer_id;
    const approvedAmount = Number(overrideAmount || fund.amount); // ✅ use overridden amount if provided

    const [[lastWallet]] = await connection.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
      [customerId]
    );

    const previousBalance = Number(lastWallet?.balance || 0);
    const newBalance = Math.round((previousBalance + approvedAmount) * 100) / 100;

    const [txResult] = await connection.query(
      `INSERT INTO transactions (customer_id, type, amount, description, status)
       VALUES (?, 'credit', ?, 'Fund request approved', 'completed')`,
      [customerId, approvedAmount]
    );

    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
       VALUES (?, ?, 'credit', ?, ?)`,
      [customerId, approvedAmount, newBalance, txResult.insertId]
    );

    await connection.query(
      "UPDATE add_funds SET status = 'successful', amount = ?, updated_at = NOW() WHERE id = ?",
      [approvedAmount, requestId]
    );

    await connection.commit();

    return res.status(200).json({
      message: "Fund request approved and wallet updated",
      data: {
        approved_amount: approvedAmount,
        new_balance: newBalance,
        transaction_id: txResult.insertId,
      },
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error in fund approval:", err.message);
    return res.status(500).json({ message: "Failed to approve fund request", error: err.message });
  } finally {
    connection.release();
  }
}


export async function rejectFundRequest(req, res) {
  const { requestId } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[fund]] = await connection.query(
      "SELECT * FROM add_funds WHERE id = ? FOR UPDATE",
      [requestId]
    );
    if (!fund) {
      await connection.rollback();
      return res.status(404).json({ message: "Fund request not found", error: "Invalid request ID" });
    }
    if (fund.status !== "pending") {
      await connection.rollback();
      return res.status(400).json({ message: "Fund request already processed", error: "Invalid status" });
    }

    await connection.query(
      "UPDATE add_funds SET status = 'rejected', updated_at = NOW() WHERE id = ?",
      [requestId]
    );

    await connection.commit();
    return res.status(200).json({ message: "Fund request rejected successfully", data: { request_id: requestId } });
  } catch (err) {
    await connection.rollback();
    console.error("Error in rejecting fund request:", err.message);
    return res.status(500).json({ message: "Failed to reject fund request", error: err.message });
  } finally {
    connection.release();
  }
}

export async function updateFundRequestStatus(req, res) {
  const { request_id, action } = req.body;

  if (!request_id || !["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid request ID or action", error: "Invalid input" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[fund]] = await connection.query(
      "SELECT * FROM add_funds WHERE id = ? FOR UPDATE",
      [request_id]
    );
    if (!fund) {
      await connection.rollback();
      return res.status(404).json({ message: "Fund request not found", error: "Invalid request ID" });
    }
    if (fund.status !== "pending") {
      await connection.rollback();
      return res.status(400).json({ message: "Fund request already processed", error: "Invalid status" });
    }

    if (action === "approve") {
      const customerId = fund.customer_id;
      const amount = Number(fund.amount);

      const [[lastWallet]] = await connection.query(
        "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
        [customerId]
      );

      const previousBalance = Number(lastWallet?.balance || 0);
      const newBalance = Math.round((previousBalance + amount) * 100) / 100;

      const [txResult] = await connection.query(
        `INSERT INTO transactions (customer_id, type, amount, description, status)
         VALUES (?, 'credit', ?, 'Fund request approved', 'completed')`,
        [customerId, amount]
      );

      await connection.query(
        `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
         VALUES (?, ?, 'credit', ?, ?)`,
        [customerId, amount, newBalance, txResult.insertId]
      );

      await connection.query(
        "UPDATE add_funds SET status = 'successful', updated_at = NOW() WHERE id = ?",
        [request_id]
      );

      await connection.commit();
      return res.status(200).json({
        message: "Fund request approved and wallet updated",
        data: { amount, new_balance: newBalance, transaction_id: txResult.insertId },
      });
    }

    if (action === "reject") {
      await connection.query(
        "UPDATE add_funds SET status = 'rejected', updated_at = NOW() WHERE id = ?",
        [request_id]
      );

      await connection.commit();
      return res.status(200).json({ message: "Fund request rejected successfully", data: { request_id } });
    }
  } catch (err) {
    await connection.rollback();
    console.error("Error updating fund request status:", err.message);
    return res.status(500).json({ message: "Failed to update fund request status", error: err.message });
  } finally {
    connection.release();
  }
}

export async function payout(req, res) {
  const { requestId } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[withdrawal]] = await connection.query(
      "SELECT * FROM withdrawals WHERE id = ? AND status = 'requested' FOR UPDATE",
      [requestId]
    );
    if (!withdrawal) {
      await connection.rollback();
      return res.status(404).json({ message: "Withdrawal request not found or not pending", error: "Invalid request ID" });
    }

    const customerId = withdrawal.customer_id;
    const amount = Number(withdrawal.amount);

    const [[lastWallet]] = await connection.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
      [customerId]
    );

    const previousBalance = Number(lastWallet?.balance || 0);
    if (previousBalance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: "Insufficient balance", error: "Balance too low" });
    }

    const newBalance = Math.round((previousBalance - amount) * 100) / 100;

    await connection.query(
      `UPDATE transactions SET status = 'completed', description = 'Withdrawal payout approved' WHERE id = ?`,
      [withdrawal.transaction_id]
    );

    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
       VALUES (?, ?, 'debit', ?, ?)`,
      [customerId, amount, newBalance, withdrawal.transaction_id]
    );

    await connection.query(
      "UPDATE withdrawals SET status = 'completed', updated_at = NOW() WHERE id = ?",
      [requestId]
    );

    await connection.commit();
    return res.status(200).json({
      message: "Withdrawal payout approved and wallet updated",
      data: { amount, new_balance: newBalance, transaction_id: withdrawal.transaction_id },
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error in payout:", err.message);
    return res.status(500).json({ message: "Failed to process payout", error: err.message });
  } finally {
    connection.release();
  }
}

export async function topUpWallet(req, res) {
  const { customerId, amount, description, type } = req.body;

  if (!customerId || !amount || isNaN(amount) || amount <= 0 || !["credit", "debit"].includes(type)) {
    return res.status(400).json({ message: "Missing or invalid customerId, amount, or type", error: "Invalid input" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[lastWallet]] = await connection.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
      [customerId]
    );

    const previousBalance = Number(lastWallet?.balance || 0);
    const amountNum = Number(amount);
    const newBalance = Math.round((type === "credit" ? previousBalance + amountNum : previousBalance - amountNum) * 100) / 100;

    if (newBalance < 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Insufficient funds for debit operation", error: "Balance too low" });
    }

    const [txResult] = await connection.query(
      `INSERT INTO transactions (customer_id, type, amount, description, status) 
       VALUES (?, ?, ?, ?, 'completed')`,
      [customerId, type, amountNum, description || `Manual ${type} by admin`]
    );

    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [customerId, amountNum, type, newBalance, txResult.insertId]
    );

    await connection.commit();
    return res.status(200).json({
      message: `Wallet ${type} successful`,
      data: { transaction_id: txResult.insertId, new_balance: newBalance },
    });
  } catch (err) {
    await connection.rollback();
    console.error("Wallet update error:", err.message);
    return res.status(500).json({ message: "Failed to update wallet", error: err.message });
  } finally {
    connection.release();
  }
}

export async function getAllUserBalances(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT w.customer_id, w.balance
      FROM wallets w
      JOIN (SELECT customer_id, MAX(id) as max_id FROM wallets GROUP BY customer_id) latest
      ON w.id = latest.max_id
      ORDER BY w.updated_at DESC
    `);
    return res.status(200).json({
      message: "Balances fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching balances:", err.message);
    return res.status(500).json({ message: "Failed to fetch balances", error: err.message });
  }
}

export async function getAllWithdrawals(req, res) {
  const { status } = req.query;

  let query = `
    SELECT 
      w.id AS withdrawal_id, 
      w.amount, 
      w.status, 
      w.created_at, 
      w.updated_at,
      c.id AS customer_id, 
      c.full_name,
      t.status AS transaction_status,
      cb.account_number
    FROM withdrawals w
    JOIN customers c ON w.customer_id = c.id
    JOIN transactions t ON w.transaction_id = t.id
    LEFT JOIN customer_bank_accounts cb ON cb.id = w.bank_account_id
  `;

  const params = [];

  if (status) {
    query += " WHERE w.status = ?";
    params.push(status);
  }

  query += " ORDER BY w.created_at DESC";

  try {
    const [rows] = await pool.query(query, params);
    return res.status(200).json({
      message: "Withdrawals fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Get withdrawals error:", err.message);
    return res.status(500).json({ message: "Failed to fetch withdrawals", error: err.message });
  }
}

export async function getPendingWithdrawals(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT w.*, c.full_name AS customer_name, cb.account_number 
      FROM withdrawals w
      JOIN customers c ON c.id = w.customer_id
      JOIN customer_bank_accounts cb ON cb.id = w.bank_account_id
      WHERE w.status = 'requested' 
      ORDER BY w.created_at DESC
    `);
    return res.status(200).json({
      message: "Pending withdrawals fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Fetch pending withdrawals error:", err.message);
    return res.status(500).json({ message: "Failed to fetch pending withdrawals", error: err.message });
  }
}

export async function updateWithdrawalStatus(req, res) {
  const { withdrawal_id, action } = req.body;

  if (!withdrawal_id || !["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid withdrawal ID or action", error: "Invalid input" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[withdrawal]] = await connection.query(
      `SELECT * FROM withdrawals WHERE id = ? FOR UPDATE`,
      [withdrawal_id]
    );

    if (!withdrawal) {
      await connection.rollback();
      return res.status(404).json({ message: "Withdrawal not found", error: "Invalid withdrawal ID" });
    }

    if (withdrawal.status !== "requested") {
      await connection.rollback();
      return res.status(400).json({ message: "Withdrawal already processed", error: "Invalid status" });
    }

    if (action === "approve") {
      const [[wallet]] = await connection.query(
        `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
        [withdrawal.customer_id]
      );

      const currentBalance = Number(wallet?.balance || 0);
      const withdrawalAmount = Number(withdrawal.amount);

      if (currentBalance < withdrawalAmount) {
        await connection.rollback();
        return res.status(400).json({ message: "Insufficient funds", error: "Balance too low" });
      }

      const newBalance = Math.round((currentBalance - withdrawalAmount) * 100) / 100;

      await connection.query(
        `UPDATE transactions SET status = 'completed', description = 'Withdrawal approved' WHERE id = ?`,
        [withdrawal.transaction_id]
      );

      await connection.query(
        `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id, updated_at)
         VALUES (?, ?, 'debit', ?, ?, NOW())`,
        [withdrawal.customer_id, withdrawalAmount, newBalance, withdrawal.transaction_id]
      );

      await connection.query(
        `UPDATE withdrawals SET status = 'completed', updated_at = NOW() WHERE id = ?`,
        [withdrawal_id]
      );

      await connection.commit();
      return res.status(200).json({
        message: "Withdrawal approved successfully",
        data: { new_balance: newBalance, transaction_id: withdrawal.transaction_id },
      });
    }

    if (action === "reject") {
      await connection.query(
        `UPDATE transactions SET status = 'rejected', description = 'Withdrawal rejected' WHERE id = ?`,
        [withdrawal.transaction_id]
      );

      await connection.query(
        `UPDATE withdrawals SET status = 'rejected', updated_at = NOW() WHERE id = ?`,
        [withdrawal_id]
      );

      await connection.commit();
      return res.status(200).json({
        message: "Withdrawal rejected successfully",
        data: { withdrawal_id },
      });
    }
  } catch (err) {
    await connection.rollback();
    console.error("Update withdrawal error:", err.message);
    return res.status(500).json({ message: "Failed to update withdrawal status", error: err.message });
  } finally {
    connection.release();
  }
}