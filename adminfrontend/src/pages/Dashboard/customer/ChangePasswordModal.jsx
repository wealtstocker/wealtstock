
const ChangePasswordModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    dispatch(changePassword(values)).then(() => onClose());
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={() => form.submit()} title="🔐 Change Password">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="current_password" label="Current Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="new_password" label="New Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
