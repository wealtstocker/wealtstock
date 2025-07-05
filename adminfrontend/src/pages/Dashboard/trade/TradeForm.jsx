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
  FiUser,
  FiDollarSign,
  FiHash,
  FiList,
  FiPercent,
} from 'react-icons/fi';
import { Button, Spin, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchAllBalances } from '../../../redux/Slices/balanceSlice';

const TradeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { balances, loading: balanceLoading } = useSelector((state) => state.balance);
  const { single: trade, loading } = useSelector((state) => state.trade);
  const { all: customers } = useSelector((state) => state.customer);

  const [formData, setFormData] = useState({
    customer_id: '',
    instrument: '',
    buy_price: '',
    buy_quantity: '',
    exit_price: '',
    exit_quantity: '',
    brokerage: '',
  });

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllBalances());
    if (isEdit) dispatch(fetchSingleTrade(id));
  }, [dispatch, id, isEdit]);
  const getSelectedCustomerBalance = () => {
    const balanceObj = balances.find((bal) => bal.customer_id === formData.customer_id);
    return balanceObj ? parseFloat(balanceObj.balance).toFixed(2) : '0.00';
  };

  useEffect(() => {
    if (isEdit && trade) {
      setFormData({
        customer_id: trade.customer_id || '',
        instrument: trade.instrument || '',
        buy_price: trade.buy_price || '',
        buy_quantity: trade.buy_quantity || '',
        exit_price: trade.exit_price || '',
        exit_quantity: trade.exit_quantity || '',
        brokerage: trade.brokerage || '',
      });
    }
  }, [trade, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      customer_id: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData,', formData)
    const buyQ = parseFloat(formData.buy_quantity || 0);
    const exitQ = parseFloat(formData.exit_quantity || 0);

    if (exitQ > buyQ) {
      return alert("❌ Exit quantity cannot be greater than buy quantity");
    }
    try {
      const action = isEdit
        ? updateTrade({ id, data: formData })
        : createTrade({ ...formData, created_by: 'admin' });

      await dispatch(action).unwrap();
      navigate('/admin/trades');
    } catch (err) {
      console.error('❌ Trade submission failed', err);
    }
  };

  const profitLoss = useMemo(() => {
    const {
      buy_price,
      buy_quantity,
      exit_price,
      exit_quantity,
      brokerage,
    } = formData;

    const bp = parseFloat(buy_price || 0);
    const bq = parseFloat(buy_quantity || 0);
    const ep = parseFloat(exit_price || 0);
    const eq = parseFloat(exit_quantity || 0);
    const br = parseFloat(brokerage || 0);

    const buyValue = bp * bq;
    const sellValue = ep * eq;
    const pl = sellValue - buyValue - br;

    if (!bp || !bq || !ep || !eq) return null;

    return {
      value: pl.toFixed(2),
      type: pl > 0 ? 'profit' : pl < 0 ? 'loss' : 'neutral',
    };
  }, [formData]);

  if (isEdit && loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-3">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">
            {isEdit ? '✏️ Edit Trade' : '📝 Create Trade'}
          </h2>
        </div>
        {isEdit && trade?.trade_number && (
          <div className="text-sm text-gray-600">
            Trade Number: <strong>{trade.trade_number}</strong>
          </div>
        )}
      </div>
      {formData.customer_id && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-md shadow-sm">
          <p className="text-sm text-gray-700 font-semibold">
            💰 Balance for {customers.find((c) => c.id === formData.customer_id)?.full_name || formData.customer_id}:{' '}
            <span className="text-blue-700">₹ {getSelectedCustomerBalance()}</span>
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* Customer */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiUser className="inline mr-1" /> Customer
          </label>
          <Select
            showSearch
            optionFilterProp="children"
            value={formData.customer_id || undefined}
            onChange={handleCustomerChange}
            placeholder="Select customer"
            className="w-full"
            filterOption={(input, option) =>
              option?.children
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {customers.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.full_name} ({c.id})
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Instrument */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiList className="inline mr-1" /> Stock Name
          </label>
          <input
            type="text"
            name="instrument"
            value={formData.instrument}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. TATASTEEL"
          />
        </div>

        {/* Buy Price */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiDollarSign className="inline mr-1" /> Buy Price
          </label>
          <input
            type="number"
            name="buy_price"
            value={formData.buy_price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. 350"
          />
        </div>

        {/* Buy Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiHash className="inline mr-1" /> Buy Quantity
          </label>
          <input
            type="number"
            name="buy_quantity"
            value={formData.buy_quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. 10"
          />
        </div>

        {/* Exit Price */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiDollarSign className="inline mr-1" /> Exit Price
          </label>
          <input
            type="number"
            name="exit_price"
            value={formData.exit_price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. 370"
          />
        </div>

        {/* Exit Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiHash className="inline mr-1" /> Exit Quantity
          </label>
          <input
            type="number"
            name="exit_quantity"
            value={formData.exit_quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. 10"
          />
        </div>

        {/* Brokerage */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            <FiPercent className="inline mr-1" /> Brokerage
          </label>
          <input
            type="number"
            name="brokerage"
            value={formData.brokerage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. 5.00"
          />
        </div>

        {/* P/L Display */}
        {profitLoss && (
          <div className="sm:col-span-2 text-center text-lg font-semibold mt-4">
            {profitLoss.type === 'profit' && (
              <span className="text-green-600">
                ✅ Profit: ₹{profitLoss.value}
              </span>
            )}
            {profitLoss.type === 'loss' && (
              <span className="text-red-600">
                ❌ Loss: ₹{profitLoss.value}
              </span>
            )}
            {profitLoss.type === 'neutral' && (
              <span className="text-gray-500">No Gain or Loss</span>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="sm:col-span-2 text-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {loading
              ? 'Processing...'
              : isEdit
                ? 'Update Trade'
                : 'Create Trade'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
