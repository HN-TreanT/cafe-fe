import createApiServices from "../createApiService";
const api = createApiServices();

const getCustomer = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/customer`,
    method: "GET",
    params: params,
  });
};

const createCustomer = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/online/customer",
    method: "POST",
    data,
  });
};

const deleteCustomer = (Id: string) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/customer/${Id}`,
    method: "DELETE",
  });
};

const updateCustomer = (Id: string, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/customer/${Id}`,
    method: "PUT",
    data,
  });
};

export const customerOnlineService = {
  getCustomer,
  createCustomer,
  deleteCustomer,
  updateCustomer,
};
