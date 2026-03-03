import React, { useEffect, useState } from "react";
import { OutletManagementAPI } from "../../../../../api";
import { Div } from "../../../../../components/Elements";
import OutletCard from "./OutletCard";
import {
  InputGroup,
  Spinner,
  ProgressBar,
  Button,
  Tooltip,
  Position,
} from "@blueprintjs/core";
import { useSelector, useDispatch } from "react-redux";
import Checklist from "../../../../../components/Popups/Checklist";
import Notif from "../../../../../components/Notification";
import { gloabalFetchOutlets } from "../../../../../redux/Outlet/actions";
import { useIntl } from "react-intl";
import { IoMdPerson } from "react-icons/io";
import OutletCard2 from "./OutletCard2";
import moment from "moment";

export default function OutletsList() {
  const [outlets, setOutlets] = useState([]);
  const [filteredOutlets, setFileterdOutlets] = useState([]);
  const { reduxoutlets, totalOrders } = useSelector((state) => ({
    reduxoutlets: state.outlets,
    totalOrders: state.orders,
  }));
  const [state, setState] = useState({ isOpen: false });
  const [brandNames, setBrandNames] = useState();

  useEffect(() => {
    setOutlets(reduxoutlets);
    setFileterdOutlets(reduxoutlets);
  }, [reduxoutlets]);
  const refresh = useDispatch();
  // useEffect(() => {
  //   filter({ target: { value: 'test' } })
  // }, [outlets])
  const intl = useIntl();
  useEffect(() => {
    // console.log('current outelts',outlets);
    // if(brand.length>0 && filteredOutlets.length>0 ){
    //   brand.map((v, i) =>
    //   filteredOutlets
    //   .filter((d) => d.Company === v)
    //   setBrandNames({v:d.Company})
    // }
  }, [outlets]);
  const normalize = (text) => (text ? text.toLowerCase() : text);
  const filter = ({ target }) =>
    setFileterdOutlets(
      outlets.filter((o) =>
        normalize(o.Outletname).includes(normalize(target.value))
      )
    );
  const toggleOutletStatus = (body) => {
    setState((st) => ({ ...st, isOpen: false, isLoading: true }));
    OutletManagementAPI.toggleOutletStatus(body).then((res) => {
      setState((st) => ({ ...st, isLoading: false }));
      if (res) refresh(gloabalFetchOutlets());
      else Notif.error("Cannot toggle outlet status right now!");
    });
  };

  return (
    <Div className="outlets">
      <Checklist
        isOpen={state.isOpen}
        data={state.activeOutletId}
        onClose={(clist) => {
          // console.log(clist)
          if (clist)
            toggleOutletStatus({
              id: state.activeOutletId.id.toString(),
              is_open: state.activeOutletId.status,
              checklist: clist,
            });
          else setState((st) => ({ ...st, isOpen: false }));
        }}
      />
      <div className="o-head">
        <InputGroup
          // disabled={!!!outlets.length}
          large
          style={{ borderRadius: "5px" }}
          leftIcon="search"
          placeholder={intl.formatMessage({ id: "Search Outlets" })}
          onChange={filter}
        />
        <Tooltip
          position={Position.RIGHT}
          className="o-refresh"
          content="Refresh Outlets"
        >
          <Button
            // onClick={() => fetchOrderDetails(order.id)}
            large
            // text='Refresh'
            icon="refresh"
            intent="primary"
            minimal
            // disabled={order.load}
            // loading={order.load}
          />
        </Tooltip>
      </div>

      <Div className="outlet-cont">
        <table>
          <thead>
            <tr>
              <th>Outlet name</th>
              <th style={{ textAlign: "center" }}>Acceptance</th>
              {/* <th style={{ textAlign: "center" }}>Processing</th> */}
              <th style={{ textAlign: "center" }}>Preparation</th>
              <th style={{ textAlign: "center" }}>Dispatch</th>
              <th style={{ textAlign: "center" }}>Logged in</th>
              <th style={{ textAlign: "center" }}>Pending order</th>

              <th style={{ textAlign: "center" }}>Total sale</th>
              <th style={{ textAlign: "center" }}>Settled Orders</th>
              <th>Opening time</th>
              <th>Closing time</th>
              <th>status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {outlets && outlets.length ? (
              filteredOutlets.map((v, i) => (
                <OutletCard2
                  key={v.id}
                  data={v}
                  isClosingTime={moment(v.closing_time).isBefore()}
                  isLoading={
                    v.id === state.activeOutletId?.id && state?.isLoading
                  }
                  delay={i / 50}
                  checklistCallback={({ id, status }) => {
                    setState((st) => ({
                      ...st,
                      activeOutletId: { id, status },
                    }));
                    if (status) {
                      toggleOutletStatus({
                        id: id.toString(),
                        is_open: status,
                        checklist: [],
                      });
                      return;
                    }
                    if (totalOrders)
                      for (let o of totalOrders)
                        if (o.order_status < 6 && id === o.outlet_id) {
                          Notif.error(
                            `Please Settle all the bills for ${o.outlet_name} outlet before closing!`,
                            3000
                          );
                          return;
                        }
                    setState((st) => ({
                      ...st,
                      isOpen: !status,
                    }));
                  }}
                />
              ))
            ) : (
              <div>
                <Spinner intent="primary" size={20} />
              </div>
            )}
          </tbody>
        </table>
      </Div>
    </Div>
  );
}
