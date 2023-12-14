import React, { useEffect, useState } from "react";
import { Row, Col, Menu, MenuProps, Pagination, Form, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import useAction from "../../../../redux/useActions";
import "./Product.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import ItemProduct from "../../ItemProduct/ItemProduct";
import { getProduct } from "../../../../utils/services/productServices ";
import { categoryServices } from "../../../../utils/services/categoryServices";
import { comboServices } from "../../../../utils/services/comboServices";
import { Spin } from "antd";
let items: MenuProps["items"] = [
  { label: "Tất cà mặt hàng", key: "allProduct" },
  {label: "combo", key:"combo"}
];
interface props {
  invoice_details: any[],
  setInvoiceDetails: any,
  hanldeSetInvoiceDetails: any
}
const Product: React.FC<props> = (props) => {
const {invoice_details, setInvoiceDetails, hanldeSetInvoiceDetails} = props
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState<any>(8)
  const [products, setProducts] = useState([])
  const [categories, setCategoris] = useState([])
  const [name, setName] = useState<string>()
  const [idcategory, setIdCategory] = useState<any>()
  const [combos, setCombos] = useState([])


  const getCombo = () => {
    setLoading(true)
      comboServices.get({
        page: 1,
        size : 6
      }).then((res: any) => {
          if(res.status) {
           const temp =  res.data.data.map((item: any) => {
               return {
                ...item,
                isCombo: true
               }
            })
            setProducts(temp)
            setTotalPage(res.data.TotalPage)
          }
          setLoading(false)
      }).catch((err: any)=> {
        console.log(err)
        setLoading(false)
      })
  }
  const getDataProduct = () => {
    setLoading(true)
    getProduct({
      page: 1,
      size : 8,
      ...(name && {name: name}),
      ...(idcategory && {id_category: idcategory}),

    }).then((res: any) => {
      if(res.status) {
        const temp =  res.data.data.map((item: any) => {
          return {
           ...item,
           isCombo: false
          }
       })
       setProducts(temp) 
        setTotalPage(res.data.count)
      }
      setLoading(false)
    }).catch((err: any) => {
       console.log(err)
       setLoading(false)
    })
  }
  const getCategory = () => {
    categoryServices.get({
      page: 1,
      size: 100
    }).then((res) => {
      if(res.status) {
        setCategoris(res.data.data)
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  
  const handleClick = (value: any) => {
    if (value?.key !== "combo") {
      
      if (value?.key === "allProduct") {
        setIdCategory(undefined)
        getDataProduct()
      } else {
        setIdCategory(value?.key)
      }
    } else {
      getCombo()
    }
    
  }


  useEffect(() => {
    getCategory()
  }, [])

  useEffect(() => {
     getDataProduct()
  }, [name, currentPage, idcategory])
  
  return (
    <div className="product">
      <Row gutter={[10, 10]}>
        <Col span={5}>
          <div className="side-bar-poduct-order-page">
            <Menu
               defaultActiveFirst
               defaultSelectedKeys={['allProduct']}
               onClick={ (value) => handleClick(value)}
              style={{
                fontSize: "1rem",
                backgroundColor: "transparent",
                paddingTop: "10px",
              }}
              mode="inline"
              items={[
                ...[
                  { label: "Tất cả mặt hàng", key: "allProduct" },
                {label: "combo", key:"combo"}
                ],
                ...categories.map((item:any) => {
                return {
                  key:item?.id,
                  label: item?.name
                }
              })]}
            />
          </div>
        </Col>
        <Col span={19}>
          <div className="content-product-order-page">
         
            <div className="search-product-order-page">
              <Form style={{ marginTop: "15px" }}>
                <Row gutter={[30, 0]}>
                  <Col span={8}>
                      <label>
                        Tên mặt hàng
                      </label>
                      <Input                 
                        placeholder="Nhập tên mặt hàng"
                        prefix={
                          <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            style={{color:"rgba(0, 0, 0, 0.173)"}}
                          />
                        }
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setName('')
                          }
                        }}
                        onKeyPress={(e: any) => {
                          if (e.key === "Enter") {
                            setName(e.target?.value)
                            setCurrentPage(1)
                          }
                        }}
                      />
                  </Col>
                </Row>
              </Form>
            </div>
            <div style={{marginTop:"10px"}} className="list-product-order-page">
            
              <Row gutter={[10, 15]}>
            
                {
                  loading ? <Spin style={{textAlign:"center"}}/> : Array.isArray(products) ? (
                    products.map((product: any) => {
                      return (
                        <Col key={product?.IdProduct} span={6}>
                          {" "}
                          <ItemProduct hanldeSetInvoiceDetails={hanldeSetInvoiceDetails} invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails} product={product} />
                        </Col>
                      );
                    })
                  ) : (
                    <div className="empty-product">
                      <FontAwesomeIcon
                        icon={faUtensils}
                        className="icon-empty-product"
                      />
                      <div className="title-empy-product">
                        Không có mặt hàng nào
                      </div>
                    </div>
                  )
                }
              </Row>
            </div>
            <div className="pagination-proudct-order-page">
              <Pagination
                onChange={(value) => setCurrentPage(value)}
                current={currentPage}
                total={totalPage}
                pageSize={12}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Product;
