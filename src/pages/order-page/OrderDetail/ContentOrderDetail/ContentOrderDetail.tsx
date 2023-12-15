import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal, Tooltip, Select, Form, message } from "antd";
import "./ContentOrderDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill1Wave,
  faUtensils,
  faSquareCheck,
  faBan,
  faFolderMinus,
  faDownLeftAndUpRightToCenter,
  faArrowsLeftRightToLine

} from "@fortawesome/free-solid-svg-icons";
import ItemOrderDetail from "./ItemOrderDetail/ItemOrderDetail";
import { tableServices } from "../../../../utils/services/tableServices";
import { getCustomer } from "../../../../utils/services/customer";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../../../utils/helper/convertPrice";
import { invoiceServices } from "../../../../utils/services/invoiceService";
import useAction from "../../../../redux/useActions";


interface UserValue {
  value: any,
  label: any
}
async function fetchCustomer(search: string): Promise<UserValue[]> {
  return getCustomer( {
      page : 1,
      size : 10,
      ...(search && search !== "" && {search : search})
    }
  ).then((res) => {
   
    if(res.status) {
        const temp = res?.data?.data.map((item: any) => {
          return {
            label: item?.id,
            value: item?.name
          }
      })
      return temp
    }else {
      return []
    }
    
  }).catch((err :any) => console.log(err))
}
interface props {
  customers: any[],
  invoice_details: any[],
  setInvoiceDetails: any,
  handleSaveOrder: any,
}



const ContentOrderDetail = (props: props) => {
  const [form] = Form.useForm()
  const {customers, invoice_details, setInvoiceDetails, handleSaveOrder} = props
  const [messageApi, contextHolder] = message.useMessage();

  const [isOpenModalCancleOrder, setIsOpenCancleOrder] = useState(false);
  const [tables, setTables] = useState([])
  const [data, setData] = useState([])
  const selectedOrder = useSelector((state:any) => state.order.selectedOrder)
  const dispatch = useDispatch()
  const actions = useAction()


  const getTable = () => {
    tableServices.get({
      page: 1,
      size : 100,
      // status: 0
    }).then((res: any) => {
       if(res.status) {
          if(Array.isArray(res.data.data)) {
            const temp = res.data.data.map((item: any) => {
              return {
                ...item,
                value: item.id ,
                label: item.name
              }
            })
            setTables(temp)

          }
          

       }
    }).catch((err:any) => {
      console.log(err)
    })
  }
 
  useEffect(() => {
    getTable()
  
  }, [])

  


  
  useEffect(() => {
  
    const arrayIdTables = Array.isArray(selectedOrder.tablefood_invoices) ? selectedOrder?.tablefood_invoices.map((item: any) => {
      return item?.id_table
     }): []
     
    form.setFieldsValue({
      id_tables: arrayIdTables
  })
  }, [selectedOrder])


  const onFinish = (value: any) => {
    const lst_invoice_detail = invoice_details.map((item: any) => {
      return {
       id_invoice: selectedOrder?.id,
       id_product: !item?.isCombo ? item?.id_product : null,
       id_combo: item?.isCombo ? item?.id_product : null,
       isCombo: item?.isCombo,
       price: item?.price,
       amount: item?.amount
      }
     })
     
     const dataSubmit = {
       id_employee: selectedOrder?.id_employee ? selectedOrder?.id_employee : null,
       id_customer: selectedOrder?.id_customer ? selectedOrder?.id_customer : null,
       id_promotion: selectedOrder?.id_promotion ? selectedOrder?.id_promotion : null,
       ...value,
       lst_invoice_detail: lst_invoice_detail

     }
    
      if(selectedOrder?.id) {
         invoiceServices.update(selectedOrder?.id, dataSubmit).then(async (res: any) => {
            if (res.status) {
                 message.success("Chỉnh sửa thành công")
                await Promise.all(data.map( async (item: any) => {
                      tableServices.update(item, {status: 0}).then((res: any) => {
                              // getTable()
                      }).catch((err: any) => {
                        console.log(err)
                      })
                }))
                invoiceServices.getById(res.data.id).then((res: any) => {
                      if(res.status) {
                        dispatch(actions.OrderActions.selectedOrder(res.data))
                        dispatch(actions.TableFoodActions.loadData({
                          page: 1,
                         size: 12,
                     }))
                      }
                }).catch ((err: any) => {
                  console.log(err)
                })
            }
        }).catch((err: any) => {
          console.log(err)
            message.error("Chỉnh sửa thất bại")
        })
      } else {

       invoiceServices.create( dataSubmit).then((res: any) => {
          if (res.status) {
          message.success("Thêm mới thành công")
              invoiceServices.getById(res.data.id).then((res: any) => {
                    if(res.status) {
                      dispatch(actions.OrderActions.selectedOrder(res.data))
                      dispatch(actions.TableFoodActions.loadData({
                        page: 1,
                       size: 12,
                   }))
                    }
              }).catch ((err: any) => {
                console.log(err)
              })
          }
      }).catch((err: any) => {
        console.log(err)
          message.error("Thêm mới thất bại")
      })

      }
   
  }
  
  return (
    <div className="content-order-detail">
      {contextHolder}
      {/* Drawer payment  */}
      {/* <DrawerPayment visible={isOpenDrawer} setVisible={setIsOpenDrawer} /> */}
      {/* Modal edit count customer */}
      {/* <ModalAcountCustomer
        isOpenModalCountCustomer={isOpenModalCountCustomer}
        setIsOpenModalCountModal={setIsOpenModalCountModal}
        value={selectedOrder?.Amount}
      /> */}
      {/* Modal split order */}
      {/* <ModalSplitOrder visible={isOpenModalSplitOrder} setIsOpenModal={setIsOpenModalSplitOrder} /> */}
      {/* Modal select table */}
      {/* <ModalTable
        visible={isOpenModalTable}
        setVisible={setIsOpenModalTable}
        order={order}
        setOrder={setOrder}
      /> */}
      {/* Modal announce cancle order */}
      <Modal
        open={isOpenModalCancleOrder}
        title="Thông báo"
        onCancel={() => setIsOpenCancleOrder(false)}
        footer={[
          <Button  danger key="submit">
            <FontAwesomeIcon style={{ paddingRight: "5px" }} icon={faSquareCheck} />
            <span> Đồng ý</span>
          </Button>,
          <Button
            key="back"
            onClick={() => {
              setIsOpenCancleOrder(false);
            }}
          >
            <FontAwesomeIcon style={{ paddingRight: "5px" }} icon={faBan} />
            <span> Bỏ qua</span>
          </Button>,
        ]}
      >
        {" "}
        <div>Bạn có chắc muốn hủy đơn!</div>
      </Modal>
      <div>
      <Form onFinish={onFinish} style={{marginTop:"10px"}} form={form}>
        <div className="top-content-order-detail">
        
          <Row gutter={[15, 0]}>
           
              <Col span={12}>
                <Form.Item
                name="id_tables">
                  
    
                    <Select   mode="multiple"  allowClear showSearch  options={tables} style={{width:"100%"}} placeholder="Chọn bàn"/>
                  
                </Form.Item>
                </Col>
       
            <Col  span={12}>
          
              <Form.Item  name={"id_customer"}>
                  {/* <DebounceSelect style={{width:"100%", marginRight:"5px"}} placeholder="Chọn khách hàng" initOption={customers} fetchOptions={fetchCustomer}/> */}
                  <Select  style={{width:"100%", marginRight:"5px"}} placeholder="Chọn khách hàng"/>
              </Form.Item>
              {/* <Tooltip placement="top" title="Thêm khách hàng">
                    <FontAwesomeIcon
                      // onClick={handleClickAddCustomer}
                      icon={faPlusCircle}
                      className="icon-add-customer-order-detail"
                    />
              </Tooltip> */}
              
            </Col>
          </Row>
        
        </div>
        <div className="middle-content-order-detail">
          {Array.isArray(invoice_details)  ? (
           invoice_details.map((item: any) => (
              <ItemOrderDetail  invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails}  data={item} key={item?.id} />
            ))
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "200px",
              }}
            >
              <FontAwesomeIcon
                style={{ fontSize: "3rem", color: " rgba(0, 0, 0, 0.414)" }}
                icon={faUtensils}
              />
              <div style={{ fontWeight: "500", color: " rgba(0, 0, 0, 0.414)" }}>
                Chưa thêm món ăn nào
              </div>
            </div>
          )}
        </div>
        <div className="footer-content-order-detail">
          <div className="info-order-detail">
            <div className="info-order-detail-left">
              <div className="control-table" style={{marginRight:"10px"}}>
                <FontAwesomeIcon className="icon-control-table" icon={faArrowsLeftRightToLine} />
                <span  className="title-controle-table">Tách bàn</span>
              </div>
              <div className="control-table" style={{marginRight:"10px"}}>
                <FontAwesomeIcon className="icon-control-table" icon={faDownLeftAndUpRightToCenter} />
                <span  className="title-controle-table">Ghép bàn</span>
              </div>
              {/* <div onClick={() => handleChangeTable()} className="control-table">
                <FontAwesomeIcon className="icon-control-table" icon={faRightLeft} />
                <span  className="title-controle-table">Chuyển bàn</span>
              </div> */}
            </div>
            <div className="total-price-order">
              <span className="title-total-price-order">Tổng tiền:</span>
              <span className="price-total">
                {selectedOrder?.price ? convertPrice(selectedOrder.price) : `0 đ`}
              </span>
            </div>
          </div>
          <div className="button-control-order-detail">
            <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
              <Row gutter={[20, 10]}>
                <Col span={8}>
                  <Button
                    onClick={() => setIsOpenCancleOrder(true)}
                    danger
                    className="button-controler-order"
                  >
                    <span className="title-button">Hủy Đơn</span>
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    style={{ color: "white", backgroundColor: "#1677ff" }}
                    className="button-controler-order"   
                    // onClick={() => handleSaveOrder()}     
                    htmlType="submit"
                  >
                    <FontAwesomeIcon className="icon-button" icon={faFolderMinus} />
                    <span className="title-button">Lưu</span>
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    style={{ color: "white", backgroundColor: "#28B44F" }}
                    className="button-controler-order"
                  
                  >
                    <FontAwesomeIcon className="icon-button" icon={faMoneyBill1Wave} />
                    <span className="title-button">Thanh toán</span>
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        </Form>
      </div>
     
    </div>
  );
};
// const ModalChangeTable = React.lazy(() => import("./ModalChangeTable/ModalChangeTable"))
export default ContentOrderDetail;
