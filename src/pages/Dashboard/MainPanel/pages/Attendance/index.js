import { Button, Card, Icon, InputGroup, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import SelectOutletImage from "../../../../../utils/images/select2.png";
import { UserAPI } from "../../../../../api";
import Notif from "../../../../../components/Notification";
import StaffCard from "./StaffCard";

export default function Attendance() {
  const { data, isLoading } = useQuery({
    queryKey: ["location"],
    queryFn: UserAPI.centerList,
  });

  const [selectedLoc, setSelectedLoc] = useState({
    center_name: "All",
    id: "all",
  });

  const [staff, setStaff] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const [skeleton, setSkeleton] = useState("");

  const [currFilter, setCurrFilter] = useState("not_present");

  useEffect(() => {
    // setStaff(undefined);
    setSkeleton("bp4-skeleton");
    UserAPI.getStaffList()
      .then((res) => {
        setSkeleton("");
        const staff = res.data.map((ob) => {
          const { manager_name, last_name, user_type, id, staff_attendance } =
            ob;
          staff_attendance.reverse();
          return {
            name: manager_name,
            lname: last_name,
            id: id,
            in_time: staff_attendance[0]?.time_in,
            center: ob.center_last_attended,
            out_time: staff_attendance[0]?.time_out,
            attLog: staff_attendance,
            status: staff_attendance[0]?.status,
            user_type: user_type.user_type,
          };
        });
        filterStaffs(staff);
      })
      .catch((err) => {
        setSkeleton("");
        console.log(err);
      });
  }, [refreshData]);

  const markStaffAttendance = (status, id, selected) => {
    UserAPI.markAttendance({
      staff_id: `${id}`,
      center: selected.id,
      ...(status && { status: status }),
    })
      .then((res) => {
        // console.log(res);
        Notif.success("Attendance marked successfully");
        setRefreshData((prev) => !prev);
      })
      .catch((err) => {
        Notif.error("Unable to mark Attendance!");
        console.log(err);
      });
  };

  const markLogout = (id) => {
    UserAPI.markLogout({ staff_id: id })
      .then((res) => {
        setRefreshData((prev) => !prev);
        Notif.success("Logged out successfully");
      })
      .catch((err) => {
        Notif.error("Enable to logout");
      });
  };

  const searchStaff = (e) => {
    const query = e.target.value.toLowerCase();
    const currentList = { ...staff };
    if (query.length > 2) {
      console.log(query);
      let updatedList = {};
      updatedList[currFilter] = staff[currFilter].filter((ob) =>
        ob.name.toLowerCase().includes(query)
      );
      setStaff((prev) => ({ ...prev, [currFilter]: updatedList[currFilter] }));
    } else filterStaffs(staff.all);
  };
  const filterStaffs = (data) => {
    let filteredStaff = {
      not_present: [],
      logged_in: [],
      logged_out: [],
      absent: [],
      weekoff: [],
    };
    data.forEach((ob) => {
      if (ob.in_time && !ob.out_time) filteredStaff.logged_in.push(ob);
      if (ob.in_time && ob.out_time) filteredStaff.logged_out.push(ob);
      if (ob.status === "lwp" || ob.status === "cl" || ob.status === "el")
        filteredStaff.absent.push(ob);
      if (ob.status === "weeklyoff") filteredStaff.weekoff.push(ob);
      if (!ob.in_time && !ob.out_time && !ob.status)
        filteredStaff.not_present.push(ob);
    });
    setStaff({ all: data, ...filteredStaff });
  };

  const handleCurrFilter = (filter) => {
    if (filter === currFilter) {
      setCurrFilter("not_present");
    } else {
      setCurrFilter(filter);
    }
  };
  return (
    <div className="attendance">
      <div className="header-cards">
        <Card
          className={`card-1 ${currFilter === "logged_in" && "active"}`}
          onClick={() => handleCurrFilter("logged_in")}
        >
          <div>
            <h3>Present</h3>
            <span>{staff.all?.filter((ob) => ob.in_time).length || 0}</span>
          </div>
          <div>
            <Icon icon="tick" iconSize="35" />
          </div>
        </Card>
        <Card
          className={`card-1 ${currFilter === "absent" && "active"}`}
          onClick={() => handleCurrFilter("absent")}
        >
          <div>
            <h3>Absent</h3>
            <span>
              {staff.all?.filter(
                (ob) =>
                  ob.status === "lwp" ||
                  ob.status === "cl" ||
                  ob.status === "el"
              ).length || 0}{" "}
            </span>
          </div>
          <div>
            <Icon icon="warning-sign" iconSize="35" />
          </div>
        </Card>
        <Card
          className={`card-1 ${currFilter === "weekoff" && "active"}`}
          onClick={() => handleCurrFilter("weekoff")}
        >
          <div>
            <h3>Week-Off</h3>
            <span>
              {staff.all?.filter((ob) => ob.status === "weeklyoff").length || 0}
            </span>
          </div>
          <div>
            <Icon icon="issue" iconSize="35" />
          </div>
        </Card>
        <Card
          className={`card-1 ${currFilter === "all" && "active"}`}
          onClick={() => handleCurrFilter("all")}
        >
          <div>
            <h3>Total Staff</h3>
            <span>{staff.all?.length || 0}</span>
          </div>
          <div>
            <Icon icon="person" iconSize="35" />
          </div>
        </Card>
      </div>
      <div className="att-container">
        <div className="attendance-header">
          <div className="btns-group">
            <Select
              activeItem={selectedLoc}
              popoverProps={{ minimal: true }}
              items={
                data?.centers
                  ? [{ center_name: "All", id: "all" }, ...data.centers].sort(
                      (a, b) => {
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
                      }
                    )
                  : []
              }
              itemPredicate={(q, item) => {
                return item.center_name.toLowerCase().includes(q.toLowerCase());
              }}
              filterable
              noResults={
                <MenuItem intent="primary" disabled text="No results." />
              }
              itemRenderer={(item, { handleClick, modifiers }) => (
                <MenuItem
                  key={item.id}
                  icon="shop"
                  onClick={handleClick}
                  active={modifiers.active}
                  disabled={modifiers.disabled}
                  style={{ textTransform: "capitalize" }}
                  text={item.center_name}
                />
              )}
              onItemSelect={(item) => {
                setSelectedLoc(item);
              }}
            >
              <Button
                className="outlet-btn"
                large
                text={selectedLoc.center_name || "Select center"}
                intent="primary"
                rightIcon="chevron-down"
              />
            </Select>
            <InputGroup
              large
              leftIcon="search"
              placeholder="Search staff"
              style={{ borderRadius: "5px" }}
              onChange={(e) => searchStaff(e)}
            />
          </div>
        </div>
        <div className="attendance-content">
          {staff ? (
            staff[currFilter]
              ?.filter((item) => {
                if (selectedLoc.id === "all") {
                  return true;
                } else {
                  return item.center?.id === selectedLoc?.id;
                }
              })
              .map((ob) => (
                <StaffCard
                  centers={data?.centers || []}
                  ob={ob}
                  logout={markLogout}
                  markStaffAttendance={markStaffAttendance}
                />
              ))
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-[400px] flex flex-col items-center justify-center">
                <img
                  src={SelectOutletImage}
                  className="h-[170px] animate-popup"
                  alt="selected outlet"
                />
                <p className="text-center text-base font-bold text-gray-500">
                  Please Select location to mark attendance
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
