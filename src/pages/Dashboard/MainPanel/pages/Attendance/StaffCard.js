import React, { useEffect } from "react";
import moment from "moment";
import { Button, ButtonGroup, Icon, Tag, Tooltip } from "@blueprintjs/core";
import { IoMdPerson } from "react-icons/io";
import { CustomSelect } from "../../../../../components/CustomSelect";

export default function StaffCard({
  ob,
  markStaffAttendance,
  logout,
  centers,
}) {
  const { attendance_type } = JSON.parse(localStorage.getItem("user"));
  const [selected, setSelected] = React.useState(undefined);

  useEffect(() => {
    setSelected(ob.center);
  }, [ob.center]);

  return (
    <div
      className={`content-staff-card ${(ob.in_time && "present") || ob.status}`}
      key={ob.id}
    >
      <div className="staff-name">
        <span className="ico">
          <IoMdPerson />
        </span>
        <span>
          {ob.name} {ob.lname}
        </span>

        <Tag intent="none" minimal style={{ marginLeft: 4 }}>
          <Icon iconSize={10} />
          {ob.user_type}
        </Tag>
      </div>

      <div>
        <span>
          {ob.attLog &&
            ob.attLog.map((log) => {
              if (log.time_in && log.time_out) {
                return (
                  <Tag
                    intent="success"
                    minimal
                    style={{ marginLeft: 4 }}
                    className="att-log"
                  >
                    <Icon iconSize={10} icon="history" />
                    {`${moment
                      .utc(moment(log.time_out).diff(moment(log.time_in)))
                      .format("HH:mm")}`}{" "}
                    hrs
                  </Tag>
                );
              }
            })}
        </span>
      </div>

      <div className="att-btns">
        <span className="att-time">
          {ob.in_time &&
            !ob.out_time &&
            `Logged in ${moment(ob.in_time).toNow(true)} ago`}
        </span>
        <div className="location">
          {" "}
          <span>Location:</span>
          <CustomSelect
            labelAccessor="center_name"
            valueAccessor="id"
            items={centers.sort((a, b) => {
              const nameA = a.center_name.toUpperCase(); // ignore upper and lowercase
              const nameB = b.center_name.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            })}
            selected={selected}
            setSelected={setSelected}
          />
        </div>

        <ButtonGroup className="btns-group">
          {attendance_type === "multiple_time" ? (
            <>
              <Button
                text="Present"
                large
                intent="primary"
                minimal
                icon="log-in"
                disabled={
                  (ob.in_time && !ob.out_time) ||
                  ob.status === "lwp" ||
                  ob.status === "cl" ||
                  ob.status === "el" ||
                  ob.status === "weeklyoff"
                }
                className="att-btns-login"
                onClick={() => markStaffAttendance("present", ob.id, selected)}
              />
              <Button
                text="Log-out"
                large
                intent="success"
                minimal
                icon="log-out"
                disabled={
                  !ob.in_time ||
                  (ob.in_time && ob.out_time) ||
                  ob.status === "lwp" ||
                  ob.status === "cl" ||
                  ob.status === "el" ||
                  ob.status === "weeklyoff"
                }
                className="att-btns-logout"
                onClick={() => logout(ob.id)}
              />
            </>
          ) : ob.in_time ? (
            <Button
              text="Present"
              medium
              intent="primary"
              minimal
              icon="log-in"
              disabled={
                (ob.in_time && ob.out_time) ||
                ob.status === "lwp" ||
                ob.status === "cl" ||
                ob.status === "el" ||
                ob.status === "weeklyoff"
              }
              className="att-btns-login"
              onClick={() => markStaffAttendance("present", ob.id)}
            />
          ) : (
            <Button
              text="Log-out"
              medium
              intent="success"
              minimal
              icon="log-out"
              disabled={
                (ob.in_time && ob.out_time) ||
                ob.status === "lwp" ||
                ob.status === "cl" ||
                ob.status === "el" ||
                ob.status === "weeklyoff"
              }
              className="att-btns-logout"
              onClick={() => logout(ob.id)}
            />
          )}
        </ButtonGroup>
        <ButtonGroup className="btns-group">
          <Tooltip
            content="Leave Without Pay"
            position="top"
            disabled={ob.in_time}
          >
            <Button
              text="LWP"
              medium
              intent="danger"
              active={ob.status === "lwp"}
              minimal
              onClick={() => markStaffAttendance("lwp", ob.id)}
              icon="time"
              className="att-btns-l"
              disabled={
                ob.in_time || ob.status === "absent" || ob.status === "weakoff"
              }
            />
          </Tooltip>
          <Tooltip content="Casual Leave" position="top" disabled={ob.in_time}>
            <Button
              text="CL"
              medium
              active={ob.status === "cl"}
              intent="danger"
              minimal
              onClick={() => markStaffAttendance("cl", ob.id)}
              icon="time"
              className="att-btns-l"
              disabled={ob.in_time}
            />
          </Tooltip>
          <Tooltip content="Earned Leave" position="top" disabled={ob.in_time}>
            <Button
              text="EL"
              medium
              intent="danger"
              active={ob.status === "el"}
              minimal
              onClick={() => markStaffAttendance("el", ob.id)}
              icon="time"
              className="att-btns-l"
              disabled={ob.in_time}
            />
          </Tooltip>
          <Tooltip content="Weekly Off" position="top" disabled={ob.in_time}>
            <Button
              text="WO"
              medium
              intent="danger"
              minimal
              active={ob.status === "weeklyoff"}
              onClick={() => markStaffAttendance("weeklyoff", ob.id)}
              icon="time"
              className="att-btns-l"
              disabled={ob.in_time}
            />
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  );
}
