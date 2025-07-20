import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card, InputNumber } from 'antd';
import { createTrade } from '../../../redux/Slices/tradeSlice';

const RequestTradePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.trade);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const tradeData = {
        ...values,
        created_by: 'customer', // Mark as customer-created trade
      };
      await dispatch(createTrade({ tradeData, navigate })).unwrap();
      message.success('Trade placed successfully and is pending approval');
      form.resetFields();
      navigate('/dashboard/trades');
    } catch (error) {
      message.error(error.message || 'Failed to place trade');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        📈 Place New Trade
      </h2>
      
      <Card className="max-w-2xl mx-auto shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            customer_id: '', // You might want to prefill this with the logged-in user's ID
            stock_name: '',
            buy_price: undefined,
            buy_quantity: undefined,
            exit_price: undefined,
            exit_quantity: undefined,
            brokerage: 0,
          }}
        >
          <Form.Item
            label="Customer ID"
            name="customer_id"
            rules={[{ required: true, message: 'Please enter customer ID' }]}
          >
            <Input placeholder="Enter customer ID" />
          </Form.Item>

          <Form.Item
            label="Stock Name"
            name="stock_name"
            rules={[{ required: true, message: 'Please enter stock name' }]}
          >
            <Input placeholder="Enter stock name (e.g., RELIANCE)" />
          </Form.Item>

          <Form.Item
            label="Buy Price"
            name="buy_price"
            rules={[{ required: true, message: 'Please enter buy price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="w-full"
              placeholder="Enter buy price"
            />
          </Form.Item>

          <Form.Item
            label="Buy Quantity"
            name="buy_quantity"
            rules={[{ required: true, message: 'Please enter buy quantity' }]}
          >
            <InputNumber
              min={1}
              step={1}
              className="w-full"
              placeholder="Enter buy quantity"
            />
          </Form.Item>

          <Form.Item
            label="Exit Price"
            name="exit_price"
            rules={[{ required: true, message: 'Please enter exit price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="w-full"
              placeholder="Enter exit price"
            />
          </Form.Item>

          <Form.Item
            label="Exit Quantity"
            name="exit_quantity"
            rules={[{ required: true, message: 'Please enter exit quantity' }]}
          >
            <InputNumber
              min={1}
              step={1}
              className="w-full"
              placeholder="Enter exit quantity"
            />
          </Form.Item>

          <Form.Item
            label="Brokerage"
            name="brokerage"
            rules={[{ required: true, message: 'Please enter brokerage amount' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="w-full"
              placeholder="Enter brokerage amount"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full"
            >
              Place Trade
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RequestTradePage;