import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  Button,
  Icon,
  Radio,
  RadioGroup,
  Tag,
  Checkbox,
} from "@blueprintjs/core";
import "../../../../../utils/styles/customize.scss";
import Notif from "../../../../../components/Notification";

const isAddonExist = (adg, customization, addon) => {
  return (
    customization.addOns[adg.add_on_group_name]?.add_ons?.some(
      (item) => item.addon_id !== addon.addon_id
    ) &&
    adg.max_choice ===
      customization.addOns[adg.add_on_group_name]?.add_ons.length
  );
};

export default function ProductDialog({
  isOpen,
  data,
  productCallback,
  onClose,
}) {
  const [state, setState] = useState({
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    usePortal: true,
  });
  const [total, setTotal] = useState(0);
  const [groups, setGroups] = useState([]);
  const [customization, setCustomization] = useState({
    variant: "",
    addOns: [],
  });
  const [sg, setSG] = useState(0);
  let checkRefs = [];
  const resetSelection = () => {
    setCustomization({ addOns: [], variant: "" });
    setSG(0);
    onClose();
  };
  const [selectedAddon, setSelectedAddon] = useState({});
  const [variantsMinimum, setVariantsMinimum] = useState(null);

  useEffect(() => {
    if (groups.length) {
      const addOnsGroup = {};
      const g = groups.map((a, l) => {
        let min_choices = 0;
        let { product_name } = a.products;
        const addons = [];
        a.products.add_on_groups.map((item) => {
          let desc = item["add_on_group_name"];
          addons.push({ [desc]: item.min_choice });
        });
        if (product_name) {
          addOnsGroup[product_name] = addons;
        } else {
          addOnsGroup.noName = addons;
        }
      });
      setVariantsMinimum(addOnsGroup);
    }
  }, [groups]);

  const { currency } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (data) {
      const g = data.customize_detail.customize_data[0].groups;
      console.log("hhhhhhhhhhhhhh", g, data);
      setGroups(g);
      setCustomization({
        addOns: [],
        variant: {
          name: g[0].products.product_name,
          price: g[0].products.price || data.price,
        },
      });
      setTotal(g[0].products.price || data.price);
    }
  }, [data]);
  const updateAddons = (target, adg, a) => {
    // console.log("target", target, "addongroup", adg, a, data);

    const { add_on_group_name, min_choice, max_choice } = adg;
    const gg = customization.addOns[add_on_group_name];
    // console.log("gg", gg);
    console.log(customization);
    if (target.checked && gg && gg.add_ons.length > gg.max - 1) {
      Notif.error(`Only ${gg.min} choices allowed for ${add_on_group_name}!`);
      target.checked = false;
      return;
    }

    const ad = { ...JSON.parse(target.value), add_on_group_name },
      is_checked = target.checked;
    setTotal((t) => (is_checked ? t + a.price : t - a.price));
    setCustomization((c) => ({
      ...c,
      addOns: {
        ...c.addOns,
        [add_on_group_name]: !!c.addOns[add_on_group_name]
          ? {
              ...c.addOns[add_on_group_name],
              add_ons: is_checked
                ? [...c.addOns[add_on_group_name].add_ons, ad]
                : c.addOns[add_on_group_name].add_ons.filter(
                    (adn) => adn.addon_name !== ad.addon_name
                  ),
            }
          : {
              add_on_group_name: add_on_group_name,
              min: min_choice,
              max: max_choice,
              add_ons: [ad],
            },
      },
    }));
  };

  // useEffect(() => {
  //   console.log("customization", customization);
  // }, [customization]);
  // console.log());

  return (
    <Dialog
      transitionDuration={50}
      {...state}
      className="customize-cont"
      style={{ background: "#fff" }}
      isOpen={isOpen}
    >
      <div className={Classes.DIALOG_HEADER}>
        <Icon icon="settings" />
        <span className={`${Classes.HEADING} ${Classes.INTENT_PRIMARY}`}>
          {data.product_name}
        </span>
        <Button large icon="cross" onClick={resetSelection} />
      </div>
      <div className={Classes.DIALOG_BODY}>
        <div className="c-data">
          <div className="c-var">
            <span className="title">Variants</span>
            {groups.length && groups[0].products.product_name ? (
              <RadioGroup className="c-var-pr" selectedValue={sg}>
                {data &&
                  groups.map((g, gi) => (
                    <div
                      onClick={() => {
                        const gr = groups[gi];
                        setSG(gi);
                        setCustomization({
                          addOns: [],
                          variant: {
                            name: gr.products.product_name,
                            price: gr.products.price,
                          },
                        });
                        if (checkRefs.length) {
                          checkRefs.forEach((r) => {
                            r.input.checked = false;
                          });
                        }
                        setTotal(gr.products.price);
                      }}
                      className="var-item"
                      style={
                        sg === gi
                          ? { borderColor: "#106ba3", color: "#106ba3" }
                          : {}
                      }
                    >
                      <span className="item-cont">
                        <Icon
                          color={sg === gi ? "#106ba3" : "#eee"}
                          icon={sg === gi ? "tick-circle" : "circle"}
                        />
                        {g.products.product_name}
                        <Tag minimal intent="primary">
                          {currency + " " + g.products.price}
                        </Tag>
                      </span>
                    </div>
                  ))}
              </RadioGroup>
            ) : (
              <i>No varients Available</i>
            )}
          </div>

          <div className="c-cont">
            {groups.length &&
              groups[sg] &&
              groups[sg].products.add_on_groups.map((adg) => (
                <div className="adg">
                  <p className="title">
                    {adg.add_on_group_name}
                    <span>
                      (min-{adg.min_choice} max-{adg.max_choice})
                    </span>
                  </p>

                  <div className="add-ons-cont">
                    {adg.add_ons.map((a) => (
                      <Checkbox
                        ref={(ref) => {
                          checkRefs.push(ref);
                        }}
                        large
                        disabled={isAddonExist(adg, customization, a)}
                        className="addon-card"
                        value={JSON.stringify(a)}
                        onChange={(e) => {
                          updateAddons(e.target, adg, a);
                        }}
                      >
                        <span className="a-item">
                          {a.addon_name}
                          <Tag intent="primary" minimal>
                            {currency + " " + a.price}
                          </Tag>
                        </span>
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Tag minimal intent="primary  " large>
            {currency + " " + total}
          </Tag>
          <Button
            style={{ fontSize: "21px", padding: "0.9rem" }}
            intent="primary"
            text="Add to Cart"
            icon="add"
            large
            onClick={() => {
              const { id, tag, food_type, tax_detail } = data;
              const group = data.customize_detail.customize_data[0].groups;

              const cc = [];
              Object.keys(customization.addOns).forEach((cus) => {
                if (customization.addOns[cus].add_ons.length) {
                  cc.push(...customization.addOns[cus].add_ons);
                }
              });
              let hasAllVariant = false;
              const { name } = customization.variant;
              if (name) {
                let Obj = variantsMinimum[name].reduce(
                  (r, c) => Object.assign(r, c),
                  {}
                );
                const Occurance = occToTimes(
                  cc.map((item) => item.add_on_group_name)
                );

                const { obj1, obj2 } = clean(Obj, Occurance);

                hasAllVariant = hasSameData(obj1, obj2);
              } else {
                let Obj = variantsMinimum["noName"].reduce(
                  (r, c) => Object.assign(r, c),
                  {}
                );
                const Occurance = occToTimes(
                  cc.map((item) => item.add_on_group_name)
                );
                const { obj1, obj2 } = clean(Obj, Occurance);
                hasAllVariant = hasSameData(obj1, obj2);
              }
              // console.log(customization);

              // console.log(cc);
              if (hasAllVariant) {
                productCallback({
                  id,
                  name: data.product_name,
                  size: customization.variant.name || "N/A",
                  add_ons: cc,
                  cartId: `cart-${id}-${new Date().getTime().toString()}`,
                  price: total,
                  quantity: 1,
                  tag,
                  food_type,
                  kot_desc: data?.kot_desc ?? "",
                  tax_detail: tax_detail.map((t) => ({
                    ...t,
                    tax_value: (total * t.tax_percent * 0.01).toFixed(2),
                  })),
                });
                setTotal(group[0].products.price || data.price);
                resetSelection();
              } else {
                Notif.error("Please select All variant");
              }
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}

function occToTimes(Occurance) {
  var counts = {},
    i,
    value;
  for (i = 0; i < Occurance.length; i++) {
    value = Occurance[i];
    if (typeof counts[value] === "undefined") {
      counts[value] = 1;
    } else {
      counts[value]++;
    }
  }
  return counts;
}

function hasSameData(obj1, obj2) {
  const obj1Length = Object.keys(obj1).length;
  const obj2Length = Object.keys(obj2).length;

  if (obj1Length === obj2Length) {
    return Object.keys(obj1).every(
      (key) => obj2.hasOwnProperty(key) && obj2[key] >= obj1[key]
    );
  }
  return false;
}

function clean(obj1, obj2) {
  for (var propName in obj1) {
    if (obj1[propName] === 0) {
      delete obj1[propName];
      delete obj2[propName];
    }
  }
  return { obj1, obj2 };
}
