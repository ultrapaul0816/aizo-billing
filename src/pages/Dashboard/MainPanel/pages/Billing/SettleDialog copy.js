import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Text,
  Button,
  MenuItem,
  InputGroup,
  Tag,
  Card,
} from "@blueprintjs/core";
import "../../../../../components/Popups/style.scss";
import { Select } from "@blueprintjs/select";
import Notif from "../../../../../components/Notification";
import OrderManagement from "../../../../../api/OrderManagement";
// const getImageURL = url => `../../../../../utils/images/${url}`

const paymentModes = [
  { id: 0, title: "Cash" },
  { id: 8, title: "EDC Amex", wordLimit: 12 },
  { id: 9, title: "EDC Yes Bank", wordLimit: 12 },
  { id: 2, title: "PayTm", url: "paytm.png", wordLimit: 19 },
  {
    id: 3,
    title: "Razorpay",
    url: "razorpay.svg",
    wordLimit: 18,
  },
  {
    id: 5,
    title: "Airtel Money",
    url: "airtel.png",
    wordLimit: 12,
  },
  {
    id: 6,
    title: "Mobikwik",
    url: "mobikwik.svg",
    wordLimit: 18,
  },
  { id: 11, title: "Z Prepaid", wordLimit: 10 },
  { id: 12, title: "S Store", wordLimit: 12 },
  { id: 12, title: "S Store", wordLimit: 12 },
  { id: 13, title: "Dunzo", wordLimit: 6 },
  { id: 14, title: "Zomato Cash", wordLimit: 12 },
  { id: 15, title: "Zomato", wordLimit: 12 },
  { id: 1, title: "Dineout", wordLimit: 12 },
];
const defaultPaymentObj = {
  pay_id: parseInt(Math.random() * 10000),
  amount: "",
  mode: 0,
  payment_name: "Cash",
};

export default function SettleDialog({
  data = { price: 0, id: 0 },
  onClose,
  isOpen,
  load,
}) {
  const [inputs, setInputs] = useState([defaultPaymentObj]);
  const [paymentModes, setPaymentModes] = useState([{ id: 0, title: "Cash" }]);
  const [amountChanges, setAmountChanges] = useState(0);

  let { currency } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    OrderManagement.getPaymentMethods({}).then((res) => {
      let paymentOptions = [];
      if (res) {
        paymentOptions.push({ id: 0, title: "Cash" });
        res.data &&
          res.data.map((data, idx) => {
            paymentOptions.push({
              id: data.id,
              title: data.payment_method,
              url: data.payment_logo,
              wordLimit: parseInt(data.wordLimit),
            });
          });
      }
      setPaymentModes(paymentOptions);
    });
  }, []);
  useEffect(() => {
    // setAmountChanges(-data.price)
    inputs[0].amount = data.price;
    inputs[0].payment_name = "Cash";
    inputs[0].mode = 0;
    setInputs([...inputs]);
  }, [data]);
  useEffect(() => {
    const total = inputs
      .map((p) => p.amount)
      .reduce((p, n) => parseFloat(p) + parseFloat(n), 0);
    setAmountChanges((total - data.price).toFixed(2));
  }, [inputs]);

  const closeDialog = () => {
    if (validatePayments()) {
      const newData = inputs.map((inp) => ({
        mode: inp.mode,
        amount: inp.amount,
        transaction_id: inp.transaction_id,
        payment_name: inp.payment_name,
      }));
      onClose(newData);
      setAmountChanges(0);
      setInputs([defaultPaymentObj]);
      // setAmountChanges(0)
      // setInputs([{ ...defaultPaymentObj }])
    }
  };
  const validatePayments = () => {
    for (let m of inputs) {
      if (m.amount === "") {
        Notif.error("Please enter amount");
        return false;
      }
      if (m.mode && m.wordLimit && m.transaction_id.length !== m.wordLimit) {
        Notif.error(
          `Please enter correct transaction ID for ${m.payment_name}`
        );
        return false;
      }
    }
    return true;
  };

  return (
    <Dialog isOpen={isOpen} style={{ background: "#fff", minWidth: "50vw" }}>
      <div className={Classes.DIALOG_BODY}>
        <Text className="title">
          <Icon icon="saved" />
          Settle Order
        </Text>
        <Button
          icon="cross"
          onClick={() => {
            setAmountChanges(0.0);
            setInputs([defaultPaymentObj]);
            onClose();
          }}
          className="close-btn"
          minimal
        />
        <div className="settle-diag-body">
          <div>
            <Text className="bill-value">
              <Text className="bill-label">
                {currency + " "}
                {`${data.price}`.split(".").map((t, i) => (
                  <span>{t}</span>
                ))}
              </Text>
              <span>Total</span>
            </Text>
            <div className="settle-diag-select">
              {inputs.map((v, ind) => (
                <Card className="select-item">
                  <div>
                    <Text className="bp4-text">{currency}</Text>
                    <InputGroup
                      placeholder="Enter amount"
                      value={v.amount}
                      onChange={(e) => {
                        var decimal = /^[0-9]+\.?[0-9]*$/;
                        if (e.target.value.match(decimal)) {
                          // const inpIndex = inputs.map(c => c.id).indexOf(v.id)
                          inputs[ind].amount = e.target.value;
                          setInputs([...inputs]);
                        } else {
                          return false;
                        }
                      }}
                      large
                    />
                    {/* <Icon
                    intent='primary'
                    className='m-icon'
                    icon='arrow-right'
                  /> */}
                    {inputs.length > 1 ? (
                      <Button
                        large
                        className="select-item-del"
                        minimal
                        icon="trash"
                        intent="danger"
                        onClick={() => {
                          setInputs(
                            inputs.filter((inp) => inp.pay_id !== v.pay_id)
                          );
                        }}
                      />
                    ) : (
                      ""
                    )}
                    <span className="pay-index">{ind + 1}</span>
                    <Select
                      popoverProps={{ minimal: true, usePortal: false }}
                      items={paymentModes}
                      onItemSelect={(item) => {
                        // const inpIndex = inputs.map(c => c.id).indexOf(v.id)
                        inputs[ind].mode = item.id;
                        inputs[ind].payment_name = item.title;
                        inputs[ind].wordLimit = item.wordLimit;
                        inputs[ind].transaction_id = "";
                        setInputs([...inputs]);
                      }}
                      filterable={false}
                      itemRenderer={(props, { handleClick, modifiers }) => (
                        <div
                          className="settle-item"
                          key={props.id}
                          onClick={handleClick}
                          style={
                            modifiers.active
                              ? {
                                  background: "#2979ff34",
                                  color: "#2979ff",
                                  fontWeight: "bold",
                                }
                              : {}
                          }
                          // active={modifiers.active}
                          // disabled={modifiers.disabled}
                        >
                          <span>{props.title}</span>
                          {props.url ? <img src={props.url} /> : null}
                        </div>
                      )}
                    >
                      <Button
                        style={{
                          fontWeight: "bold",
                          boxShadow: "0 0 0 1px #2979ff",
                          color: "#2979ff",
                        }}
                        large
                        minimal
                        intent="primary"
                        rightIcon="chevron-down"
                        text={v.payment_name || "Select Payment Mode"}
                      />
                    </Select>
                  </div>
                  {v.mode !== 0 && (
                    <div className="settle-transaction-id">
                      <InputGroup
                        placeholder="Enter Transaction ID"
                        onChange={(e) => {
                          inputs[ind].transaction_id = e.target.value;
                          setInputs([...inputs]);
                        }}
                        large
                      />
                      <Tag minimal>{v.wordLimit} digit</Tag>
                    </div>
                  )}
                </Card>
              ))}
              <div className="add-pay">
                <Button
                  disabled={amountChanges >= 0}
                  text="Add"
                  minimal
                  large
                  intent="primary"
                  rightIcon="add"
                  onClick={() => {
                    setInputs([
                      ...inputs,
                      {
                        mode: 0,
                        payment_name: "Cash",
                        pay_id: parseInt(Math.random() * 10000),
                        amount: -amountChanges,
                      },
                    ]);
                  }}
                />
              </div>
            </div>
            <hr />
            <div className="select-change">
              <span>
                {currency} {amountChanges}
              </span>

              {/* <span>{currency} {amountChanges < 0 ? 0 : amountChanges}</span> */}
              <Tag minimal intent="primary">
                Change
              </Tag>
            </div>
          </div>
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={amountChanges < -0.9 && !load}
            loading={load}
            icon="tick"
            text="Settle"
            large
            intent="primary"
            onClick={closeDialog}
          />
        </div>
      </div>
    </Dialog>
  );
}
