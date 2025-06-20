import React, { useEffect, useState } from "react";
import { Table, InputNumber, Input, Button, Modal, Select, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBalances, updateWalletBalance } from "../../../redux/Slices/walletSlice";
import Toast from "../../../services/toast";

const { Title } = Typography;
const { Option } = Select;

const AdminWalletManager = () => {
  const dispatch = useDispatch();
  const { balances, loading } = useSelector((state) => state.wallet);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("credit");

  useEffect(() => {
    dispatch(fetchAllBalances());
  }, [dispatch]);

  const openTopUpModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(
        updateWalletBalance({
          customerId: selectedUser.customer_id,
          amount,
          type,
          description: `Manual ${type} by admin`,
        })
      ).unwrap();

      Toast.success("✅ Wallet updated");
      setIsModalOpen(false);
      setAmount(0);
    } catch (err) {
      Toast.error(err);
    }
  };

  const filteredData = balances.filter((user) =>
    user.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customer_id",
      key: "customer_id",
    },
    {
      title: "Current Balance",
      dataIndex: "balance",
      key: "balance",
      render: (val) => <strong>₹{Number(val).toFixed(2)}</strong>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => openTopUpModal(record)}>
          Update Balance
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Title level={3}>🧾 Admin – Wallet Balance Manager</Title>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="🔍 Search by Customer ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="customer_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={`💰 Update Wallet for ${selectedUser?.customer_id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdateBalance}
        okText="Submit"
        okButtonProps={{ disabled: amount <= 0 }}
      >
        <div className="flex flex-col gap-4">
          <InputNumber
            min={1}
            value={amount}
            onChange={(value) => setAmount(value)}
            placeholder="Enter amount"
            style={{ width: "100%" }}
          />
          <Select value={type} onChange={setType} style={{ width: "100%" }}>
            <Option value="credit">Credit (Add Money)</Option>
            <Option value="debit">Debit (Remove Money)</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default AdminWalletManager;
