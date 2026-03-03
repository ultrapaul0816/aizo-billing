import React, { useState, useEffect, useContext } from "react";
import { Div } from "../../../components/Elements";
import {
  Button,
  Tooltip,
  Popover,
  Position,
  MenuItem,
  ButtonGroup,
  Tag,
  Icon,
} from "@blueprintjs/core";
import Notif from "../../../components/Notification";
import { Select } from "@blueprintjs/select";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import OrderManagement from "../../../api/OrderManagement";
import NotificationList from "../../../components/NotificationList";
import NewOrder from "../../../components/Popups/NewOrder";
import moment from "moment";
import Profile from "../../../components/Profile";
import { useIntl } from "react-intl";
import { I18nProvider, IntlContext, LOCALES } from "../../../components/i18n";

export default function Header({ setSound }) {
  const [toggleSound, setToggleSound] = useState(true);
  const [netStat, setNetStat] = useState(navigator.onLine);
  const [openDialog, setOpenDialog] = useState(false);
  const [outlets, setOutlet] = useState({
    items: [],
    selectedOutlet: { Outletname: "" },
  });
  const [currentTime, setCurrentime] = useState(moment().format("hh:mm a"));
  const history = useHistory();
  const { path } = useRouteMatch();
  const reduxoutlets = useSelector((state) => state.outlets);
  const { company_name, company_logo, username } = JSON.parse(
    localStorage.getItem("user")
  );
  let statNode = null;
  const { take_order_button } = useSelector((state) => state.permissions);
  // console.log('Per',take_order_button)
  const netListener = (e) => {
    setNetStat(e.type == "online");
  };
  useEffect(() => {
    ["online", "offline"].forEach((stat) => {
      window.addEventListener(stat, netListener);
    });
    setInterval(() => {
      setCurrentime(moment().format("hh:mm a"));
    }, 1000);
    return () => {
      ["online", "offline"].forEach((stat) => {
        window.removeEventListener(stat, netListener);
      });
    };
  }, []);
  useEffect(() => {
    // console.log(reduxoutlets)
    if (reduxoutlets && reduxoutlets.length) {
      const allOutlets = reduxoutlets.filter((o) => o.is_pos_open);
      setOutlet((ps) => ({
        items: allOutlets || [],
        selectedOutlet: history.location.state
          ? history.location.state.outlet
          : allOutlets.length === 1 && allOutlets[0],
      }));
    }
  }, [reduxoutlets]);

  const [ChangeLangEN, ChangeLangJP] = useContext(IntlContext);
  const intl = useIntl();
  return (
    <Div fullWidth className="header">
      <div className="h-left">
        {
          <>
            <NewOrder
              isOpen={openDialog}
              onClose={() => {
                setOpenDialog(false);
              }}
            />
            <Button
              // rightIcon='circle-arrow-right'
              icon="add"
              text={intl.formatMessage({ id: "Take Order" })}
              // minimal
              className="n-or"
              large
              intent="success"
              style={{ marginLeft: "10px", fontWeight: "bold" }}
              onClick={() => {
                setOpenDialog(true);
              }}
            />
          </>
        }
        <ButtonGroup className="out-drop" large>
          {/* <label>Takeaway/Dine-in</label> */}
          <Select
            activeItem={outlets.selectedOutlet}
            popoverProps={{ minimal: true }}
            items={outlets.items}
            itemPredicate={(q, item) => {
              return item.Outletname.toLowerCase().includes(q.toLowerCase());
            }}
            filterable
            noResults={
              <MenuItem intent="primary" disabled text="No results." />
            }
            itemRenderer={(props, { handleClick, modifiers }) => (
              <MenuItem
                key={props.id}
                icon="shop"
                onClick={handleClick}
                active={modifiers.active}
                disabled={modifiers.disabled}
                style={{ textTransform: "capitalize" }}
                text={props.Outletname ? props.Outletname : ""}
              />
            )}
            onItemSelect={(ou) => {
              // console.log(ou)
              setOutlet((o) => ({ ...o, selectedOutlet: ou }));
            }}
          >
            <Button
              icon="shop"
              minimal
              style={{
                borderRight: "1px solid #106ba326",
                textTransform: "capitalize",
              }}
              text={
                outlets.selectedOutlet.Outletname ||
                intl.formatMessage({ id: "Select Outlet" })
              }
              intent="primary"
              rightIcon="chevron-down"
            />
          </Select>
          <Button
            text={intl.formatMessage({
              id:
                (!outlets.selectedOutlet &&
                  !outlets.selectedOutlet.id &&
                  "Outlet not selected") ||
                "Start Billing",
            })}
            rightIcon="arrow-right"
            intent="primary"
            disabled={!outlets.selectedOutlet && !outlets.selectedOutlet.id}
            minimal
            onClick={() => {
              if (outlets.selectedOutlet && outlets.selectedOutlet.id)
                history.push(`${path}/billing`, {
                  outlet: outlets.selectedOutlet,
                  order_type: 1,
                });
              else
                Notif.error(
                  intl.formatMessage({ id: "Please select an outlet!" })
                );
            }}
          />
        </ButtonGroup>
      </div>

      <div className="h-right">
        <div className="time-cont">
          <div>
            {currentTime.split(" ").map((v) => (
              <span>{v}</span>
            ))}
          </div>
          {/* <div>{moment().format('DD MMMM YYYY')}</div> */}
        </div>
        {/* <Tag icon='updated' large className='version' round>
          v.0.1
        </Tag> */}
        {/* <button onClick={ChangeLangJP}>JPN</button>
        <button onClick={ChangeLangEN}>EN</button> */}

        <Tooltip
          intent={netStat ? "success" : "danger"}
          content={netStat ? "You are Online" : "You are offline"}
        >
          <Tag
            ref={(ref) => {
              statNode = ref;
            }}
            minimal
            style={{ padding: "5px", marginRight: "10px", background: "none" }}
            intent={netStat ? "success" : "danger"}
            icon={netStat ? "offline" : "disable"}
          >
            {/* {netStat ? 'Online' : 'Offline'} */}
          </Tag>
        </Tooltip>
        <Popover
          usePortal={false}
          position={Position.BOTTOM}
          content={<NotificationList />}
        >
          <div className="notif-btn">
            {/* <span className='notif-dot' /> */}
            <Button large className="btn" icon="notifications" minimal />
          </div>
        </Popover>
        <Tooltip content="Toggle Sound">
          <Button
            className="btn"
            large
            icon={toggleSound ? "volume-up" : "volume-off"}
            // style={!toggleSound ? { background: '#ff000012' } : {}}
            minimal
            onClick={() => {
              Notif.alert(
                !toggleSound
                  ? "Order notification enabled"
                  : "Order notification disabled",
                1000
              );
              setToggleSound(!toggleSound);
              setSound(!toggleSound);
            }}
          />
        </Tooltip>
        <Popover
          position={Position.BOTTOM_RIGHT}
          usePortal={false}
          // content={<Profile />}
        >
          <img className="profile-pic" src={company_logo} />
        </Popover>
        <div className="brand-name">
          <p>{username}</p>
          <span>{company_name}</span>
        </div>
        {/* <Button intent='primary' text='Lock Screen' icon='lock' minimal /> */}
      </div>
    </Div>
  );
}
