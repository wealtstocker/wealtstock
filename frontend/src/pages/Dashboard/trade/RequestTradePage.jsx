import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, InputNumber, Select } from 'antd';
import { createTrade } from '../../../redux/Slices/tradeSlice';
import { gsap } from 'gsap';
import toast from '../../Services/toast';

const RequestTradePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.trade);
  const { user } = useSelector((state) => state.auth);
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [form] = Form.useForm();
  const [averageValue, setAverageValue] = useState(0);

  const onFinish = async (values) => {
    try {
      const tradeData = {
        ...values,
        customer_id: user?.id || localUser?.id,
        created_by: 'customer',
        exit_price: null,
        exit_quantity: null,
        brokerage: 0,
      };
      await dispatch(createTrade({ tradeData, navigate })).unwrap();
      toast.success('Trade placed! Waiting for admin to approve');
      form.resetFields();
      setAverageValue(0);
      navigate('/dashboard/trades');
    } catch (error) {
      toast.error('Oops! Trade placement failed');
    }
  };

  const handleValuesChange = (changedValues, allValues) => {
    const { buy_price, buy_quantity } = allValues;
    if (buy_price && buy_quantity) {
      setAverageValue((buy_price * buy_quantity).toFixed(2));
    }
  };

  if (!user && !localUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-start">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center">
        📈 Place New Trade Request
      </h2>

      <Card className="w-full max-w-2xl shadow-md rounded-lg overflow-hidden">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={handleValuesChange}
          initialValues={{
            stock_name: '',
            buy_price: undefined,
            buy_quantity: undefined,
            position_call: 'Equity Shares',
          }}
          className="p-6"
        >
          {/* Trade Type */}
          <Form.Item
            label={<span className="text-gray-700">Trade Type <span className="text-red-500">*</span></span>}
            name="position_call"
            rules={[{ required: true, message: 'Please select trade type' }]}
          >
            <Select className="w-full">
              <Select.Option value="Equity Shares">Equity Shares</Select.Option>
              <Select.Option value="Call Option">Call Option</Select.Option>
              <Select.Option value="Put Option">Put Option</Select.Option>
            </Select>
          </Form.Item>

          {/* Stock Name */}
          <Form.Item
            label={<span className="text-gray-700">Stock Name <span className="text-red-500">*</span></span>}
            name="stock_name"
            rules={[{ required: true, message: 'Please enter stock name' }]}
          >
            <Input placeholder="e.g., RELIANCE" className="w-full" />
          </Form.Item>

          {/* Buy Price */}
          <Form.Item
            label={<span className="text-gray-700">Buy Price (₹) <span className="text-red-500">*</span></span>}
            name="buy_price"
            rules={[{ required: true, message: 'Please enter buy price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="w-full"
              placeholder="e.g., 350"
            />
          </Form.Item>

          {/* Buy Quantity */}
          <Form.Item
            label={<span className="text-gray-700">Buy Quantity <span className="text-red-500">*</span></span>}
            name="buy_quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber
              min={1}
              step={1}
              className="w-full"
              placeholder="e.g., 10"
            />
          </Form.Item>

          {/* Average Value */}
          {averageValue > 0 && (
            <div className="text-green-600 font-semibold text-center mb-4">
              Total Value: ₹{averageValue}
            </div>
          )}

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            >
              Submit Trade Request
            </Button>
          </Form.Item>
        </Form>

        {/* Note */}
        <p className="text-center text-gray-500 text-sm mt-2 animate-pulse">
          Note: For any details about this trade, contact your brokerage agent.
        </p>
      </Card>
    </div>
  );
};

export default RequestTradePage;
