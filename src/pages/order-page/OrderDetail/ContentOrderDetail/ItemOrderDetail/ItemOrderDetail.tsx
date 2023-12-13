import React from "react";
import { Row, Col, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "./ItemOrderDetail.scss";

const ItemOrderDetail: React.FC<any> = ({ data }) => {
  
  return (
    <div className="item-order-detail">
      <div className="content-item-order-detail">
        <Row gutter={[10, 10]}>
          <Col span={9}>
            <span className="name-product-order-detail">Trà sữa</span>
          </Col>
          <Col span={2}>
            <span
              style={{
                padding: "5px",
                borderRadius: "15px",
                background: "",
                color: "#1677ffbb",
                backgroundColor: "#1677ff42",
              }}
            >
              kg
            </span>
          </Col>
          <Col span={7}>
            <div>
              <MinusCircleOutlined
                className="icon-control-amount"
              />
              <span
                style={{
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  fontWeight: "500",
                  color: "rgba(0, 0, 0, 0.700)",
                }}
              >
                {data?.Amout ? data?.Amout : 1}
              </span>
              <PlusCircleOutlined
                className="icon-control-amount"
              />
            </div>
          </Col>
          <Col span={4}>
            <span style={{ fontWeight: "500" }}>5.000</span>
          </Col>
          <Col span={1}>
            <FontAwesomeIcon
            
              className="icon-delete-order-detail"
              icon={faTrashCan}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ItemOrderDetail;
