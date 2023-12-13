import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "./OrderDetail.scss"
import ContentOrderDetail from "./ContentOrderDetail/ContentOrderDetail";
import { getCustomer } from "../../../utils/services/customer";


const OrderDetail: React.FC = () => {
  const [customer, setCustomer] = useState([])
  const getDataCustomer = () => {
    getCustomer({
      page: 1, 
      size : 10
    }).then((res: any) => {
        if(res.status) {
             if (Array.isArray(res.data.data)) {
              const temp = res.data.data.map((item: any) => {
                return {
                  value: item?.id,
                  label: item.name
                }
              })
              setCustomer(temp)
             }
            
        }
    } ).catch((err: any) => {
      console.log(err)
    })
  }
  const onChange = (key: string) => {
    //console.log(key);
  };
  const onEdit = async () => {
    
  };
  
  useEffect(() => {
    getDataCustomer()
  }, [])
  return (
    <div className="order-detail">
      <Tabs
        type="editable-card"
        onChange={onChange}
        items={[
          { label: "new tab", 
          children: <ContentOrderDetail customers={customer}/>,
         key: "1" },
        ]}
        onEdit={onEdit}
      />
    </div>
  );
};

export default OrderDetail;
