import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Tag, Spin, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTransactions } from '../../../redux/Slices/balanceSlice';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Option } = Select;

const AdminTransactionList = () => {
  const dispatch = useDispatch();
  const { transactions, loadingTransactions } = useSelector((state) => state.balance);

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [transactions, search, typeFilter, statusFilter]);

  const filterData = () => {
    let data = [...transactions];

    if (search) {
      data = data.filter(
        (t) =>
          t.customer_id.toLowerCase().includes(search.toLowerCase()) ||
          t.customer_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      data = data.filter((t) => t.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      data = data.filter((t) => t.status === statusFilter);
    }

    setFilteredData(data);
  };

  const exportToExcel = () => {
    const exportData = filteredData.map((t) => ({
      CustomerID: t.customer_id,
      CustomerName: t.customer_name,
      Type: t.type,
      Status: t.status,
      Amount: t.amount,
      Description: t.description,
      Date: new Date(t.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, 'Transactions.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction List', 14, 14);
    const tableColumn = ['Customer ID', 'Name', 'Type', 'Status', 'Amount', 'Description', 'Date'];
    const tableRows = [];

    filteredData.forEach((t) => {
      tableRows.push([
        t.customer_id,
        t.customer_name,
        t.type.toUpperCase(),
        t.status.toUpperCase(),
        `₹${parseFloat(t.amount).toFixed(2)}`,
        t.description,
        new Date(t.created_at).toLocaleString('en-IN'),
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Transactions.pdf');
  };

  const columns = [
    {
      title: 'S/N',
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer_name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type) => (
        <Tag color={type === 'credit' ? 'green' : 'red'}>{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
      render: (amount) => `₹${parseFloat(amount).toFixed(2)}`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) =>
        new Date(date).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white rounded shadow-sm min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-indigo-700">📒 All Transactions</h2>

        <div className="flex gap-2 hover:bg-gray-100">
          <Button icon={<DownloadOutlined />} onClick={exportToExcel}>
            Export Excel
          </Button>
          {/* <Button icon={<DownloadOutlined />} onClick={exportToPDF}>
            Export PDF
          </Button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="🔍 Search by ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Select value={typeFilter} onChange={(value) => setTypeFilter(value)} className="w-full">
          <Option value="all">All Types</Option>
          <Option value="credit">Credit</Option>
          <Option value="debit">Debit</Option>
        </Select>
        <Select value={statusFilter} onChange={(value) => setStatusFilter(value)} className="w-full">
          <Option value="all">All Status</Option>
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
        </Select>
      </div>

      {loadingTransactions ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      )}
    </div>
  );
};

export default AdminTransactionList;
