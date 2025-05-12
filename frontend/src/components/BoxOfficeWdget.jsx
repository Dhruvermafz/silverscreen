import React, { useEffect, useState } from "react";
import { Card, List, Spin } from "antd";

// Mock API call for box office data
const fetchBoxOfficeData = async () => {
  // Replace with actual API call
  return [
    { title: "Movie A", collection: "$150M", trend: "up" },
    { title: "Movie B", collection: "$120M", trend: "down" },
    { title: "Movie C", collection: "$90M", trend: "up" },
  ];
};

const BoxOfficeWidget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoxOfficeData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <Card title="Box Office Collections" style={{ marginBottom: 16 }}>
      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <span>{item.title}</span>
              <span>{item.collection}</span>
              <span>{item.trend === "up" ? "↑" : "↓"}</span>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default BoxOfficeWidget;
