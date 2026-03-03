import { useIntl } from "react-intl";

import { CenterContent } from "../../../../../components/Layout";
import {
  Spinner,
  Button,
  Tag,
  Switch,
  Position,
  Tooltip,
  Card,
  Popover,
  Icon,
} from "@blueprintjs/core";

import FoodTag from "../../../../../components/FoodTag";
import { BackDropDiv } from "../../../../../components/Elements";
import { formatedText, toAbsoluteUrl } from "../../../../../utils/helpers";

export default function ProductCard({
  p,
  load,
  addToCart,
  currency,
  product_toggle,
  toggleProductAvailability,
}) {
  const intl = useIntl();

  return (
    <Card
      interactive={p.is_available}
      className="pr-item"
      style={
        !p.is_available
          ? {
              backgroundColor: "#eee",
              boxShadow: "none",
            }
          : {}
      }
    >
      {load.includes(p.id) ? (
        <BackDropDiv bcolor="#ffffff97">
          <CenterContent>
            <Spinner size={Spinner.SIZE_SMALL} intent="primary" />
          </CenterContent>
        </BackDropDiv>
      ) : (
        ""
      )}
      <div className="prod-image">
        <img
          loading="lazy"
          src={p.primary_image || toAbsoluteUrl("/media/no-image.jpg")}
          alt="product"
          onClick={(e) => addToCart(e, p)}
        />

        {p.customize_detail?.customize_data[0]?.groups?.length > 1 && (
          <span className="customization">customizable</span>
        )}
      </div>

      <div className="pr-item-body" onClick={(e) => addToCart(e, p)}>
        <FoodTag
          back={false}
          type={p.food_type === "Vegetarian"}
          variant="simple"
          size={5}
        />
        <div className="body-head">
          <Tooltip
            className="name-container"
            content={p.description}
            position={Position.BOTTOM}
          >
            <span className="name">
              {p.product_name}{" "}
              {/* <Icon icon="info-sign" style={{ color: "gray" }} /> */}
            </span>
          </Tooltip>
          <div className="details">
            <Tag large className="price-tag" minimal>
              {p.fprice != 0 && (
                <del style={{ color: "red" }}>{currency + " " + p.fprice}</del>
              )}
              <span>
                {p.customize_detail?.customize_data[0]?.groups?.length > 1 &&
                  "from"}{" "}
                {currency + " " + p.price}
              </span>{" "}
            </Tag>
            <div className="allergens">
              {p?.allergen_information?.map((item) => (
                <Tooltip content={item}>
                  <img
                    src={toAbsoluteUrl(`/icons/${formatedText(item)}.svg`)}
                    alt={item}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pr-item-bottom">
        {product_toggle && (
          <Popover
            minimal
            interactionKind="click"
            usePortal={false}
            hoverOpenDelay={50}
            hoverCloseDelay={50}
            content={
              <div style={{ padding: 10 }}>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Switch
                    style={{ width: "maxContent" }}
                    defaultChecked={p.is_available}
                    disabled={load.includes(p.id)}
                    label={intl.formatMessage({
                      id: "Website",
                    })}
                    onChange={(e) => {
                      toggleProductAvailability(0, p, e);
                    }}
                  />
                  {!!p.urban_detail && (
                    <Switch
                      defaultChecked={p.urban_detail.is_available}
                      disabled={load.includes(p.id)}
                      label="Aggregator"
                      onChange={() => {
                        toggleProductAvailability(1, p);
                      }}
                    />
                  )}
                </span>
              </div>
            }
            position={Position.BOTTOM_RIGHT}
          >
            <Button
              minimal
              rightIcon="chevron-down"
              className="pr-edit"
              text={intl.formatMessage({
                id: "Availability",
              })}
            />
          </Popover>
        )}
      </div>
    </Card>
  );
}
