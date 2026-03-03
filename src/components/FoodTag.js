import React from "react";
import { FaLeaf, FaBone } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";

export default function FoodTag({
  type = true,
  size = 5,
  variant = "simple",
  back = true,
}) {
  if (variant === "simple")
    return (
      <span
        className="foodtag"
        style={{
          borderColor: type ? "green" : "red",
          padding: `${size + 2}px`,
        }}
      >
        <span
          style={{
            background: type ? "green" : "red",
            // padding: `${size}px`,
          }}
        />
      </span>
    );
  else
    return type ? (
      <FaLeaf
        className="fancy-foodtag"
        style={{
          background: back ? "#43a04725" : "transparent",
          color: "#43a047",
        }}
        size={size}
      />
    ) : (
      <GiMeat
        className="fancy-foodtag"
        style={{
          background: back ? "#d5000025" : "transparent",
          color: "#d50000",
        }}
        size={size}
      />
    );
}
