import React from "react";
import { Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import "./ItemProduct.scss";
import { convertPrice } from "../../../utils/helper/convertPrice";
const ItemProduct: React.FC<any> = ({ product }) => {
  return (
    <div  className="card-image-product">
      <Image
        className="image-card-image-product"
        preview={false}
  
       height={140}
        src={product?.image}
      ></Image>
      <div style={{ fontWeight: "700", fontSize:"16px" }}>{product?.name}</div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{ fontWeight: "600" }}>{product?.price ? convertPrice(product?.price) : ""}</div>
          {/* a<div className="item-product-detail" style={{padding:"5px", backgroundColor:"#C67C4E", fontSize:"17px", color:"white"}}>+</div> */}
      </div>
    </div>
  );
};

export default ItemProduct;
