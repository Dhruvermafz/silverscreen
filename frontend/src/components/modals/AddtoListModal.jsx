import React from "react";
import { Modal, List, Button, message, Spin } from "antd";
import {
  useGetListsQuery,
  useAddMovieToListMutation,
} from "../../actions/listApi"; // adjust path as needed

const AddToListModal = ({ open, onClose, movie }) => {
  const { data: lists = [], isLoading } = useGetListsQuery(undefined, {
    skip: !open,
  });

  const [addMovieToList, { isLoading: isAdding }] = useAddMovieToListMutation();

  const handleAdd = async (listId) => {
    try {
      await addMovieToList({ listId, movie }).unwrap();
      message.success("Movie added to list");
      onClose();
    } catch (error) {
      console.error("Failed to add movie:", error);
      message.error(error?.data?.message || "Failed to add movie to list");
    }
  };

  return (
    <Modal title="Add to a List" open={open} onCancel={onClose} footer={null}>
      {isLoading ? (
        <Spin />
      ) : (
        <List
          dataSource={lists}
          renderItem={(list) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  loading={isAdding}
                  onClick={() => handleAdd(list._id)}
                >
                  Add
                </Button>,
              ]}
            >
              {list.name}
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default AddToListModal;
