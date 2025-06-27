import pool from "../config/db.js";

export async function addFundRequest(req, res) {
  const customerId = req.user.id;
  const { amount, method, utr_number, note } = req.body;
  const screenshot = req.file?.path?.replace(/\\/g, "/") || null;

  if (!amount || isNaN(amount) || amount <= 0 || !utr_number) {
    return res
      .status(400)
      .json({ message: "Amount and UTR number are required." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO add_funds 
        (customer_id, amount, method, utr_number, screenshot, note, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [customerId, amount, method || null, utr_number, screenshot, note || null]
    );

    return res.status(201).json({
      message: "Fund request submitted successfully.",
      fund_request_id: result.insertId,
    });
  } catch (error) {
    console.error("Add Fund Error:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to submit fund request", error: error.message });
  }
}

// controllers/walletNtransactionController.js
export const getMyFundRequests = async (req, res) => {
  const customerId = req.user.id;

  try {
    const [pending] = await pool.query(
      `
      SELECT * FROM add_funds 
      WHERE customer_id = ? AND status = 'pending' AND is_active = TRUE
      ORDER BY created_at DESC
    `,
      [customerId]
    );

    const [completed] = await pool.query(
      `
      SELECT * FROM add_funds 
      WHERE customer_id = ? AND status = 'successful' AND is_active = TRUE
      ORDER BY created_at DESC
    `,
      [customerId]
    );

    return res.status(200).json({
      pending,
      completed,
    });
  } catch (error) {
    console.error("❌ Error fetching fund requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ User Withdrawal Request
export async function requestWithdrawal(req, res) {
  const customerId = req.user.id;
  const { amount, bank_account_id } = req.body;

  try {
    if (!amount || isNaN(amount))
      return res.status(400).json({ message: "Invalid amount" });

    const [[wallet]] = await pool.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
      [customerId]
    );
    const balance = Number(wallet?.balance || 0);
    if (balance < amount) {
      return res.status(400).json({ message: "❌ Insufficient balance" });
    }

    // ✅ Check if the bank account belongs to this customer
    const [[bankAccount]] = await pool.query(
      "SELECT * FROM customer_bank_accounts WHERE id = ? AND customer_id = ?",
      [bank_account_id, customerId]
    );
    if (!bankAccount) {
      return res.status(400).json({ message: "❌ Invalid bank account" });
    }

    // ✅ Insert transaction
    const [txResult] = await pool.query(
      `INSERT INTO transactions (customer_id, type, amount, description, status) 
       VALUES (?, 'debit', ?, 'Withdrawal Request', 'pending')`,
      [customerId, amount]
    );

    // ✅ Insert withdrawal
    await pool.query(
      `INSERT INTO withdrawals (customer_id, amount, bank_account_id, status, transaction_id)
       VALUES (?, ?, ?, 'requested', ?)`,
      [customerId, amount, bank_account_id, txResult.insertId]
    );

    res
      .status(201)
      .json({ message: "✅ Withdrawal request submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Request failed", error: err.message });
  }
}

// ✅ User Check Balance
export async function checkBalance(req, res) {
  const customerId = req.user.id;

  try {
    const [[wallet]] = await pool.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
      [customerId]
    );
    if (!wallet)
      return res.status(200).json({ message: "No wallet found", data: 0 });
    res.status(200).json({ message: "balance fetched", data: wallet.balance });
    // res.json({ balance: wallet.balance });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Balance fetch error", error: err.message });
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

    res.status(200).json({
      message: "Wallet history fetched successfully.",
      data: walletHistory,
    });
  } catch (err) {
    console.error("❌ Wallet fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch wallet history" });
  }
}

// ✅ User Withdraw History

export async function getMyWithdrawals(req, res) {
  const customerId = req.user.id; // 👈 Authenticated customer
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
    res.status(200).json(rows);
  } catch (err) {
    console.error("Get customer withdrawals error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// ✅ User Transaction History
export const getAllTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.customer_id, c.full_name AS customer_name, t.type, t.status, t.amount, t.description, t.created_at
      FROM transactions t
      JOIN customers c ON c.id = t.customer_id
      ORDER BY t.created_at DESC
    `);

    res.status(200).json({ transactions: rows });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading transactions", error: err.message });
  }
};

export async function getAllFundRequests(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM add_funds ORDER BY created_at DESC`
    );

    res.status(200).json({
      message: "All fund requests fetched",
      data: rows,
    });
  } catch (err) {
    console.error("❌ Fund fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch fund requests" });
  }
}

export async function getApprovedFundRequests(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, u.full_name, u.email 
       FROM add_funds f
       JOIN users u ON f.customer_id = u.uuid
       WHERE f.status = 'successful'
       ORDER BY f.created_at DESC`
    );

    res.status(200).json({
      message: "Approved fund requests fetched",
      data: rows,
    });
  } catch (err) {
    console.error("❌ Approved fund fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch approved fund requests" });
  }
}
export async function getPendingFundRequests(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, u.full_name, u.email 
       FROM add_funds f
       JOIN users u ON f.customer_id = u.uuid
       WHERE f.status = 'pending'
       ORDER BY f.created_at DESC`
    );

    res.status(200).json({
      message: "Pending fund requests fetched",
      data: rows,
    });
  } catch (err) {
    console.error("❌ Pending fund fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch pending fund requests" });
  }
}

// ✅ Admin Approves Fund Request
export async function approveFundRequest(req, res) {
  const { requestId } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Get fund request
    const [[fund]] = await connection.query(
      "SELECT * FROM add_funds WHERE id = ? ",
      [requestId]
    );
    if (!fund) {
      await connection.rollback();
      return res.status(404).json({ message: "Fund request not found" });
    }
    if (fund.status === "successful") {
      await connection.rollback();
      return res.status(400).json({ message: "Already approved" });
    }

    const customerId = fund.customer_id;
    const amount = Number(fund.amount);

    // ✅ Step 2: Lock and get the latest balance
    const [[lastWallet]] = await connection.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
      [customerId]
    );

    const previousBalance = Number(lastWallet?.balance || 0); // ✅ Ensure it's a number
    const amountNum = Number(amount); // ✅ Ensure amount is a number
    const newBalance = previousBalance + amountNum;
    const updateblance = Math.round((previousBalance + amountNum) * 100) / 100;

    // console.log(updateblance)

    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
       VALUES (?, ?, 'credit', ?, NULL)`,
      [customerId, amount, newBalance]
    );

    // Step 4: Update fund request status
    await connection.query(
      "UPDATE add_funds SET status = 'successful' WHERE id = ?",
      [requestId]
    );
    await connection.commit();
    return res.json({
      message: "✅ Fund approved and wallet updated",
      amount,
      new_balance: newBalance,
    });
  } catch (err) {
    await connection.rollback();
    console.error("❌ Error in fund approval:", err.message);
    return res
      .status(500)
      .json({ message: "Approval failed", error: err.message });
  } finally {
    connection.release();
  }
}

//admin payout
export async function payout(req, res) {
  const { requestId } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Get fund request
    const [[fund]] = await connection.query(
      "SELECT * FROM add_funds WHERE id = ? and status=successful ",
      [requestId]
    );
    if (!fund) {
      await connection.rollback();
      return res.status(404).json({ message: "Fund request not found" });
    }
    if (fund.status === "successful") {
      await connection.rollback();
      return res.status(400).json({ message: "Already approved" });
    }

    const customerId = fund.customer_id;
    const amount = Number(fund.amount);

    // ✅ Step 2: Lock and get the latest balance
    const [[lastWallet]] = await connection.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
      [customerId]
    );

    const previousBalance = Number(lastWallet?.balance || 0); // ✅ Ensure it's a number
    const amountNum = Number(amount); // ✅ Ensure amount is a number
    const newBalance = previousBalance + amountNum;
    const updateblance = Math.round((previousBalance + amountNum) * 100) / 100;

    // console.log(updateblance)

    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id)
       VALUES (?, ?, 'credit', ?, NULL)`,
      [customerId, amount, newBalance]
    );

    // Step 4: Update fund request status
    await connection.query(
      "UPDATE add_funds SET status = 'successful' WHERE id = ?",
      [requestId]
    );
    await connection.commit();
    return res.json({
      message: "✅ Fund approved and wallet updated",
      amount,
      new_balance: newBalance,
    });
  } catch (err) {
    await connection.rollback();
    console.error("❌ Error in fund approval:", err.message);
    return res
      .status(500)
      .json({ message: "Approval failed", error: err.message });
  } finally {
    connection.release();
  }
}

// ✅ Admin Adds Balance
export async function topUpWallet(req, res) {
  const { customerId, amount, description, type } = req.body;

  if (
    !customerId ||
    !amount ||
    isNaN(amount) ||
    !["credit", "debit"].includes(type)
  ) {
    return res
      .status(400)
      .json({
        message:
          "Missing or invalid customerId, amount, or type (credit/debit)",
      });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Lock the latest balance row to prevent race conditions
    const [[lastWallet]] = await connection.query(
      "SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
      [customerId]
    );

    const previousBalance = Number(lastWallet?.balance || 0);
    const amountNum = Number(amount);
    let newBalance =
      type === "credit"
        ? previousBalance + amountNum
        : previousBalance - amountNum;

    newBalance = Math.round(newBalance * 100) / 100;

    if (newBalance < 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "❌ Insufficient funds for debit operation" });
    }

    // Insert transaction log
    const [txResult] = await connection.query(
      `INSERT INTO transactions (customer_id, type, amount, description, status) 
       VALUES (?, ?, ?, ?, 'completed')`,
      [customerId, type, amountNum, description || `Manual ${type} by admin`]
    );

    // Insert wallet entry
    await connection.query(
      `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [customerId, amountNum, type, newBalance, txResult.insertId]
    );

    await connection.commit();

    res.status(200).json({
      message: `✅ Wallet ${type} successful`,
      transaction_id: txResult.insertId,
      new_balance: newBalance,
    });
  } catch (err) {
    await connection.rollback();
    console.error("❌ Wallet update error:", err.message);
    res
      .status(500)
      .json({ message: "Wallet update error", error: err.message });
  } finally {
    connection.release();
  }
}

// ✅ Admin View All Balances
export async function getAllUserBalances(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT customer_id, MAX(balance) as balance 
      FROM wallets 
      GROUP BY customer_id 
      ORDER BY MAX(updated_at) DESC
    `);
    res.json({ balances: rows });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching balances", error: err.message });
  }
}

// ✅ Admin Update Fund Status
export const updateFundRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE fund_requests SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res
      .status(200)
      .json({
        status: true,
        message: `Fund request ${id} status updated to ${status}`,
        data: { id, status },
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Failed to update fund request status",
        error: error.message,
      });
  }
};

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
      c.email,
      t.status AS transaction_status
    FROM withdrawals w
    JOIN customers c ON w.customer_id = c.id
    JOIN transactions t ON w.transaction_id = t.id
  `;

  const params = [];

  if (status) {
    query += " WHERE w.status = ?";
    params.push(status);
  }

  query += " ORDER BY w.created_at DESC";

  try {
    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Get withdrawals error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// ✅ Admin Pending Withdrawals
export async function getPendingWithdrawals(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT w.*, c.name AS customer_name, cb.account_number 
      FROM withdrawals w
      JOIN customers c ON c.id = w.customer_id
      JOIN customer_bank_accounts cb ON cb.id = w.bank_account_id
      WHERE w.status = 'requested' 
      ORDER BY w.created_at DESC
    `);
    res.json({ pendingWithdrawals: rows });
  } catch (err) {
    res.status(500).json({ message: "❌ Fetch error", error: err.message });
  }
}

export async function updateWithdrawalStatus(req, res) {
  const { withdrawal_id, action } = req.body;

  if (!withdrawal_id || !["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid input" });
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
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "requested") {
      await connection.rollback();
      return res.status(400).json({ message: "Withdrawal already processed" });
    }

    const [[wallet]] = await connection.query(
      `SELECT balance FROM wallets WHERE customer_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [withdrawal.customer_id]
    );

    const currentBalance = Number(wallet?.balance || 0);
    const withdrawalAmount = Number(withdrawal.amount);

    if (action === "approve") {
      if (currentBalance < withdrawalAmount) {
        await connection.rollback();
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const newBalance = currentBalance - withdrawalAmount;

      // Update transaction
      // await connection.query(
      //   `UPDATE transactions SET status = 'completed', description = 'Withdrawal approved' WHERE id = ?`,
      //   [withdrawal.transaction_id]
      // );

      // Debit from wallet
      await connection.query(
        `INSERT INTO wallets (customer_id, amount, type, balance, transaction_id, updated_at)
         VALUES (?, ?, 'debit', ?, ?, NOW())`,
        [
          withdrawal.customer_id,
          withdrawalAmount,
          newBalance,
          withdrawal.transaction_id,
        ]
      );

      // Update withdrawal status
      await connection.query(
        `UPDATE withdrawals SET status = 'completed', updated_at = NOW() WHERE id = ?`,
        [withdrawal_id]
      );

      await connection.commit();
      return res
        .status(200)
        .json({ message: "Withdrawal approved", new_balance: newBalance });
    }

    if (action === "reject") {
      // Just mark transaction and withdrawal as rejected
      await connection.query(
        `UPDATE transactions SET status = 'rejected', description = 'Withdrawal rejected' WHERE id = ?`,
        [withdrawal.transaction_id]
      );

      await connection.query(
        `UPDATE withdrawals SET status = 'rejected', updated_at = NOW() WHERE id = ?`,
        [withdrawal_id]
      );

      await connection.commit();
      return res.status(200).json({ message: "Withdrawal rejected" });
    }
  } catch (err) {
    await connection.rollback();
    console.error("Update withdrawal error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    connection.release();
  }
}
