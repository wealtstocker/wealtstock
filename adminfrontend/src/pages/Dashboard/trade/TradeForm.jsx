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
import { FiUser, FiDollarSign, FiHash, FiList, FiPercent } from 'react-icons/fi';

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
    if (isEdit && trade) {
      setFormData(trade);
    }
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
      Toast.success(`Trade ${isEdit ? 'updated' : 'created'} successfully`);
      navigate('/admin/trades');
    } catch (error) {
      Toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-indigo-700">
        📝 {isEdit ? 'Edit Trade' : 'Create Trade'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a customer</option>
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
            placeholder="Stock/Index name"
            value={formData.instrument}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="0.00"
            value={formData.buy_price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="0"
            value={formData.buy_quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="0.00"
            value={formData.exit_price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="0"
            value={formData.exit_quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Brokerage */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            <FiPercent className="inline mr-1" /> Brokerage
          </label>
          <input
            name="brokerage"
            type="number"
            placeholder="0.00"
            value={formData.brokerage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {isEdit ? 'Update Trade' : 'Submit Trade'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
