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

// const paymentModes = [
//   { id: 0, title: 'Cash' },
//   { id: 8, title: 'EDC Amex', wordLimit: 12 },
//   { id: 9, title: 'EDC Yes Bank', wordLimit: 12 },
//   { id: 2, title: 'PayTm', url: 'paytm.png', wordLimit: 19 },
//   {
//     id: 3,
//     title: 'Razorpay',
//     url: 'razorpay.svg',
//     wordLimit: 18,
//   },
//   {
//     id: 5,
//     title: 'Airtel Money',
//     url: 'airtel.png',
//     wordLimit: 12,
//   },
//   {
//     id: 6,
//     title: 'Mobikwik',
//     url: 'mobikwik.svg',
//     wordLimit: 18,
//   },
//   { id: 11, title: 'Z Prepaid', wordLimit: 10 },
//   { id: 12, title: 'S Store', wordLimit: 12 },
//   { id: 12, title: 'S Store', wordLimit: 12 },
//   { id: 13, title: 'Dunzo', wordLimit: 6 },
//   { id: 14, title: 'Zomato Cash', wordLimit: 12 },
//   { id: 15, title: 'Zomato', wordLimit: 12 },
//   { id: 1, title: 'Dineout', wordLimit: 12 },
// ]

const defaultPaymentObj = {
  pay_id: "",
  amount: "",
  mode: null,
  payment_name: "",
};

export default function SettleDialog({
  data = { price: 0, id: 0 },
  outlet,
  onClose,
  isOpen,
  load,
}) {
  const [inputs, setInputs] = useState([
    {
      pay_id: "",
      amount: "",
      mode: null,
      payment_name: "",
    },
  ]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [amountChanges, setAmountChanges] = useState(0);

  let { currency } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    console.log("hureeyyyyyyyyyy", data);
    if (data?.outlet_id) {
      OrderManagement.getPaymentMethods({ outlet: data?.outlet_id }).then(
        (res) => {
          console.log("payment methods", res);
          let paymentOptions = [];
          if (res) {
            res.data &&
              res.data.map((data, idx) => {
                paymentOptions.push({
                  id: data.id,
                  title: data.payment_method,
                  url: data.payment_logo,
                  wordLimit: parseInt(data.wordLimit),
                  order_source: data.order_source,
                });
              });
          }
          setPaymentModes(paymentOptions);
        }
      );
    }
  }, [data]);
  useEffect(() => {
    // setAmountChanges(-data.price)
    inputs[0].amount = data.price;
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
        mode: inp.mode ? inp.mode : "",
        amount: inp.amount,
        transaction_id: inp.transaction_id,
        payment_name: inp.payment_name,
      }));

      onClose(newData);
      setAmountChanges(0);
      setInputs(newData);

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
      if (m?.mode === "") {
        Notif.error("Please Select Payment Mode");
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
  // useEffect(() => {
  //   if (paymentModes.length) {
  //     let filteredPayment = paymentModes.filter((mode) => {
  //       if (mode.order_source && mode.order_source.length) {
  //         return (
  //           mode.order_source.find((source) => {
  //             console.log(source);
  //             return source.order_source === 'Counter';
  //           })
  //         );
  //       }
  //     });
  //     console.log(filteredPayment);
  //   }
  // }, [paymentModes]);
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
                  <span key={i}>{t}</span>
                ))}
              </Text>
              <span>Total</span>
            </Text>
            <div className="settle-diag-select">
              {inputs.map((v, ind) => (
                <Card className="select-item" key={ind}>
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
                            inputs.filter((inp) => inp.amount !== v.amount)
                          );
                        }}
                      />
                    ) : (
                      ""
                    )}
                    <span className="pay-index">{ind + 1}</span>
                    <Select
                      popoverProps={{ minimal: true, usePortal: false }}
                      items={paymentModes.filter((mode) => {
                        if (mode.order_source && mode.order_source.length) {
                          return mode.order_source.find(
                            (source) => source.order_source === data.source
                          );
                        }
                      })}
                      // items={paymentModes}
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
                  {v.wordLimit > 0 && (
                    <div className="settle-transaction-id">
                      <InputGroup
                        placeholder="Enter Transaction ID"
                        onChange={(e) => {
                          inputs[ind].transaction_id = e.target.value;
                          setInputs([...inputs]);
                        }}
                        large
                      />
                      <Tag minimal>{v?.wordLimit} digit</Tag>
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
                        mode: null,
                        payment_name: "",
                        pay_id: "",
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
