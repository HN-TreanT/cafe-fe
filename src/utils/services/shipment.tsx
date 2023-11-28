import createApiServices from "../createApiService";
const api = createApiServices();

const getShipment =  (params: any,) => {
  if(!params.search){
    params.search =""
  }
  return api.makeAuthRequest({
    url: `/api/v1/shipment?search=${params.search}`,
    method: "GET",
  });
};

const createShipment = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/shipment",
      method: "POST",
      data,
    });
  };

  const deleteShipment = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/shipment/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateShipment = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/shipment/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getShipment };
export { createShipment };
export { deleteShipment };
export { updateShipment };
