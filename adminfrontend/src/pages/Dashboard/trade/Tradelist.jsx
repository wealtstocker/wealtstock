import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Button,
  Tag,
  Space,
  Spin,
  Tooltip,
  Empty,
  Input,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { approveTrade, fetchAllTrades } from '../../../redux/Slices/tradeSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { useReactToPrint } from 'react-to-print';

const TradeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableRef = useRef();

  const { all: trades, loading } = useSelector((state) => state.trade);
  const { all: customers } = useSelector((state) => state.customer);

  const [searchTerm, setSearchTerm] = useState('');
// console.log(trades)
  useEffect(() => {
    dispatch(fetchAllTrades());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveTrade(id));
  };

  const getCustomerName = (id) => {
    const customer = customers.find((c) => c.id === id);
    return customer ? customer.full_name : 'Unknown';
  };

  const filteredTrades = trades.filter(async (trade) => {
    const customerName = await getCustomerName(trade?.customer_id)?.toLowerCase();
    const customerId = trade.customer_id.toLowerCase();
    const tradeNo = trade.trade_number.toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      customerName.includes(search) ||
      customerId.includes(search) ||
      tradeNo.includes(search)
    );
  });

  const columns = [
    { title: 'Trade No.', dataIndex: 'trade_number', key: 'trade_number' },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => (
        <div>
          <div className="font-medium text-indigo-700">
            {getCustomerName(record.customer_id)}
          </div>
          <div className="text-sm text-gray-500">ID: {record.customer_id}</div>
        </div>
      ),
    },
    { title: 'Stock Name', dataIndex: 'instrument', key: 'instrument' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'P/L Value',
      key: 'profit_loss',
      render: (_, record) => {
        const isProfit = record.profit_loss === 'profit';
        const amount = parseFloat(record.profit_loss_value).toFixed(2);
        const icon = isProfit ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        const color = isProfit ? 'text-green-600' : 'text-red-600';
        return (
          <span className={`flex items-center gap-1 font-semibold ${color}`}>
            {icon} ₹{amount}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="View Trade">
            <Button
              type="default"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/trades/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Trade">
            <Button
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/trades/edit/${record.id}`)}
            />
          </Tooltip>
          {record.status !== 'approved' && (
            <Tooltip title="Approve Trade">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Trade Report', 14, 10);
    const tableData = filteredTrades.map((item) => [
      item.trade_number,
      getCustomerName(item.customer_id),
      item.customer_id,
      item.instrument,
      item.status,
      item.profit_loss,
      item.profit_loss_value,
      item.buy_price,
      item.buy_quantity,
      item.exit_price,
      item.exit_quantity,
      item.brokerage,
      item.created_at,
    ]);
    doc.autoTable({
      head: [[
        'Trade No', 'Customer', 'Customer ID', 'Instrument', 'Status',
        'P/L', 'P/L Value', 'Buy Price', 'Buy Qty', 'Exit Price',
        'Exit Qty', 'Brokerage', 'Created At']
      ],
      body: tableData,
    });
    doc.save('trades.pdf');
  };

  const handleExportCSV = () => {
    const csvData = filteredTrades.map((item) => ({
      'Trade No': item.trade_number,
      Customer: getCustomerName(item.customer_id),
      'Customer ID': item.customer_id,
      Instrument: item.instrument,
      Status: item.status,
      'P/L': item.profit_loss,
      'P/L Value': item.profit_loss_value,
      'Buy Price': item.buy_price,
      'Buy Quantity': item.buy_quantity,
      'Exit Price': item.exit_price,
      'Exit Quantity': item.exit_quantity,
      Brokerage: item.brokerage,
      'Created At': item.created_at,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'trades.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'Trade Report',
  });

  return (
    <div className="p-4 space-y-4 overflow-x-auto">
      <h2 className="text-2xl font-bold text-indigo-700">All Trades</h2>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <Input.Search
          placeholder="Search by Name, ID or Trade No"
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-w-[200px] max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {/* <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
            Export PDF
          </Button> */}
          <Button icon={<FileExcelOutlined />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          {/* <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            Print
          </Button> */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/trades/create')}
          >
            Add Trade
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : filteredTrades.length === 0 ? (
        <Empty description="No trades found" />
      ) : (
        <div ref={tableRef} className="w-full overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredTrades}
            rowKey="id"
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} trades`,
            }}
            scroll={{ x: 'max-content' }}
            className="min-w-[800px]"
          />
        </div>
      )}
    </div>
  );
};

export default TradeList;