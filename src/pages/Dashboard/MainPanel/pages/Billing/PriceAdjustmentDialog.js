import {
  Button,
  Card,
  Classes,
  Dialog,
  Icon,
  InputGroup,
  Tab,
  Tabs,
  Text,
} from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import "./priceAdjustmentDialog.scss";

export default function PriceAdjustmentDialog({
  isOpen,
  onClose,
  data,
  callback,
}) {
  const [discountType, setDiscountType] = useState("item");
  const [billVal, setBillVal] = useState();

  const calDiscountAmount = () => {
    const { grandTotal, subTotal, tax } = data;
    if (billVal) {
      // billVal = zomato/swiggy order value
      // grandTotal = current order total value
      // tax =  total applicable tax value
      const taxPercentage = tax / subTotal;
      const taxValue = billVal - billVal / (1 + taxPercentage);
      const subtotal = billVal - taxValue;
      const discount = grandTotal - subtotal - taxValue;

      callback(discount);
      onClose();

      console.log("grand total", grandTotal);
      console.log("tax value", taxValue);
      console.log("taxPercentage", taxPercentage);
      console.log("subtotal", subtotal);
      console.log("discount", discount);
    }
  };

  return (
    <Dialog
      canEscapeKeyClose
      style={{ background: "#fff", minWidth: "50vw" }}
      isOpen={isOpen}
    >
      <div className={`${Classes.DIALOG_BODY} customer-main`}>
        <Button icon="cross" className="close-btn" minimal onClick={onClose} />
        <Text className="title">
          <Icon icon="tag" />
          Price adjustment discount
        </Text>
      </div>
      <div className="discount-body">
        <div className="discount-wrapper">
          <Card className="discount-tab">
            <span>₹</span>
            <InputGroup
              value={billVal}
              autoFocus
              onChange={(e) => setBillVal(e.target.value)}
              placeholder="Enter total amount"
            />
            {/* <Tabs
              animate
              className="tabs"
              selectedTabId={discountType}
              onChange={(e) => setDiscountType(e)}
            >
              <Tab title="On items" className="tab-title" id="item" />
              <Tab title="On Total" className="tab-title" id="order" />
            </Tabs> */}
          </Card>
        </div>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <Button
          large
          intent="primary"
          // icon='tick'
          text="Apply"
          onClick={() => {
            calDiscountAmount();
          }}
        />
      </div>
    </Dialog>
  );
}
