import React, { useState } from "react";
import { Dialog, Classes, Button, Text, Icon } from "@blueprintjs/core";
import Notif from "../Notification";

const list = [
  "Switch off the lights",
  "Cleaning done",
  "Lock Counter",
  "All Bills Settled",
];
export default function Confirmation({ onClose, isOpen, loading }) {
  const closeAndReset = () => {
    onClose();
  };
  return (
    <Dialog isOpen={isOpen} style={{ background: "#fff", minWidth: "10vh" }}>
      <div className={Classes.DIALOG_BODY}>
        <Button
          icon="cross"
          className="close-btn"
          minimal
          onClick={closeAndReset}
        />
        <Text className="title">
          <Icon icon="info-sign" />
          Alert
        </Text>
        <div className="confirmation-cont">
          <span>Is food ready?</span>
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button
          large
          disabled={loading}
          intent="warning"
          icon="cross"
          text="No"
          style={{ marginRight: 10 }}
          onClick={() => {
            onClose(false);
          }}
        />
        <Button
          large
          disabled={loading}
          intent="success"
          icon="tick"
          text="Yes"
          onClick={() => {
            onClose(true);
          }}
        />
      </div>
    </Dialog>
  );
}
