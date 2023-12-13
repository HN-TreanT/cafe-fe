import React, { useEffect, useState } from "react";
import { Col, MenuProps, Row, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux";
import OrderDetail from "./OrderDetail";
import OperationOrderPage from './OperationOrderPage'
import useAction from "../../redux/useActions";

import "./OrderPage.scss";

const OrderPage: React.FC = () => {
 
  const items: MenuProps["items"] = [
    {
      label: (
        <div>
          <UserOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }}
            
          />
          <span style={{ fontWeight: "500" }}>Tài khoản</span>
        </div>
      ),
      key: "detailUser",
    },
    {
      label: (
        <div>
          <LogoutOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }}
           
          />
          <span style={{ fontWeight: "500" }}>Đăng xuất</span>
        </div>
      ),
      key: "logout",
      // onClick: handleLogout,
    },
  ];

  return (
    <div className="order-page">
      <div className="content-order-page">
        <Row gutter={[20, 20]}>
          <Col span={15}>
            <OperationOrderPage />
          </Col>
          <Col span={9}>
            <OrderDetail />
          </Col>
        </Row>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="user-order-page">
            <span className="name-user-order-page">Hoàng Nam</span>
            <UserOutlined className="icon-user-order-page"  />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
export default OrderPage;
