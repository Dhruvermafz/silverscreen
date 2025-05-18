import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { FaArrowUp, FaArrowDown, FaSpinner } from "react-icons/fa";

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
    <Card className="box-office-widget mb-4">
      <Card.Header>Box Office Collections</Card.Header>
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div className="box-office-list">
            {data.map((item, index) => (
              <div
                key={index}
                className="box-office-item d-flex justify-content-between align-items-center py-2 border-bottom"
              >
                <span>{item.title}</span>
                <span>{item.collection}</span>
                <span>
                  {item.trend === "up" ? (
                    <FaArrowUp className="text-success" />
                  ) : (
                    <FaArrowDown className="text-danger" />
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default BoxOfficeWidget;
