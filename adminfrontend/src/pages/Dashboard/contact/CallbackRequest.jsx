import React, { useEffect } from "react";
import { Table, Button, Tag } from "antd";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
 fetchCallbackRequests,
    deleteCallbackRequest,
} from "../../../redux/Slices/contactCallbackSlice";

const CallbackRequest = () => {
  const dispatch = useDispatch();
  const { callbackRequests, loading } = useSelector((state) => state.contactCallback);

  useEffect(() => {
    dispatch(fetchCallbackRequests());
  }, [dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Callback Request?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCallbackRequest(id));
        Swal.fire("Deleted!", "Callback request deleted.", "success");
      }
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Inquiry Type",
      dataIndex: "inquiry_type",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">📞 Callback Requests</h2>
      <div className="bg-white p-4 rounded-xl shadow">
        <Table
          columns={columns}
          dataSource={callbackRequests}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
};

export default CallbackRequest;
