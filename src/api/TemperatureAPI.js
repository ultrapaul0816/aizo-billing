import { requestPost, requestGet } from ".";

const Token =
  "38e6d8b5269954e042cfda600f55a3ce2e1457ab560f24a5fa69335c167eaccd4a560c1e0fdfe7217013625a0f534414";

export default class TemperatureAPI {
  static async listTemperature(body) {
    const { data } = await requestPost({
      url: "/temp/retrieve/",
      extraConfig: { Token },
      // header: false,
      body,
    });
    return data ? data : false;
  }
  static async listStaff(body) {
    const { data } = await requestPost({
      url: "/temp/staffdetails/",
      extraConfig: { Token },
      header: false,
      body,
    });
    return data ? data : false;
  }
  static async addTemperatures(body) {
    const { data } = await requestPost({
      url: "/temp/add/",
      extraConfig: { Token },
      header: true,
      body,
    });
    return data ? data : false;
  }
  static async getInvoiceData(body) {
    const { data } = await requestPost({
      url: "/temp/inovoicedata/",
      // extraConfig: { Token },
      // header: false,
      body,
    });
    return data ? data : false;
  }
}
