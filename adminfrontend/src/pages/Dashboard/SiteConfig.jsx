
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Upload,
} from 'antd';
import { UploadOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  fetchSiteConfig,
  createSiteConfig,
  updateSiteConfig,
  deleteSiteConfig,
  clearSiteConfig,
} from '../../redux/Slices/siteConfigSlice';
import Toast from '../../services/toast';

const { Title, Text } = Typography;

const SiteConfigPage = () => {
  const dispatch = useDispatch();
  const { config, loading, error } = useSelector((state) => state.siteConfig);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);

  useEffect(() => {
    dispatch(fetchSiteConfig());
  }, [dispatch]);

  useEffect(() => {
    if (config && Object.keys(config).length) {
      form.setFieldsValue(config);
      setIsEdit(true);
    } else {
      setIsEdit(false);
      form.resetFields();
    }
  }, [config, form]);

  const validateFile = (file) => {
    const isImage = ['image/png', 'image/jpeg'].includes(file.type);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      Toast.error('Only PNG or JPEG files are allowed');
      return false;
    }
    if (!isLt2M) {
      Toast.error('File size must be less than 2MB');
      return false;
    }
    return true;
  };

  const handleFinish = async (values) => {
    if (!isEdit && !qrFile) {
      Toast.error('QR Code image is required');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      if (logoFile) formData.append('logo', logoFile);
      if (qrFile) formData.append('qr_image', qrFile);

      if (isEdit && config?.id) {
        await dispatch(updateSiteConfig({ id: config.id, formData })).unwrap();
        Toast.success('Configuration updated');
      } else {
        await dispatch(createSiteConfig(formData)).unwrap();
        Toast.success('Configuration created');
      }

      await dispatch(fetchSiteConfig());
      setLogoFile(null);
      setQrFile(null);
      form.resetFields();
    } catch (err) {
      Toast.error(err?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!config?.id) return;
    try {
      await dispatch(deleteSiteConfig(config.id)).unwrap();
      Toast.success('Configuration deleted');
      form.resetFields();
      dispatch(clearSiteConfig());
    } catch (err) {
      Toast.error(err?.message || 'Failed to delete configuration');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Title level={3} className="flex items-center gap-2 text-indigo-700 mb-6">
        <EditOutlined /> Site Configuration
      </Title>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-6"
          onClose={() => dispatch(clearSiteConfig())}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          className="bg-white !p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Divider className="md:col-span-2">Payment Details</Divider>

          <Form.Item
            label={<span>UPI ID <Text type="danger">*</Text></span>}
            name="upi_id"
            rules={[{ required: true, message: 'UPI ID is required' }]}
          >
            <Input placeholder="example@upi" />
          </Form.Item>

          <Form.Item
            label={<span>Site Name <Text type="danger">*</Text></span>}
            name="site_name"
            rules={[{ required: true, message: 'Site name is required' }]}
          >
            <Input placeholder="Your Website Name" />
          </Form.Item>

          <Form.Item label="QR Code Image" className="md:col-span-2">
            <Upload
              beforeUpload={(file) => {
                if (validateFile(file)) {
                  setQrFile(file);
                }
                return false;
              }}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload QR Code</Button>
            </Upload>
            {qrFile && <Text className="mt-2 block">{qrFile.name}</Text>}
            {config?.qr_image_url && (
              <img
                src={config.qr_image_url}
                alt="QR Code"
                className="mt-2 w-32 h-32 object-contain border rounded"
              />
            )}
          </Form.Item>

          <Divider className="md:col-span-2">Contact Details</Divider>

          <Form.Item
            label="Support Email"
            name="support_email"
            rules={[{ type: 'email', message: 'Enter a valid email' }]}
          >
            <Input placeholder="support@example.com" />
          </Form.Item>

          <Form.Item
            label="Support Phone"
            name="support_phone"
            rules={[{ pattern: /^\+?\d{10,12}$/, message: 'Enter a valid phone number' }]}
          >
            <Input placeholder="+91XXXXXXXXXX" />
          </Form.Item>

          <Divider className="md:col-span-2">Website Info</Divider>

          <Form.Item label="Website Title" name="site_title">
            <Input placeholder="My Trade App" />
          </Form.Item>

          <Form.Item label="Support Message" name="support_info" className="md:col-span-2">
            <Input.TextArea rows={4} placeholder="Contact us for support..." />
          </Form.Item>

          <Form.Item label="Logo Image" className="md:col-span-2">
            <Upload
              beforeUpload={(file) => {
                if (validateFile(file)) {
                  setLogoFile(file);
                }
                return false;
              }}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
            {logoFile && <Text className="mt-2 block">{logoFile.name}</Text>}
            {config?.logo_url && (
              <img
                src={config.logo_url}
                alt="Logo"
                className="mt-2 w-24 h-24 object-contain border rounded"
              />
            )}
          </Form.Item>

          <div className="md:col-span-2 flex justify-between">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={submitting || loading || !isEdit}
            >
              Delete
            </Button>
            <div>""</div>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="large"
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      )}

      {config && Object.keys(config).length > 0 && (
        <Card
          title={
            <span className="flex items-center gap-2 text-indigo-700">
              <EyeOutlined /> Configuration Preview
            </span>
          }
          className="mt-6 shadow-lg border rounded-lg"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}><strong>UPI ID:</strong> {config.upi_id || '-'}</Col>
            <Col xs={24} sm={12}><strong>Site Name:</strong> {config.site_name || '-'}</Col>
            <Col xs={24} sm={12}><strong>Support Email:</strong> {config.support_email || '-'}</Col>
            <Col xs={24} sm={12}><strong>Support Phone:</strong> {config.support_phone || '-'}</Col>
            <Col xs={24} sm={12}><strong>Website Title:</strong> {config.site_title || '-'}</Col>
            <Col xs={24}><strong>Support Info:</strong> {config.support_info || '-'}</Col>
            {config.qr_image_url && (
              <Col xs={24}>
                <strong>QR Code:</strong>
                <img src={config.qr_image_url} alt="QR Code" className="mt-2 w-40 h-40 object-contain border rounded" />
              </Col>
            )}
            {config.logo_url && (
              <Col xs={24}>
                <strong>Logo:</strong>
                <img src={config.logo_url} alt="Logo" className="mt-2 w-32 h-32 object-contain border rounded" />
              </Col>
            )}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default SiteConfigPage;