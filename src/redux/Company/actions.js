import { UPDATE_COMPANY } from "./types";
import { OutletManagementAPI } from "../../api";

export function itemsRequestSuccess(payload) {
  return {
    type: UPDATE_COMPANY,
    payload: payload,
  };
}
