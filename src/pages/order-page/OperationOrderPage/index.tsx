import React from "react";
import { Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faFileInvoiceDollar,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import Product from "./Product/Product";
import TableLocation from "./TableLocation";

const items = [
  
  {
    label: "Mặt hàng",
    key: "product",
    children: <Product />,
    icon: faUtensils,
  },
  {
    label: "Vị trí",
    key: "location",
    children: <TableLocation />,
    icon: faLocationDot,
  },
];

const IconTab = ({ icon, label, children }: any) => (
  <div>
    <FontAwesomeIcon
      style={{ paddingRight: "6px", fontSize: "1rem" }}
      icon={icon}
    />
    <span>{label}</span>
    {children}
  </div>
);
const OperationOrderPage: React.FC = () => {
  

  return (
    <div className="operation-order-page">
      <Tabs
        // onChange={onChange}
        // defaultActiveKey={selectedPage ? selectedPage : "allOrder"}
        // activeKey={"product"}
      >
        {items.map((item) => (
          <Tabs.TabPane
            tab={<IconTab icon={item.icon} label={item.label} />}
            key={item.key}
            className="tab-pane"
          >
            {item.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};
export default OperationOrderPage;
