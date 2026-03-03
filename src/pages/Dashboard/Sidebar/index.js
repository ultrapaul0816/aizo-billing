import React, { useState, useEffect } from "react";
import { Expanded } from "../../../components/Layout";
import {
  Tree,
  Classes,
  Collapse,
  Button,
  Tooltip,
  Position,
  Spinner,
} from "@blueprintjs/core";
import MenuItemsList from "./MenuItems";
import { Div } from "../../../components/Elements";
import { IoIosArrowDown, IoMdLogOut, IoMdPower } from "react-icons/io";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import { UserAPI } from "../../../api";
import Notif from "../../../components/Notification";
import { FormattedMessage } from "react-intl";

const iconStyle = { style: { marginRight: "15px" }, size: 20 };
// const activeIconStyle = {
//   borderRadius: '50%',
//   padding: 5,
//   background: '#fff',
//   color: '#004d40',
//   width: '2rem',
//   height: '2rem'
// }
// const inActiveIconStyle = {
//   borderRadius: '50%',
//   padding: 5,
//   background: '#fff',
//   color: '#004d40',
//   width: '2rem',
//   height: '2rem'
// }
const RotatedIcon = styled(IoIosArrowDown)`
  transition: 0.1s;
  transform: rotate(${(props) => (props.rotate ? "-90deg" : "0edg")});
  //   background:${(props) => (props.rotate ? "#00000023" : "transparent")};
  padding: 3px;
  border-radius: 20px;
  font-size: 1.2rem;
`;

const SidebarItem = (props) => {
  return (
    <Div fullWidth className="sidebar-item" onClick={props.onClick}>
      <div
        className={`head ${props.isActive ? "head--active" : "head--inactive"}`}
        style={props.show ? { width: "80%" } : {}}
      >
        <span style={props.show ? { padding: "0 10px" } : {}}>
          <props.icon
            {...iconStyle}
            style={props.show ? iconStyle.style : { marginRight: 0 }}
          />
          {
            props.show ? props.name : null
            // <Tooltip content={props.name}>
            //   <Div className='tooltip'></Div>
            // </Tooltip>
          }
        </span>
        {props.subItems ? (
          <RotatedIcon rotate={props.isOpen ? "rotate" : undefined} />
        ) : (
          ""
        )}
      </div>
      <div className="sub-menu-cont">{props.children}</div>
    </Div>
  );
};
export default function Sidebar() {
  const [nodes, setNodes] = useState(MenuItemsList);
  // const [subIndex, setSubIndex] = useState(MenuItemsList)
  const [activeItem, setActiveItem] = useState(0);
  const [toggle, setToggle] = useState(false);
  const history = useHistory();
  const { path } = useRouteMatch();
  const [load, setLoad] = useState({ auth: false });
  const enableLoading = (key) => {
    setLoad((l) => ({ ...l, [key]: true }));
  };
  const disableLoading = (key) => {
    setLoad((l) => ({ ...l, [key]: false }));
  };
  useEffect(() => {
    const p = history.location.pathname.split("/");
    const s = p[p.length - 1];
    setActiveItem(s ? nodes.map((v) => v.name.toLowerCase()).indexOf(s) : 0);
  });

  return (
    <>
      {load.auth && (
        <div className="mask">
          <Spinner size={Spinner.SIZE_STANDARD} intent="primary" />
        </div>
      )}
      <Expanded
        className="sidebar"
        style={{ width: toggle ? "200px" : "80px" }}
      >
        <Button
          icon="menu"
          className="toggler"
          onClick={() => {
            setToggle(!toggle);
          }}
        />
        <div className="title">{/* <span>{toggle && 'InstaPOS'}</span> */}</div>
        <div className="menu-cont">
          {nodes.map((node, i) => {
            return (
              <>
                {node.div ? <hr /> : ""}
                <SidebarItem
                  key={i}
                  onClick={() => {
                    // setActiveItem(i)
                    if (node.path !== undefined)
                      history.push(`${path}/${node.path}`);
                    if (node.subItems) {
                      node.isOpen = !node.isOpen;
                      setNodes([...nodes]);
                    }
                  }}
                  isActive={activeItem === i}
                  show={toggle}
                  {...node}
                >
                  {node.subItems ? (
                    <Collapse isOpen={node.isOpen}>
                      {node.subItems.map((item, ind) => (
                        <div
                          key={ind}
                          className="head"
                          style={toggle ? {} : { paddingLeft: "20px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            history.push(`${path}/${item.path}`);
                          }}
                        >
                          <item.icon {...iconStyle} />
                          <div>
                            {toggle ? (
                              item.name
                            ) : (
                              <Tooltip
                                hoverOpenDelay={100}
                                content={item.name}
                                position={Position.RIGHT}
                              >
                                <span className="tooltip"></span>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </Collapse>
                  ) : (
                    ""
                  )}
                </SidebarItem>
              </>
            );
          })}
        </div>
        <hr />
        <div
          className="log-out"
          onClick={() => {
            enableLoading("auth");
            UserAPI.logout()
              .then((res) => {
                disableLoading("auth");
                if (res) history.push("/");
                Notif.alert(
                  res ? "logout successful" : "Error while logging out!"
                );
              })
              .catch(() => {
                disableLoading("auth");
                history.push("/");
              });
          }}
        >
          <IoMdPower size={20} />
          {toggle ? (
            <span>
              <FormattedMessage id="Sign out" />
            </span>
          ) : null}
        </div>
      </Expanded>
    </>
  );
}
