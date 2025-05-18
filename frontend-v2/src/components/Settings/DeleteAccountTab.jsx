import React from "react";
import { Button, Modal } from "react-bootstrap";

const DeleteAccountTab = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDeleteAccount,
}) => {
  return (
    <>
      <p className="text-danger">
        This action is irreversible. All your data will be permanently deleted.
      </p>
      <Button
        variant="danger"
        className="w-100"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        Delete My Account
      </Button>
      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteAccountTab;
