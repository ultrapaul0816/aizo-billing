import { requestPost, requestGet, requestGetWithQuery } from "./";

export default class OutletManagementAPIs {
  static async toggleCategoryStatus(body) {
    const { data } = await requestPost({
      url: "/outletmgmt/Categoryavail/",
      body,
    });
    return data ? data.success : false;
  }
  static async listCategories(body) {
    const { data } = await requestPost({
      url: "/outletmgmt/Categorylist/",
      body,
    });
    return data ? (data.success ? data.data : null) : null;
  }
  static async toggleOutletStatus(body) {
    const { data } = await requestPost({
      url: "/outletmgmt/IsOpen/",
      body,
    });
    return data ? data.success : false;
  }
  static async getCharges() {
    const { data } = await requestGet({ url: "/package/charge/" });
    return data ? (data.success ? data.data : null) : null;
  }
  static async toogleProductAvailability(body) {
    const { data } = await requestPost({
      url: "/outletmgmt/Productavail/",
      body,
    });
    return data ? data : false;
  }
  static async listProducts(body) {
    const { data } = await requestPost({
      url: "/outletmgmt/Productlist/",
      body,
    });
    return data ? (data.success ? data.data : null) : null;
  }
  static async getFilterLabels() {
    const { data } = await requestGet({ url: "/allergen/" });
    return data ? (data.success ? data.data : null) : null;
  }
  static async listOutlets() {
    const { brand } = localStorage
      ? JSON.parse(localStorage.getItem("user")) || {}
      : {};
    const { data } = await requestGet({
      url: `/outletmgmt/list/?brand=${brand}`,
    });
    return data ? (data.success ? data.data : null) : null;
  }
  static async getNearestOutlets(body) {
    const { data } = await requestPost({
      url: "front/outlet/OutletDetail/",
      body,
    });
    return data;
  }
  static async getRiders(body) {
    const { data } = await requestPost({
      url: "/rider/outletwiserider/",
      body,
    });
    return data;
  }
  static async assignRider(body) {
    const { data } = await requestPost({
      url: "/rider/outletwiserider/assign/",
      body,
    });
    return data;
  }
  static async getTax(body) {
    const { data } = await requestPost({
      url: "https://zapio-admin.com/api/v2/listing/tax/",
      body,
      extUrl: true,
    });
    return data;
  }

  static async getOrderReport(body) {
    const { data } = await requestPost({
      url: `/ordermgnt/Order/`,
      body,
    });
    return data;
  }
  static async getOrdersCSV(body) {
    const { data } = await requestGetWithQuery({
      url: "/order/csv/",
      body,
    });
  }
  static async getOutletsByCordinates(body) {
    const { data } = await requestPost({
      url: "/outletmgmt/nearestOutlet/",
      body,
    });
    return data;
  }
}
