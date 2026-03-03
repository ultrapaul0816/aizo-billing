import React, { useState } from "react";
import { Div } from "../../../../components/Elements";
import { Grid } from "../../../../components/Layout";
import { IoMdPerson, IoMdNotifications, IoMdConstruct } from "react-icons/io";
import { useHistory } from "react-router-dom";

export default function Settings() {
  const [ci, setActive] = useState(1);
  const renderComponents = () => (
    <div>
      <p className="title"></p>
    </div>
  );
  const options = [
    { name: "Profile", id: 1, icon: IoMdPerson },
    // { name: 'Notification', id: 2, icon: IoMdNotifications },
    { name: "Other", id: 2, icon: IoMdConstruct },
    // {
    //   name: 'Sign Out',
    //   id: 4,
    //   icon: IoMdLogOut,
    //   action: () => {
    //     UserAPI.logout()
    //       .then(res => {
    //         if (res) history.push('/')
    //         Notif.alert(res ? 'logout successful' : 'Error while logging out!')
    //       })
    //       .catch(() => {
    //         history.push('/')
    //       })
    //   }
    // }
  ];
  return (
    <Div className="settings" fullheight>
      <Grid full cols={["200px", "1fr"]}>
        <div className="s-options">
          {options.map((op) => (
            <div
              className={ci === op.id ? "s-active" : ""}
              onClick={() => {
                if (op.action) {
                  op.action();
                } else setActive(op.id);
              }}
            >
              <op.icon size={20} style={{ marginRight: "10px" }} />
              {op.name}
            </div>
          ))}
        </div>
        <div className="s-panel-cont">
          <p className="s-panel-title">{`${options[ci - 1].name} Settings`}</p>
          <div className="s-panel">{renderComponents}</div>
        </div>
      </Grid>
    </Div>
  );
}
