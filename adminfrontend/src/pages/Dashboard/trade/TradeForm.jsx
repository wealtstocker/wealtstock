import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchSingleTrade,
  createTrade,
  updateTrade,
} from '../../../redux/Slices/tradeSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import {
  fetchAllBalances,
  clearError,
} from '../../../redux/Slices/walletSlice';
import { Button, Spin, Select, InputNumber, Input, Alert, Tooltip } from 'antd';
import { ArrowLeftOutlined, DollarOutlined, StockOutlined, NumberOutlined, PercentageOutlined } from '@ant-design/icons';
import Toast from '../../../services/toast';

const TradeForm = ({ isCustomer = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { balances, loading: balanceLoading, error: walletError } = useSelector((state) => state.wallet);
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
    brokerage: isCustomer ? 0 : '',
  });

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
      });
    }
  }, [trade, isEdit]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSelectedCustomerBalance = () => {
    const balanceObj = balances.find((bal) => bal.customer_id === formData.customer_id);
    return balanceObj ? parseFloat(balanceObj.balance).toFixed(2) : '0.00';
  };

  const validateTrade = () => {
    const { customer_id, stock_name, buy_price, buy_quantity, exit_price, exit_quantity, brokerage } = formData;
    if (!customer_id || !stock_name || !buy_price || !buy_quantity || !exit_price || !exit_quantity) {
      Toast.error('All required fields must be filled');
      return false;
    }
    if (parseFloat(buy_price) <= 0 || parseFloat(buy_quantity) <= 0 || parseFloat(exit_price) <= 0 || parseFloat(exit_quantity) <= 0) {
      Toast.error('Price and quantity must be positive numbers');
      return false;
    }
    if (parseFloat(exit_quantity) > parseFloat(buy_quantity)) {
      Toast.error('Exit quantity cannot exceed buy quantity');
      return false;
    }
    if (!isCustomer && parseFloat(brokerage) < 0) {
      Toast.error('Brokerage cannot be negative');
      return false;
    }
    const buyValue = parseFloat(buy_price) * parseFloat(buy_quantity);
    const balance = parseFloat(getSelectedCustomerBalance());
    if (!isEdit && buyValue + parseFloat(brokerage || 0) > balance) {
      Toast.error('Insufficient balance for this trade');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTrade()) return;
    try {
      const action = isEdit
        ? updateTrade({ id, data: formData })
        : createTrade({ ...formData, created_by: isCustomer ? 'customer' : 'admin' });
      await dispatch(action).unwrap();
      await dispatch(fetchAllBalances());
      navigate(isCustomer ? '/customer/trades' : '/admin/trades');
      Toast.success(isEdit ? 'Trade updated successfully' : 'Trade created successfully');
    } catch (err) {
      Toast.error('Trade submission failed');
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
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
            {isEdit ? '✏️ Edit Trade' : isCustomer ? '📝 Hold Trade' : '📝 Create Trade'}
          </h2>
        </div>
        {isEdit && trade?.trade_number && (
          <div className="text-sm text-gray-600">
            Trade Number: <strong>{trade.trade_number}</strong>
          </div>
        )}
      </div>

      {walletError && (
        <Alert
          message="Error"
          description={walletError}
          type="error"
          showIcon
          closable
          className="mb-6"
          onClose={() => dispatch(clearError())}
        />
      )}

      {formData.customer_id && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-700">
            💰 Balance for {customers.find((c) => c.id === formData.customer_id)?.full_name || formData.customer_id}:{' '}
            <span className="text-blue-700 font-bold">₹{getSelectedCustomerBalance()}</span>
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            <StockOutlined className="mr-1" /> Customer
          </label>
          <Select
            showSearch
            optionFilterProp="children"
            value={formData.customer_id || undefined}
            onChange={(value) => handleChange('customer_id', value)}
            placeholder="Select customer"
            className="w-full"
            disabled={isCustomer || isEdit}
            loading={customerLoading}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {customers.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.full_name} (ID: {c.id})
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            <StockOutlined className="mr-1" /> Stock Name
          </label>
          <Input
            value={formData.stock_name}
            onChange={(e) => handleChange('stock_name', e.target.value)}
            required
            placeholder="e.g. TATASTEEL"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            <DollarOutlined className="mr-1" /> Buy Price
          </label>
          <InputNumber
            min={0}
            value={formData.buy_price}
            onChange={(value) => handleChange('buy_price', value)}
            required
            className="w-full"
            placeholder="e.g. 350"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            <NumberOutlined className="mr-1" /> Buy Quantity
          </label>
          <InputNumber
            min={0}
            value={formData.buy_quantity}
            onChange={(value) => handleChange('buy_quantity', value)}
            required
            className="w-full"
            placeholder="e.g. 10"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            <DollarOutlined className="mr-1" /> Exit Price
          </label>
          <InputNumber
            min={0}
            value={formData.exit_price}
            onChange={(value) => handleChange('exit_price', value)}
            required
            className="w-full"
            placeholder="e.g. 370"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            <NumberOutlined className="mr-1" /> Exit Quantity
          </label>
          <InputNumber
            min={0}
            max={formData.buy_quantity}
            value={formData.exit_quantity}
            onChange={(value) => handleChange('exit_quantity', value)}
            required
            className="w-full"
            placeholder="e.g. 10"
          />
        </div>

        {!isCustomer && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              <PercentageOutlined className="mr-1" /> Brokerage
            </label>
            <InputNumber
              min={0}
              value={formData.brokerage}
              onChange={(value) => handleChange('brokerage', value)}
              required
              className="w-full"
              placeholder="e.g. 5.00"
            />
          </div>
        )}

        {profitLoss && (
          <div className="sm:col-span-2 text-center text-lg font-semibold mt-4">
            {profitLoss.type === 'profit' && (
              <span className="text-green-600">✅ Profit: ₹{profitLoss.value}</span>
            )}
            {profitLoss.type === 'loss' && (
              <span className="text-red-600">❌ Loss: ₹{profitLoss.value}</span>
            )}
            {profitLoss.type === 'neutral' && (
              <span className="text-gray-500">⚖️ No Gain or Loss</span>
            )}
          </div>
        )}

        <div className="sm:col-span-2 text-center mt-4">
          <Tooltip title={isEdit ? 'Update this trade' : 'Create a new trade'}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={tradeLoading || balanceLoading || customerLoading}
              loading={tradeLoading}
            >
              {isEdit ? 'Update Trade' : isCustomer ? 'Hold Trade' : 'Create Trade'}
            </Button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;