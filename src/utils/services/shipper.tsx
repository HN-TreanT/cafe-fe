import createApiServices from "../createApiService";
const api = createApiServices();

const get = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/shipper`,
    method: "GET",
    params: params,
  });
};

const create = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/online/shipper",
    method: "POST",
    data,
  });
};

const remove = (Id: string) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/shipper/${Id}`,
    method: "DELETE",
  });
};

const update = (Id: string, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/online/shipper/${Id}`,
    method: "PUT",
    data,
  });
};

export const shipperServices = { get, remove, create, update };
