import { useState, useEffect } from "react";
import "./style.scss";
import {
  Dialog,
  Classes,
  InputGroup,
  Text,
  Button,
  Icon,
  Spinner,
  Tag,
  Tooltip,
  MenuItem,
  Position,
  Tabs,
  Tab,
  ButtonGroup,
  AnchorButton,
} from "@blueprintjs/core";
import Notif from "../Notification";
import { UserAPI, OutletManagementAPI } from "../../api";
import { useHistory } from "react-router-dom";
import { FaStore } from "react-icons/fa";
import { debounce } from "../../utils/helpers";
import { Select } from "@blueprintjs/select";
import { useSelector } from "react-redux";
import SelectOutletImage from "../../utils/images/select2.png";
import OrderSource from "components/OrderSource";

export default function NewOrder({ data, onClose, isOpen, callback }) {
  // const [localities, setLocalities] = useState();
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    order_id: "",
    address_type: "",
  });
  const [query, setQuery] = useState("");
  const [outlets, setOutlets] = useState({
    load: false,
    items: [],
  });

  const [selectedCustomer, setSelectedCustomer] = useState({ load: false });
  const [customerList, setcustomerList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [currSource, setCurrSourse] = useState("");
  const history = useHistory();
  const reduxoutlets = useSelector((state) => state.outlets);
  const { orderSource } = useSelector((state) => state.Config);
  const customerAddresses =
    selectedCustomer.other_address && selectedCustomer.other_address.length
      ? selectedCustomer.other_address
      : [{ address: selectedCustomer?.address }];

  const { company_id } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    setOutlets((ps) => ({
      ...ps,
      items: reduxoutlets ? reduxoutlets.filter((o) => o.is_pos_open) : [],
    }));
  }, [reduxoutlets]);
  useEffect(() => {
    if (data) setCustomerDetails((prev) => ({ ...prev, data }));
  }, [data]);

  useEffect(() => {
    debounce(getGooglePlaces, 300)();
  }, [customerDetails.address]);

  const reset = () => {
    setCustomerDetails({
      name: "",
      mobile: "",
      email: "",
      address: "",
      order_id: "",
      address_type: "",
    });
    setCurrSourse("");
    // setLocalities((prev) => ({ ...prev, activeCity: [], activeLocal: [] }));
    // setOutlets({ load: false })
    setcustomerList([]);
    setSelectedCustomer({ load: false });
    setQuery("");
    setOutlets((pr) => ({
      ...pr,
      items: reduxoutlets ? reduxoutlets.filter((o) => o.is_pos_open) : [],
      selectedOutlet: "",
    }));
  };
  const getGooglePlaces = () => {
    if (customerDetails.address == "") {
      if (outlets !== "") setOutlets((ou) => ({ ...ou, load: false }));
      return;
    }
    if (window.locService) {
      setOutlets((ou) => ({ ...ou, load: true }));
      window.locService.textSearch(
        {
          query: customerDetails.address,
          type: ["geometry"],
        },
        (results, status) => {
          // console.log(results)
          if (results.length && results[0]) {
            // setOutlets({ load: true })
            OutletManagementAPI.getOutletsByCordinates({
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng(),
              company: company_id,
            }).then((res) => {
              console.log(res);
              if (res.success && res.nearest_restaurants.length > 0) {
                const currentOutlets = [...outlets.items];
                res.nearest_restaurants.forEach((item) => {
                  const existingOutletIndex = currentOutlets.findIndex(
                    (find) => find.id === item.id
                  );
                  currentOutlets.splice(existingOutletIndex, 1);
                });
                console.log(currentOutlets);
                setOutlets((ou) => ({
                  ...ou,
                  items: res.nearest_restaurants.concat(currentOutlets),
                  selectedOutlet: res.nearest_restaurants[0],
                  load: false,
                }));
              } else {
                Notif.error(res.message);
                setOutlets((ou) => ({
                  ...ou,
                  selectedOutlet: {},
                  load: false,
                }));
              }
            });
          } else setOutlets((ou) => ({ ...ou, load: false }));
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
          }
        }
      );
    }
  };

  useEffect(() => {
    console.log("outlets", outlets);
  }, [outlets]);
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
    if (currSource === "") {
      Notif.alert("Please select order source", 1000);
    }
    for (let c of Object.keys(customerDetails)) {
      if (currSource === "Phone") {
        if (
          customerDetails[c] == "" &&
          c !== "email" &&
          c !== "address_type" &&
          c !== "order_id"
        ) {
          Notif.alert("Please fill required fields!", 1000);
          return false;
        }
      } else if (currSource === "Website Order") {
        if (
          customerDetails[c] == "" &&
          c !== "address_type" &&
          c !== "order_id"
        ) {
          Notif.alert("Please fill required fields!", 1000);
          return false;
        }
      } else if (currSource === "Swiggy" || currSource === "Zomato") {
        if (!customerDetails.order_id) {
          Notif.alert("Please fill swiggy order id!", 1000);
          return false;
        }
      }
    }
    return true;
  };

  const isNumber = (q) =>
    q.length >= 11
      ? false
      : q[q.length - 1] && isNaN(q[q.length - 1])
      ? false
      : true;

  const { company_logo } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    console.log("customer details", customerDetails);
  }, [customerDetails]);

  return (
    <Dialog
      canEscapeKeyClose
      style={{ background: "#fff", minWidth: "50vw", minHeight: "71vh" }}
      isOpen={isOpen}
    >
      <div className={`${Classes.DIALOG_BODY} customer-main`}>
        <Button
          icon="cross"
          className="close-btn"
          minimal
          onClick={() => {
            reset();
            onClose();
          }}
        />
        <Text className="title">
          <Icon icon="add" />
          New Order
        </Text>

        <OrderSource
          sources={orderSource}
          updateSource={(e) => setCurrSourse(e)}
          currSource={currSource}
        />

        {currSource ? (
          <div className="customer-det animate-popup">
            <div className="c-search">
              <label>Search Customer</label>
              <div className="c-searchbar">
                <InputGroup
                  autoFocus
                  onFocus={() => {
                    setShowList(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowList(false);
                    }, 200);
                  }}
                  disabled={currSource === 27}
                  onChange={(e) => {
                    const q = e.target.value.split("");
                    if (isNumber(q)) {
                      setQuery(q.join(""));
                      if (q.length > 4) {
                        debounce(function () {
                          handleQuery(q);
                        }, 500)();
                      } else {
                        if (customerList.length) setcustomerList([]);
                      }
                    }
                  }}
                  value={query}
                  autoComplete="false"
                  className="searchbar"
                  large
                  leftIcon="search"
                  placeholder="Customer number"
                />
                {showList && !!customerList.length && (
                  <ul>
                    {customerList.map((cus) => (
                      <li
                        key={cus.id}
                        onClick={() => {
                          setSelectedCustomer({ load: true });
                          UserAPI.getCustomerDetails({
                            id: cus.id.toString(),
                          }).then((res) => {
                            console.log(res);
                            if (res) {
                              setSelectedCustomer({ ...res[0], load: false });
                              setCustomerDetails((prev) => ({
                                ...prev,
                                name: res[0].name,
                                mobile: res[0].mobile,
                                email: res[0].email,
                              }));
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
              {/* <hr /> */}
              <div className="c-data">
                {selectedCustomer &&
                Object.keys(selectedCustomer).length > 1 ? (
                  <>
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
                    <label>Saved Address</label>
                    {customerAddresses.map((addressItem) => {
                      const isSelected =
                        addressItem.address === customerDetails.address;
                      return (
                        <div className="a-list" key={addressItem.address}>
                          {/* <RadioGroup> */}
                          <div
                            style={
                              isSelected
                                ? {
                                    boxShadow: "0 0 0 1px #2196ff",
                                    color: "#2196ff",
                                  }
                                : {}
                            }
                            className="a-card"
                            onClick={() => {
                              // e.stopPropagation()
                              const { name, email, mobile } = selectedCustomer;
                              setCustomerDetails((prev) => ({
                                ...prev,
                                name,
                                email,
                                address: addressItem?.address ?? "",
                                // city: addressItem?.city ?? "",
                                // locality: addressItem?.locality ?? "",
                                mobile,
                                address_type:
                                  addressItem?.address_type?.toLowerCase() ??
                                  "",
                              }));
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
                  </>
                ) : selectedCustomer.load ? (
                  <Spinner intent="primary" size={20} />
                ) : (
                  ""
                )}
              </div>
              {selectedCustomer.order_history ? (
                <div className="past-orders">
                  <label>Tags</label>
                  {selectedCustomer.tag && (
                    <div className="tags">
                      <div className="tags-wrapper">
                        {selectedCustomer.tag.map((str) => (
                          <Tag intent="none" minimal style={{ margin: "2px" }}>
                            <Icon iconSize={10} icon="tag" />
                            {str}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  <label>Past orders</label>
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
            </div>{" "}
            <div>
              <label>Customer Details</label>
              {(currSource === "Zomato" || currSource === "Swiggy") && (
                <InputGroup
                  name="order_id"
                  placeholder="Order id"
                  value={customerDetails.order_id}
                  onChange={handleInput}
                  leftIcon="link"
                  large
                />
              )}
              {(currSource === "Phone" || currSource === "Website Order") && (
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
                  {(currSource === "Phone" ||
                    currSource === "Website Order") && (
                    <InputGroup
                      onChange={handleInput}
                      value={customerDetails.email}
                      name="email"
                      placeholder="Email"
                      leftIcon="envelope"
                      large
                    />
                  )}

                  <Text className="input-label">Address</Text>
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

              <div className="cust-actions">
                <Button
                  small
                  text="Clear"
                  style={{ alignSelf: "flex-end" }}
                  minimal
                  icon="eraser"
                  intent="danger"
                  onClick={() => {
                    setCustomerDetails({
                      ...customerDetails,
                      address: "",
                      address_type: "",
                      name: "",
                      email: "",
                      mobile: "",
                    });
                  }}
                />
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
                      address_type: "",
                    });
                  }}
                />
              </div>
              <label>Outlet Details</label>
              <div className="cust-outlet">
                {outlets.Outletname ? (
                  <div>
                    <span>
                      <FaStore />
                    </span>
                    <span>
                      <span>{outlets.Outletname} </span>
                      <span>{outlets.address}</span>
                    </span>
                  </div>
                ) : outlets.load ? (
                  <>
                    <Spinner tagName="circle" intent="primary" size={20} />
                    <span>Searching nearest outlet...</span>
                  </>
                ) : (
                  <Select
                    // activeItem={
                    //   localities?.selectedOutlet?.name ||
                    //   localities?.activeLocal?.outlets?.name ||
                    //   []
                    // }
                    popoverProps={{
                      minimal: true,
                      position: Position.BOTTOM_LEFT,
                    }}
                    items={outlets.items || []}
                    itemPredicate={(q, item) => {
                      return (
                        item.name?.toLowerCase().includes(q.toLowerCase()) ||
                        item.Outletname?.toLowerCase().includes(q.toLowerCase())
                      );
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
                        text={
                          props.distance
                            ? `${props.Outletname} (${props.distance}km)`
                            : props.Outletname
                        }
                      />
                    )}
                    onItemSelect={(ou) => {
                      // console.log(ou)
                      // setLocalities((o) => ({ ...o, selectedOutlet: ou }));
                      setOutlets((prev) => ({ ...prev, selectedOutlet: ou }));
                    }}
                  >
                    <Button
                      large
                      minimal
                      icon="shop"
                      style={{
                        textTransform: "capitalize",
                      }}
                      text={
                        outlets.selectedOutlet
                          ? outlets?.selectedOutlet?.distance
                            ? outlets?.selectedOutlet.Outletname +
                              ` (${outlets?.selectedOutlet?.distance}km)`
                            : outlets?.selectedOutlet?.Outletname
                          : "Select an outlet"
                      }
                      // intent='primary'
                      rightIcon="chevron-down"
                    />
                  </Select>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center">
            <img
              src={SelectOutletImage}
              className="h-[120px] animate-popup"
              alt="selected outlet"
            />
            <p className="text-gray-400 text-base text-center">
              Please select the order source to proceed
            </p>
          </div>
        )}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button
          large
          intent="primary"
          rightIcon="arrow-right"
          text="Continue"
          onClick={() => {
            if (checkInputs()) {
              if (outlets?.selectedOutlet?.id) {
                history.push("/home/billing", {
                  outlet: outlets.selectedOutlet,
                  customer: customerDetails,
                  order_type: 0,
                  order_source: orderSource.filter(
                    (ob) => ob.source_name === currSource
                  )[0].id,
                  order_source_label: currSource,
                  // order_source: orderSource.filter(
                  //   (ob) => ob.source_name === currSource
                  // )[0].id,
                });
                reset();
                onClose();
              } else Notif.error("Please specify an outlet", 1000);
            }
          }}
        />
      </div>
    </Dialog>
  );
}
