import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSingleTrade, createTrade, updateTrade, approveTrade, deactivateTrade } from '../../../redux/Slices/tradeSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import { fetchAllBalances, clearError } from '../../../redux/Slices/walletSlice';
import { Button, Spin, Select, InputNumber, Input, message } from 'antd';
import { ArrowLeftOutlined, DollarOutlined, StockOutlined, NumberOutlined, PercentageOutlined } from '@ant-design/icons';
import { gsap } from 'gsap';
import Toast from '../../../services/toast';

const TradeForm = ({ isCustomer = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { balances, loading: balanceLoading } = useSelector((state) => state.wallet);
  const { single: trade, loading: tradeLoading } = useSelector((state) => state.trade);
  const { all: customers, loading: customerLoading } = useSelector((state) => state.customer);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    customer_id: isCustomer ? user?.id : '',
    stock_name: '',
    buy_price: '',
    buy_quantity: '',
    exit_price: '',
    exit_quantity: '',
    brokerage: '',
    position_call: 'Equity Shares',
    status: 'pending',
  });
  const [quantityWarning, setQuantityWarning] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllBalances());
    if (isEdit) dispatch(fetchSingleTrade(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && trade) {
      setFormData({
        customer_id: trade.customer_id || '',
        stock_name: trade.stock_name || '',
        buy_price: trade.buy_price || '',
        buy_quantity: trade.buy_quantity || '',
        exit_price: trade.exit_price || '',
        exit_quantity: trade.exit_quantity || '',
        brokerage: trade.brokerage || '',
        position_call: trade.position_call || 'Equity Shares',
        status: trade.status || 'pending',
      });
    }
  }, [trade, isEdit]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'exit_quantity' || name === 'buy_quantity') {
      const buyQty = name === 'buy_quantity' ? parseFloat(value || 0) : parseFloat(formData.buy_quantity || 0);
      const exitQty = name === 'exit_quantity' ? parseFloat(value || 0) : parseFloat(formData.exit_quantity || 0);
      setQuantityWarning(exitQty > buyQty);
    }
  };

  const getSelectedCustomerBalance = () =>
    balances.find((bal) => bal.customer_id === formData.customer_id)?.balance || '0.00';

  const validateTrade = () => {
    const { customer_id, stock_name, buy_price, buy_quantity, exit_price, exit_quantity, brokerage, status } = formData;
    if (!customer_id || !stock_name || !buy_price || !buy_quantity || !exit_price || !exit_quantity) {
      message.error('Please fill all required fields');
      return false;
    }
    if (parseFloat(buy_price) <= 0 || parseFloat(buy_quantity) <= 0 || parseFloat(exit_price) <= 0 || parseFloat(exit_quantity) <= 0) {
      message.error('Prices and quantities must be positive');
      return false;
    }
    if (parseFloat(exit_quantity) > parseFloat(buy_quantity)) {
      message.warning('Exit quantity cannot exceed buy quantity');
      return false;
    }
    if (parseFloat(brokerage) < 0) {
      message.error('Brokerage cannot be negative');
      return false;
    }
    if (isEdit && trade?.status === 'hold' && status !== 'approved') {
      message.error('Trade is on hold and must be approved');
      return false;
    }
    return true;
  };

  const handleApproveTrade = async () => {
    try {
      await dispatch(approveTrade(id)).unwrap();
      dispatch(fetchSingleTrade(id));
      dispatch(fetchAllBalances());
      Toast.success('Trade approved successfully');
    } catch (err) {
      Toast.error('Failed to approve trade');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTrade()) return;
    try {
      const tradeData = {
        ...formData,
        created_by: 'admin',
      };
      const action = isEdit
        ? updateTrade({ id, tradeData, navigate })
        : createTrade({ tradeData, navigate });
      await dispatch(action).unwrap();
      navigate(isCustomer ? '/dashboard/trades' : '/admin/trades');
    } catch (err) {
      message.error('Trade submission failed');
    }
  };

  const profitLoss = useMemo(() => {
    const { buy_price, buy_quantity, exit_price, exit_quantity, brokerage } = formData;
    const bp = parseFloat(buy_price || 0);
    const bq = parseFloat(buy_quantity || 0);
    const ep = parseFloat(exit_price || 0);
    const eq = parseFloat(exit_quantity || 0);
    const br = parseFloat(brokerage || 0);

    if (!bp || !bq || !ep || !eq) return null;

    const buyValue = bp * bq;
    const sellValue = ep * eq;
    const pl = sellValue - buyValue - br;

    return {
      value: pl.toFixed(2),
      type: pl > 0 ? 'profit' : pl < 0 ? 'loss' : 'neutral',
    };
  }, [formData]);

  if (tradeLoading || customerLoading || balanceLoading) {
    return <div className="flex justify-center items-center min-h-[200px]"><Spin size="large" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300" onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })} onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}>Back</Button>
          <h2 className="text-2xl font-bold text-indigo-700">{isEdit ? '✏️ Edit Trade' : '📝 Create Trade'}</h2>
        </div>
        {isEdit && trade?.trade_number && <div className="text-sm text-gray-600">Trade No: {trade.trade_number}</div>}
      </div>
      {formData.customer_id && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-700">💰 Balance: ₹{parseFloat(getSelectedCustomerBalance()).toFixed(2)}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700"><StockOutlined className="text-green-500 mr-1" /> Customer ID</label>
          <Select showSearch value={formData.customer_id || undefined} onChange={(value) => handleChange('customer_id', value)} placeholder="Select customer" className="w-full" disabled={isEdit} filterOption={(input, option) => (option.label || '').toLowerCase().includes(input.toLowerCase())}>
            {customers.map((c) => <Select.Option key={c.id} value={c.id} label={`${c.full_name} (ID: ${c.id})`}>{c.full_name} (ID: {c.id})</Select.Option>)}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700"><StockOutlined className="text-green-500 mr-1" /> Stock Name</label>
          <Input value={formData.stock_name} onChange={(e) => handleChange('stock_name', e.target.value)} required placeholder="e.g., TATASTEEL" className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700"><DollarOutlined className="text-blue-500 mr-1" /> Buy Price (₹)</label>
          <InputNumber min={0} value={formData.buy_price} onChange={(value) => handleChange('buy_price', value)} required className="w-full" placeholder="e.g., 350" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700"><NumberOutlined className="text-blue-500 mr-1" /> Buy Quantity</label>
          <InputNumber min={0} value={formData.buy_quantity} onChange={(value) => handleChange('buy_quantity', value)} required className="w-full" placeholder="e.g., 10" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700"><DollarOutlined className="text-red-500 mr-1" /> Exit Price (₹)</label>
          <InputNumber min={0} value={formData.exit_price} onChange={(value) => handleChange('exit_price', value)} required={!isEdit || trade?.status !== 'approved'} className="w-full" placeholder={isEdit && !trade?.exit_price ? 'Not set' : 'e.g., 370'} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700"><NumberOutlined className="text-red-500 mr-1" /> Exit Quantity</label>
          <InputNumber min={0} value={formData.exit_quantity} onChange={(value) => handleChange('exit_quantity', value)} required={!isEdit || trade?.status !== 'approved'} className="w-full" placeholder={isEdit && !trade?.exit_quantity ? 'Not set' : 'e.g., 10'} />
          {quantityWarning && (
            <p className="text-red-500 text-xs mt-1">Exit quantity cannot exceed buy quantity</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1 text-gray-700"><PercentageOutlined className="text-purple-500 mr-1" /> Brokerage (₹)</label>
          <InputNumber min={0} value={formData.brokerage} onChange={(value) => handleChange('brokerage', value)} required className="w-full" placeholder="e.g., 5.00" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1 text-gray-700"><StockOutlined className="text-orange-500 mr-1" /> Trade Type</label>
          <Select value={formData.position_call} onChange={(value) => handleChange('position_call', value)} className="w-full">
            <Select.Option value="Equity Shares">Equity Shares</Select.Option>
            <Select.Option value="Call Option">Call Option</Select.Option>
            <Select.Option value="Put Option">Put Option</Select.Option>
          </Select>
        </div>
        {(!isEdit || (isEdit && trade?.status !== 'approved')) && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-700"><StockOutlined className="text-orange-500 mr-1" /> Trade Status</label>
            <Select value={formData.status} onChange={(value) => handleChange('status', value)} className="w-full" disabled={isCustomer}>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="hold">Hold</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
            </Select>
          </div>
        )}
        {isEdit && trade?.status === 'approved' && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-700"><StockOutlined className="text-orange-500 mr-1" /> Trade Status</label>
            <Input value="Approved" disabled className="w-full" />
          </div>
        )}
        {profitLoss && (
          <div className="sm:col-span-2 text-center text-lg font-semibold mt-4">
            {profitLoss.type === 'profit' && <span className="text-green-600">✅ Profit: ₹{profitLoss.value}</span>}
            {profitLoss.type === 'loss' && <span className="text-red-600">❌ Loss: ₹{profitLoss.value}</span>}
            {profitLoss.type === 'neutral' && <span className="text-gray-500">⚖️ No Gain/Loss</span>}
          </div>
        )}
        <div className="sm:col-span-2 text-center mt-4">
          <Button
            type="primary"
            htmlType="submit"
            disabled={tradeLoading || balanceLoading || customerLoading || quantityWarning}
            loading={tradeLoading}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 w-full"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
          >
            {isEdit ? 'Update Trade' : 'Create Trade'}
          </Button>
        </div>
      </form>
      <p className="text-center text-xs text-gray-500 mt-2">*Disclaimer: Ensure all details (exit price, quantity, brokerage) are accurate before submission. Last updated: 05:21 PM IST, July 22, 2025.</p>
    </div>
  );
};

export default TradeForm;