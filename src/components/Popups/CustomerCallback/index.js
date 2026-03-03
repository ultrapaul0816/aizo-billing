import React, { useState } from "react";
import { Dialog, Classes, Button } from "@blueprintjs/core";
import "./style.scss";
import { OrderManagementAPI } from "api";
import Notif from "components/Notification";

export default function CustomerCallback({ onClose, isOpen, info }) {
  const [note, setNote] = useState("");
  const { username, company_name } =
    JSON.parse(localStorage.getItem("user")) || {};
  const [callType, setCallType] = useState("oc");
  const closeAndReset = () => {
    onClose();
  };

  const changeCallType = (e) => {
    setCallType(e.target.id);
  };

  const onSubmit = async () => {
    try {
      const data = await OrderManagementAPI.postCallDetails({
        order_id: info.id,
        notes: note,
        call_type: callType,
      });
      if (data) {
        Notif.alert("Success");
        onClose();
      }
    } catch (err) {
      console.log(err);
      Notif.error("Error Occured");
    }
  };
  // console.log(info);
  return (
    <Dialog
      isOpen={isOpen}
      isCloseButtonShown
      style={{ background: "#fff", minWidth: "50vw" }}
    >
      <div className={Classes.DIALOG_BODY}>
        <Button
          icon="cross"
          className="close-btn"
          minimal
          onClick={closeAndReset}
        />
        <div className="customer-callback"></div>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "400",
            textAlign: "center",
            margin: "0",
          }}
        >
          Customer Update Options
        </h1>
        <p style={{ textAlign: "center", color: "#777575", lineHeight: "2" }}>
          Please Select Appropriate actions that you have taken.
        </p>
        {/* <div className="checklist-cont">sdfdgdfhf</div> */}
        <div className="d-flex" style={{ justifyContent: "center" }}>
          <div
            id="oc"
            onClick={changeCallType}
            className={`customer-update_options ${
              callType === "oc" && "active"
            }`}
          >
            Order Confirmation
          </div>
          <div
            id="ie"
            onClick={changeCallType}
            className={`customer-update_options ${
              callType === "ie" && "active"
            }`}
          >
            Item Exchange
          </div>
          <div
            id="oi"
            onClick={changeCallType}
            className={`customer-update_options ${
              callType === "oi" && "active"
            }`}
          >
            Other Issues
          </div>
          <div
            id="od"
            onClick={changeCallType}
            className={`customer-update_options ${
              callType === "od" && "active"
            }`}
          >
            Order Delay
          </div>
        </div>
        <div className="call-script">
          <p className="title" style={{ marginBottom: "0rem" }}>
            Script
          </p>
          <ul>
            <li className="subtext">
              Dial <b>{info?.customer?.mobile}</b>
            </li>
            <li>
              Greetings! Is this no. of Mr./ Ms. <b>{info?.customer?.name}</b>?
            </li>
            <li>
              I am <b>{username}</b> from <b>{company_name}</b>,{" "}
              <b>{info?.outlet_name}</b>, This is a confirmation call for the
              order placed by you with us.
            </li>
            <li>You have ordered</li>
            <li>
              Your total bill including tax is Rs.
              <b>{info?.total_bill_value?.toFixed(0)}</b>
            </li>
            <li>
              Your Address for delivery would be{" "}
              <b>
                {info?.delivery_address[0]?.address},
                {info?.delivery_address[0]?.locality},
                {info?.delivery_address[0]?.city}
              </b>
            </li>
            <li className="subtext">
              (confirm any special request/ remark) Do suggestive selling for
              sides, sushi/hotdish whichever is not a part of the order)
            </li>
            <li>
              Thank you for ordering from {info?.outlet_name}, Enjoy your meal
              and do call us again soon.
            </li>
          </ul>
        </div>
        <div className="callback-content">
          <div className="note">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Please enter customer feedback or comment here"
            />
          </div>
        </div>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <Button
          large
          intent="none"
          icon="cross"
          text="Cancel"
          onClick={closeAndReset}
          style={{
            margin: "0 10px",
          }}
        />
        <Button
          large
          intent="primary"
          icon="tick"
          text="Done"
          onClick={onSubmit}
        />
      </div>
    </Dialog>
  );
}
