import React, { useEffect } from "react";
import { Table, Button } from "antd";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchContactMessages,
  deleteContactMessage,
} from "../../../redux/Slices/contactCallbackSlice";
const ContactMessages = () => {
  const dispatch = useDispatch();
  const { contactMessages, loading } = useSelector((state) => state.contactCallback);

  useEffect(() => {
    dispatch(fetchContactMessages());
  }, [dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteContactMessage(id));
        Swal.fire("Deleted!", "Contact message has been deleted.", "success");
      }
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Message", dataIndex: "message" },
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
      <h2 className="text-2xl font-bold mb-6">📨 Contact Messages</h2>
      <div className="bg-white p-4 rounded-xl shadow">
        <Table
          columns={columns}
          dataSource={contactMessages}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
};

export default ContactMessages;
