import React, { useEffect, useState } from "react";
import { Modal, List, Button, message } from "antd";
import axios from "axios";

const RecommendToUserModal = ({ open, onClose, movieId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      axios.get("/api/users").then((res) => setUsers(res.data));
    }
  }, [open]);

  const handleRecommend = async (userId) => {
    await axios.post(`/api/recommend`, { userId, movieId });
    message.success("Movie recommended!");
    onClose();
  };

  return (
    <Modal
      title="Recommend to a User"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <List
        dataSource={users}
        renderItem={(user) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleRecommend(user._id)}>
                Recommend
              </Button>,
            ]}
          >
            {user.username}
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default RecommendToUserModal;
