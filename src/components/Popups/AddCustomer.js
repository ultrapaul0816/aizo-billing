import React, { useState, useEffect } from "react";
import "./style.scss";
import {
  Dialog,
  Classes,
  InputGroup,
  Text,
  Button,
  Icon,
  TextArea,
  RadioGroup,
  Radio,
  Spinner,
  Tag,
  Tooltip,
  Checkbox,
  Position,
  Tabs,
  Tab,
  MenuItem,
  ButtonGroup,
} from "@blueprintjs/core";
import Notif from "../Notification";
import { OrderManagementAPI, UserAPI } from "../../api";
import { Select } from "@blueprintjs/select";
import OrderSource from "components/OrderSource";

let timeout;

export default function AddCustomer({
  data,
  orderSource,
  orderDetails,
  onClose,
  changeSource,
  isOpen,
  callback,
}) {
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    locality: "",
    address: "",
    order_id: "",
  });
  const [query, setQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState({ load: false });
  const [customerList, setcustomerList] = useState([]);
  const [localities, setLocalities] = useState();
  const [showList, setShowList] = useState(false);
  const [currSource, setCurrSourse] = useState("Phone");

  const customerAddresses =
    selectedCustomer.other_address && selectedCustomer.other_address.length
      ? selectedCustomer.other_address
      : [{ address: selectedCustomer?.address }];
  console.log("mmmmmmmmmmmmmmmmm", data, orderDetails);
  useEffect(() => {
    if (data) setCustomerDetails(data);
  }, [data]);
  useEffect(() => {
    if (!localStorage.getItem("localities")) {
      OrderManagementAPI.getLocalities()
        .then((res) => {
          localStorage.setItem("localities", JSON.stringify(res.data[0]));
          setLocalities(res.data[0]);
        })
        .catch((err) => console.log(err));
    } else {
      setLocalities(JSON.parse(localStorage.getItem("localities")));
    }
  }, []);

  const handleQuery = (q) => {
    UserAPI.searchCustomer({ mobile: q.join("") }).then((res) => {
      // console.log(res)
      setShowList(true);
      if (res.length == 0) {
        setCustomerDetails({ ...customerDetails, mobile: q.join("") });
      }
      setcustomerList(res || []);
    });

    // else if (q.length < 10) setSelectedCustomer({})
  };

  const handleInput = (e) => {
    setCustomerDetails((c) => ({ ...c, [e.target.name]: e.target.value }));
  };
  const checkInputs = () => {
    if (customerDetails.customer_opt_out) return true;
    for (let c of Object.keys(customerDetails)) {
      if (orderDetails?.order_source_label === "Phone") {
        if (
          customerDetails[c] == "" &&
          c !== "email" &&
          c !== "address_type" &&
          c !== "order_id"
        ) {
          Notif.alert("Please fill required fields!", 1000);
          return false;
        }
      } else if (orderDetails?.order_source_label === "Website Order") {
        if (
          customerDetails[c] == "" &&
          c !== "address_type" &&
          c !== "order_id"
        ) {
          Notif.alert("Please fill required fields!", 1000);
          return false;
        }
      } else if (
        orderDetails?.order_source_label === "Swiggy" ||
        orderDetails?.order_source_label === "Zomato"
      ) {
        if (!customerDetails.order_id) {
          Notif.alert("Please fill swiggy order id!", 1000);
          return false;
        }
      }
    }
    return true;
  };

  function debounce(func, wait, immediate) {
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  const isNumber = (q) =>
    q.length >= 11
      ? false
      : q[q.length - 1] && isNaN(q[q.length - 1])
      ? false
      : true;

  // const isAddressSelected =
  //   customerDetails.address === selectedCustomer?.address
  const { company_logo } = JSON.parse(localStorage.getItem("user"));
  return (
    <Dialog
      canEscapeKeyClose
      style={{ background: "#fff", minWidth: "50vw", minHeight: "71vh" }}
      isOpen={isOpen}
    >
      <div className={`${Classes.DIALOG_BODY} customer-main`}>
        <Button icon="cross" className="close-btn" minimal onClick={onClose} />
        <Text className="title">
          <Icon icon="person" />
          Customer Details
        </Text>

        <OrderSource
          sources={orderSource}
          updateSource={(e) => changeSource(e)}
          currSource={orderDetails?.order_source_label}
        />
        <div className="customer-det">
          <div className="c-search">
            <label>Search Customer</label>
            <div className="c-searchbar">
              <InputGroup
                onFocus={() => {
                  setShowList(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowList(false);
                  }, 200);
                }}
                onChange={(e) => {
                  const q = e.target.value.split("");

                  if (isNumber(q)) {
                    setQuery(q.join(""));
                    if (q.length > 4) {
                      debounce(function () {
                        handleQuery(q);
                      }, 200)();
                    } else {
                      if (customerList.length) setcustomerList([]);
                    }
                  }
                }}
                value={query}
                className="searchbar"
                autoFocus
                large
                leftIcon="search"
                placeholder="Customer number"
              />
              {showList && !!customerList.length && (
                <ul>
                  {customerList.map((cus) => (
                    <li
                      onClick={() => {
                        setSelectedCustomer({ load: true });
                        UserAPI.getCustomerDetails({
                          id: cus.id.toString(),
                        }).then((res) => {
                          console.log("customer details", res);
                          if (res) {
                            setSelectedCustomer({ ...res[0], load: false });
                            setCustomerDetails({
                              name: res[0].name,
                              mobile: res[0].mobile,
                              email: res[0].email,
                              city: "",
                              locality: "",
                              address: "",
                              order_id: "",
                            });
                          } else {
                            Notif.error("Customer details not found!");
                            setSelectedCustomer((st) => ({
                              ...st,
                              load: false,
                            }));
                          }
                        });
                      }}
                    >
                      <Icon icon="person" />
                      <span>
                        <span>{cus.name}</span>
                        {cus.mobile}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <hr />
            {selectedCustomer && Object.keys(selectedCustomer).length > 1 ? (
              <div className="c-data">
                <div className="p-det">
                  <Tooltip className="copy-det" content="Copy details">
                    <Button
                      small
                      icon="arrow-top-right"
                      intent="primary"
                      minimal
                      onClick={() => {
                        setCustomerDetails((prev) => ({
                          ...prev,
                          name: selectedCustomer.name,
                          mobile: selectedCustomer.mobile,
                          email: selectedCustomer.email,
                        }));
                      }}
                    />
                  </Tooltip>
                  <span>
                    <Icon icon="person" />
                  </span>
                  <div>
                    <span className="c-name">
                      {selectedCustomer.name}
                      <Tag intent="primary" minimal>
                        {selectedCustomer.customer_type}
                      </Tag>
                    </span>
                    <span>
                      <Icon iconSize={10} icon="phone" />
                      {selectedCustomer.mobile}
                    </span>
                    <span className="c-mail">
                      <Icon iconSize={10} icon="envelope" />
                      {selectedCustomer.email}
                    </span>
                    <span className="c-name">
                      <Tag intent="danger" minimal>
                        <Icon iconSize={10} icon="bank-account" />
                        {selectedCustomer.total_spent}
                      </Tag>
                      <Tag intent="success" minimal>
                        <Icon iconSize={10} icon="pulse" />
                        {selectedCustomer.chkhealth}
                      </Tag>
                    </span>
                  </div>
                </div>
                {customerAddresses.map((addressItem) => {
                  const isSelected =
                    addressItem.address === customerDetails.address;
                  return (
                    <div className="a-list">
                      {/* <RadioGroup> */}
                      <div
                        style={
                          isSelected ? { boxShadow: "0 0 0 1px #2196ff" } : {}
                        }
                        className="a-card"
                        onClick={() => {
                          // e.stopPropagation()
                          const { name, email, mobile } = selectedCustomer;
                          setCustomerDetails({
                            name,
                            email,
                            address: addressItem.address,
                            city: addressItem?.city ?? "",
                            locality: addressItem?.locality ?? "",
                            mobile,
                            address_type:
                              addressItem?.address_type?.toLowerCase() ?? "",
                            order_id: "",
                          });
                        }}
                      >
                        {/* <Radio>{selectedCustomer.address}</Radio> */}
                        <Icon
                          color={isSelected ? "#2196ff" : "#394b59"}
                          icon="office"
                        />
                        {addressItem?.address}{" "}
                        {addressItem?.address_type &&
                          ` (${addressItem?.address_type?.toLowerCase()})`}
                        <Icon
                          className="tick"
                          color="#2196ff"
                          icon={isSelected ? "tick-circle" : "circle"}
                        />
                      </div>
                      {/* </RadioGroup> */}
                    </div>
                  );
                })}
              </div>
            ) : selectedCustomer.load ? (
              <Spinner intent="primary" size={20} />
            ) : (
              <Tag intent="none" minimal large>
                Please enter customer's 10-digit number
              </Tag>
            )}
            {selectedCustomer.order_history ? (
              <div className="past-orders">
                <label>Past orders</label>
                {selectedCustomer.tag &&
                  selectedCustomer.tag.map((str) => (
                    <Tag intent="none" minimal className="c-tag">
                      <Icon iconSize={10} icon="tag" />
                      {str}
                      {/* {selectedCustomer.tag.map((str) => str)}, */}
                    </Tag>
                  ))}

                {selectedCustomer.order_history.length
                  ? selectedCustomer.order_history.slice(0, 2).map((h) => (
                      <div className="past-orders-card">
                        <div className="past-orders-card-f">
                          {company_logo ? (
                            <img src={company_logo} />
                          ) : (
                            "No logo"
                          )}
                        </div>
                        <div className="past-orders-card-s">
                          <span>{h.order_id}</span>
                          {h.order_description.map((ob) => (
                            <span key={ob.name}>
                              {ob.name} x{ob.quantity}
                            </span>
                          ))}
                          <span>total: {h.total_value}</span>
                          <span className="order-time">{h.order_time}</span>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            ) : null}
          </div>
          <div>
            <label>Customer Details</label>
            {(orderDetails?.order_source_label === "Zomato" ||
              orderDetails?.order_source_label === "Swiggy") && (
              <InputGroup
                name="order_id"
                placeholder="Order id"
                value={customerDetails.order_id}
                onChange={handleInput}
                leftIcon="link"
                large
              />
            )}
            {(orderDetails?.order_source_label === "Phone" ||
              orderDetails?.order_source_label === "Website Order") && (
              <>
                <InputGroup
                  onChange={handleInput}
                  value={customerDetails.name}
                  name="name"
                  placeholder="Name"
                  leftIcon="person"
                  large
                />
                <InputGroup
                  onChange={(e) => {
                    if (isNumber(e.target.value.split(""))) handleInput(e);
                  }}
                  value={customerDetails.mobile}
                  name="mobile"
                  placeholder="Phone"
                  leftIcon="phone"
                  large
                />
                <InputGroup
                  onChange={handleInput}
                  value={customerDetails.email}
                  name="email"
                  placeholder="Email"
                  leftIcon="envelope"
                  large
                />
                {/* <hr /> */}
                <Text className="input-label">Address</Text>
                <div
                  style={{
                    justifyContent: "space-between",
                  }}
                  className="flex items-center mb-2"
                >
                  <Select
                    activeItem={localities?.activeCity?.city}
                    popoverProps={{
                      minimal: true,
                      position: Position.BOTTOM_LEFT,
                    }}
                    items={localities?.all_city || []}
                    itemPredicate={(q, item) => {
                      return item.city.toLowerCase().includes(q.toLowerCase());
                    }}
                    filterable
                    name="city"
                    noResults={
                      <MenuItem intent="primary" disabled text="No results." />
                    }
                    itemRenderer={(props, { handleClick, modifiers }) => (
                      <MenuItem
                        key={props.id}
                        icon="office"
                        onClick={handleClick}
                        active={modifiers.active}
                        disabled={modifiers.disabled}
                        style={{ textTransform: "capitalize" }}
                        text={props?.city || " "}
                      />
                    )}
                    onItemSelect={(ou) => {
                      // console.log(ou)
                      setLocalities((o) => ({
                        ...o,
                        activeCity: ou,
                        activeLocal: "",
                      }));
                      setCustomerDetails((prev) => ({ ...prev, city: ou }));
                    }}
                  >
                    <Button
                      large
                      minimal
                      icon="office"
                      style={{
                        textTransform: "capitalize",
                      }}
                      text={customerDetails?.city?.city || "Select City"}
                      // intent='primary'
                      rightIcon="chevron-down"
                    />
                  </Select>
                  <Select
                    activeItem={localities?.activeLocal?.area}
                    popoverProps={{
                      minimal: true,
                      position: Position.BOTTOM_LEFT,
                    }}
                    items={
                      localities &&
                      localities.all_locality?.filter(
                        (ob) => ob.city === localities.activeCity?.id
                      )
                    }
                    itemPredicate={(q, item) => {
                      return item.area.toLowerCase().includes(q.toLowerCase());
                    }}
                    filterable
                    noResults={
                      <MenuItem intent="primary" disabled text="No results." />
                    }
                    itemRenderer={(props, { handleClick, modifiers }) => (
                      <MenuItem
                        key={props.id}
                        icon="map-marker"
                        onClick={handleClick}
                        active={modifiers.active}
                        disabled={modifiers.disabled}
                        style={{ textTransform: "capitalize" }}
                        text={props?.area || " "}
                      />
                    )}
                    name="locality"
                    onItemSelect={(ou) => {
                      // console.log(ou)
                      setLocalities((o) => ({ ...o, activeLocal: ou }));
                      setCustomerDetails((prev) => ({
                        ...prev,
                        locality: ou,
                      }));
                    }}
                  >
                    <Button
                      large
                      minimal
                      icon="map-marker"
                      style={{
                        textTransform: "capitalize",
                      }}
                      text={
                        customerDetails?.locality?.area || "Select Locality"
                      }
                      // intent='primary'
                      rightIcon="chevron-down"
                    />
                  </Select>
                </div>
                <div className="add-group">
                  <ButtonGroup large fill onMouseEnter={() => {}}>
                    <Button
                      icon="home"
                      style={{ outline: "none" }}
                      id="Home"
                      active={customerDetails.address_type === "home"}
                      onClick={() =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          address_type: "home",
                        }))
                      }
                    >
                      Home
                    </Button>
                    <Button
                      icon="office"
                      style={{ outline: "none" }}
                      id="Office"
                      active={customerDetails.address_type === "office"}
                      onClick={() =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          address_type: "office",
                        }))
                      }
                    >
                      Office
                    </Button>
                    <Button
                      icon="globe"
                      style={{ outline: "none" }}
                      id="Other"
                      active={customerDetails.address_type === "other"}
                      onClick={() =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          address_type: "other",
                        }))
                      }
                    >
                      Other
                    </Button>
                  </ButtonGroup>
                </div>
                <InputGroup
                  leftIcon="office"
                  onChange={handleInput}
                  value={customerDetails.address}
                  name="address"
                  placeholder="Enter full address"
                  multiple
                  large
                />
              </>
            )}
            <Button
              small
              text="Add new Address"
              style={{ alignSelf: "flex-end" }}
              minimal
              icon="plus"
              intent="primary"
              onClick={() => {
                setCustomerDetails({
                  ...customerDetails,
                  address: "",
                  locality: "",
                  address_type: "",
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button
          large
          intent="primary"
          icon="tick"
          text="Done"
          onClick={() => {
            if (checkInputs()) {
              onClose();
              Notif.success("Customer details updated");
              callback(customerDetails);
            }
          }}
        />
      </div>
    </Dialog>
  );
}
