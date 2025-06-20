import React, { useEffect, useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Spin,
    Row,
    Col,
    Tooltip,
    Typography,
    Divider,
    Alert,
    Upload,
} from 'antd';
import {
    InfoCircleOutlined,
    UploadOutlined,
    EditOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSiteConfig,
    createSiteConfig,
    updateSiteConfig,
} from '../../redux/Slices/siteConfigSlice';
import Toast from '../../services/toast';

const { Title, Text } = Typography;

const SiteConfigPage = () => {
    const dispatch = useDispatch();
    const { config, loading } = useSelector((state) => state.siteConfig);
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
        }
    }, [config, form]);

    const handleFinish = async (values) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, val]) => {
                if (val) formData.append(key, val);
            });
            if (logoFile) formData.append('logo', logoFile);
            if (qrFile) formData.append('qr_image', qrFile);

            if (isEdit && config.id) {
                await dispatch(updateSiteConfig({ id: config.id, formData })).unwrap();
                Toast.success('Site configuration updated');
            } else {
                await dispatch(createSiteConfig(formData)).unwrap();
                Toast.success('Site configuration created');
            }

            await dispatch(fetchSiteConfig());
            setLogoFile(null);
            setQrFile(null);
        } catch (err) {
            Toast.error(err?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <Title level={3} className="flex items-center gap-2">
                <EditOutlined className="text-blue-500" /> Site Configuration
            </Title>

            <Text type="secondary" className="block mb-6">
                Configure UPI, support contact, and branding details. Fields marked with * are required.
            </Text>

            <Alert
                message="💡 Note"
                description="QR Code and Logo images appear on public pages."
                type="info"
                showIcon
                className="mb-6"
            />

            {loading && !config ? (
                <div className="text-center py-20">
                    <Spin size="large" />
                </div>
            ) : (
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFinish}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <Divider className="md:col-span-2">💳 Payment Details</Divider>

                    <Form.Item
                        label={<span>UPI ID <Text type="danger">*</Text>{' '}<Tooltip title="Your payment UPI ID (e.g. rohit@upi)"><InfoCircleOutlined /></Tooltip></span>}
                        name="upi_id"
                        rules={[{ required: true, message: 'UPI ID is required' }]}
                    >
                        <Input placeholder="example@upi" />
                    </Form.Item>

                    {/* <Form.Item
                        label="UPI Name"
                        name="upi_name"
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input placeholder="UPI Account Holder Name" />
                    </Form.Item> */}

                    <Form.Item
                        label="Site Name"
                        name="site_name"
                        rules={[{ required: true, message: 'Site name is required' }]}
                    >
                        <Input placeholder="Your Website Name" />
                    </Form.Item>

                    <Form.Item label="QR Code Image (Upload)" className="md:col-span-2">
                        <Upload
                            beforeUpload={(file) => {
                                setQrFile(file);
                                return false;
                            }}
                            maxCount={1}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Upload QR Code</Button>
                        </Upload>
                        {config?.qr_image_url && (
                            <img
                                src={config.qr_image_url}
                                alt="QR Code"
                                className="mt-2 w-32 h-32 object-contain border rounded"
                            />
                        )}
                    </Form.Item>

                    <Divider className="md:col-span-2">📞 Contact Details</Divider>

                    <Form.Item
                        label="Support Email"
                        name="support_email"
                        rules={[{ type: 'email', message: 'Enter a valid email' }]}
                    >
                        <Input placeholder="support@example.com" />
                    </Form.Item>

                    <Form.Item label="Support Phone" name="support_phone">
                        <Input placeholder="+91XXXXXXXXXX" />
                    </Form.Item>

                    <Divider className="md:col-span-2">🌐 Website Info</Divider>

                    <Form.Item label="Website Title" name="site_title">
                        <Input placeholder="My Trade App | Fastest Trading Platform" />
                    </Form.Item>

                    <Form.Item
                        label={<span>Support Message <Tooltip title="Displayed to users for support"><InfoCircleOutlined /></Tooltip></span>}
                        name="support_info"
                        className="md:col-span-2"
                    >
                        <Input.TextArea rows={4} placeholder="For help, contact us on WhatsApp or email..." />
                    </Form.Item>

                    <Form.Item label="Logo Image (Upload)" className="md:col-span-2">
                        <Upload
                            beforeUpload={(file) => {
                                setLogoFile(file);
                                return false;
                            }}
                            maxCount={1}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Logo</Button>
                        </Upload>
                        {config?.logo_url && (
                            <img
                                src={config.logo_url}
                                alt="Logo"
                                className="mt-2 w-24 h-24 object-contain border rounded"
                            />
                        )}
                    </Form.Item>

                    <div className="md:col-span-2 text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            size="large"
                            className="px-8"
                        >
                            {isEdit ? 'Update Configuration' : 'Create Configuration'}
                        </Button>
                    </div>
                </Form>
            )}

            {config && Object.keys(config).length > 0 && (
                <Card
                    title={<span className="flex items-center gap-2 text-blue-600"><EyeOutlined className='hover:text-gray-300' /> Current Configuration Preview</span>}
                    className="mt-10 shadow-lg border rounded-lg"
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}><strong>UPI ID:</strong> {config.upi_id || '-'}</Col>
                        {/* <Col xs={24} sm={12}><strong>UPI Name:</strong> {config.upi_name || '-'}</Col> */}
                        <Col xs={24} sm={12}><strong>Support Email:</strong> {config.support_email || '-'}</Col>
                        <Col xs={24} sm={12}><strong>Support Phone:</strong> {config.support_phone || '-'}</Col>
                        <Col xs={24} sm={12}><strong>Site Name:</strong> {config.site_name || '-'}</Col>
                        <Col xs={24} sm={12}><strong>Website Title:</strong> {config.site_title || '-'}</Col>
                        <Col xs={24}><strong>Support Info:</strong><br /><span dangerouslySetInnerHTML={{ __html: config.support_info || '-' }} /></Col>
                        {config.qr_image_url && (
                            <Col xs={24}><strong>QR Code:</strong><br /><img src={config.qr_image_url} alt="QR Code" className="w-40 h-40 object-contain border rounded mt-2" /></Col>
                        )}
                        {config.logo_url && (
                            <Col xs={24}><strong>Logo:</strong><br /><img src={config.logo_url} alt="Logo" className="w-32 h-32 object-contain border rounded mt-2" /></Col>
                        )}
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default SiteConfigPage;