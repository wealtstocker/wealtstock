import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchSingleTrade,
  createTrade,
  updateTrade,
} from '../../../redux/Slices/tradeSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import Toast from '../../../services/toast';
import {
  FiUser, FiDollarSign, FiHash, FiList, FiPercent,
} from 'react-icons/fi';
import {
  Button,
  Spin,
  Select,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

const TradeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

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
    if (isEdit) dispatch(fetchSingleTrade(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isEdit && trade) setFormData(trade);
  }, [trade, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = isEdit
        ? updateTrade({ id, data: formData })
        : createTrade({ ...formData, created_by: 'admin' });

      await dispatch(action).unwrap();
      // Toast.success(`Trade ${isEdit ? 'updated' : 'created'} successfully`);
      navigate('/admin/trades');
    } catch {
      console.log("error")
      // Toast.error('Something went wrong');
    }
  };

  if (isEdit && loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-3">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">
            {isEdit ? '✏️ Edit Trade' : '📝 Create Trade'}
          </h2>
        </div>
        {isEdit && (
          <div className="text-sm text-gray-600">
            Trade Number: <strong>{trade?.trade_number}</strong>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* Customer */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiUser className="inline mr-1" /> Customer
          </label>
          <select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name} ({c.id})
              </option>
            ))}
          </select>
        </div>

        {/* Instrument */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiList className="inline mr-1" /> Instrument
          </label>
          <input
            name="instrument"
            type="text"
            value={formData.instrument}
            onChange={handleChange}
            required
            placeholder="e.g. TATASTEEL"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Buy Price */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiDollarSign className="inline mr-1" /> Buy Price
          </label>
          <input
            name="buy_price"
            type="number"
            value={formData.buy_price}
            onChange={handleChange}
            required
            placeholder="e.g. 350.00"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Buy Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiHash className="inline mr-1" /> Buy Quantity
          </label>
          <input
            name="buy_quantity"
            type="number"
            value={formData.buy_quantity}
            onChange={handleChange}
            required
            placeholder="e.g. 10"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Exit Price */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiDollarSign className="inline mr-1" /> Exit Price
          </label>
          <input
            name="exit_price"
            type="number"
            value={formData.exit_price}
            onChange={handleChange}
            required
            placeholder="e.g. 370.00"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Exit Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            <FiHash className="inline mr-1" /> Exit Quantity
          </label>
          <input
            name="exit_quantity"
            type="number"
            value={formData.exit_quantity}
            onChange={handleChange}
            required
            placeholder="e.g. 10"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Brokerage */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            <FiPercent className="inline mr-1" /> Brokerage
          </label>
          <input
            name="brokerage"
            type="number"
            value={formData.brokerage}
            onChange={handleChange}
            required
            placeholder="e.g. 5.00"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2 text-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {loading ? 'Processing...' : isEdit ? 'Update Trade' : 'Create Trade'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
