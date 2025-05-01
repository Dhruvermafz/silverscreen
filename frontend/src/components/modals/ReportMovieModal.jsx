import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";

const ReportMovieModal = ({ open, onClose, movieId, movieTitle }) => {
  const [reason, setReason] = useState("");

  const handleReport = async () => {
    await axios.post("/api/report", { movieId, reason });
    message.success("Movie reported");
    setReason("");
    onClose();
  };

  return (
    <Modal
      title={`Report "${movieTitle}"`}
      open={open}
      onCancel={onClose}
      onOk={handleReport}
      okButtonProps={{ danger: true }}
      okText="Report"
    >
      <Input.TextArea
        placeholder="Tell us what’s wrong"
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
};

export default ReportMovieModal;
