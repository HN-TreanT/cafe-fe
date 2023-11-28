import createApiServices from "../createApiService";
const api = createApiServices();

const getSupplier = (params: any,) => {
  return api.makeAuthRequest({
    url: "/api/v1/supplier",
    method: "GET",
  });
};

const createSupplier = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/supplier",
      method: "POST",
      data,
    });
  };

  const deleteSupplier = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/supplier/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateSupplier = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/supplier/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getSupplier };
export { createSupplier };
export { deleteSupplier };
export { updateSupplier };
