import React from "react";
import { Toaster } from "@blueprintjs/core";

const toaster = Toaster.create({ maxToasts: 1 });
export default class Notif {
  static success(message, timeout = 2000) {
    toaster.show({ message, timeout, icon: "confirm", intent: "success" });
  }
  static error(message, timeout = 2000,) {
    toaster.show({
      message,
      timeout,
      icon: "cross",
      intent: "danger",
    });
  }
  static alert(message, timeout = 2000) {
    toaster.show({
      message,
      timeout,
      icon: "info-sign",
      intent: "none",
    });
  }
  static notify(message, timeout = 2000, onClickCB = () => {}) {
    toaster.show({
      message,
      timeout,
      icon: "error",
      intent: "primary",
      action: { onClick: onClickCB ,icon:'circle-arrow-right'},
    });
  }
}
