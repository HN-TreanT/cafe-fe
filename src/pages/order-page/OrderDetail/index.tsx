import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "./OrderDetail.scss"
import ContentOrderDetail from "./ContentOrderDetail/ContentOrderDetail";
import { getCustomer } from "../../../utils/services/customer";
import { useDispatch, useSelector } from "react-redux";
interface props {
  invoice_details: any[],
  setInvoiceDetails: any,
  handleSaveOrder: any
}
const OrderDetail: React.FC<props> = (props) => {
  const {invoice_details, setInvoiceDetails, handleSaveOrder} = props
  const [customer, setCustomer] = useState([])
   const selectedOrder = useSelector((state: any) => state.order.selectedOrder)
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
          { label: `Yêu cầu #${selectedOrder?.id}`, 
          children: <ContentOrderDetail invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails} customers={customer} handleSaveOrder={handleSaveOrder} />,
         key: "1" },
        ]}
        onEdit={onEdit}
      />
    </div>
  );
};

export default OrderDetail;
