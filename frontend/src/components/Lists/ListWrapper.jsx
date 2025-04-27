import React, { useState } from "react";
import { List, Card, Button, Modal, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
} from "../../actions/listApi";
const { Meta } = Card;

const ListComponent = () => {
  const { data: lists = [], refetch } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const [deleteList] = useDeleteListMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleCreateList = async () => {
    try {
      if (!newListName.trim()) {
        message.warning("List name cannot be empty.");
        return;
      }
      await createList({ name: newListName }).unwrap();
      setNewListName("");
      setIsModalVisible(false);
      refetch();
      message.success("List created successfully!");
    } catch (error) {
      message.error("Failed to create list.");
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteList(id).unwrap();
      refetch();
      message.success("List deleted successfully!");
    } catch (error) {
      message.error("Failed to delete list.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        Create New List
      </Button>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={lists}
        renderItem={(item) => (
          <List.Item>
            <Card
              actions={[
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteList(item._id)}
                />,
              ]}
            >
              <Meta
                title={item.name}
                description={`${item.movies.length} movies`}
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Create New List"
        visible={isModalVisible}
        onOk={handleCreateList}
        onCancel={() => setIsModalVisible(false)}
        okText="Create"
      >
        <Input
          placeholder="Enter list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ListComponent;
