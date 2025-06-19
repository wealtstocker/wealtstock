import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchSingleTrade,
  createTrade,
  updateTrade,
} from '../../../redux/Slices/tradeSlice';
import Toast from '../../../services/toast';

const TradeForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { single: trade, loading } = useSelector((state) => state.trade);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchSingleTrade(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isEdit && trade) {
      form.setFieldsValue(trade);
    }
  }, [trade, form, isEdit]);

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        await dispatch(updateTrade({ id, data: values })).unwrap();
        Toast.success('Trade updated successfully');
      } else {
        await dispatch(createTrade({ ...values, created_by: 'admin' })).unwrap();
        Toast.success('Trade created successfully');
      }
      navigate('/admin/trades');
    } catch (err) {
      message.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isEdit ? 'Edit Trade' : 'Create Trade'}
      </h2>

      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        className="bg-white !p-6  rounded-xl shadow-md"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="customer_id"
              label="Customer ID"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter customer UUID" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="instrument"
              label="Instrument"
              rules={[{ required: true }]}
            >
              <Input placeholder="Stock/Index name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="buy_price"
              label="Buy Price"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" placeholder="0.00" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="buy_quantity"
              label="Buy Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" placeholder="0" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="exit_price"
              label="Exit Price"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" placeholder="0.00" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="exit_quantity"
              label="Exit Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" placeholder="0" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="brokerage"
              label="Brokerage"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" placeholder="0.00" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? 'Update Trade' : 'Submit Trade'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TradeForm;
