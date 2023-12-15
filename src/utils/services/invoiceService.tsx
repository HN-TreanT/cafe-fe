import CreateApiService from "../createApiService";

const api = CreateApiService();

const get = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice`,
    method: "GET",
    params: params
  });
};


const getInvoiceByIdTable = (id_table: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/invoice/detail-by-id-table/${id_table}`,
      method: "GET",
     
    });
  };

const getById = (id: Number) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/${id}`,
    method: "GET",
  });
};

const create = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/invoice",
    method: "POST",
    data: data,
  });
};

const update = (id: Number, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/${id}`,
    method: "PUT",
    data: data,
  });
};

const deleteById = (id: Number) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/${id}`,
    method: "DELETE",
  });
};

export const invoiceServices = {
  get,
  getById,
  create,
  update,
  deleteById,
  getInvoiceByIdTable
};
