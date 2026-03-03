import { Button, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, Select2 } from "@blueprintjs/select";
import React from "react";
import ReactDOM from "react-dom";

export const CustomSelect = ({
  items = [],
  setSelected,
  selected,
  labelAccessor,
  valueAccessor,
}) => {
  console.log("🚀 ~ file: CustomSelect.js:13 ~ selected", selected);
  const filterFilm = (query, film, _index, exactMatch) => {
    const normalizedTitle = film[labelAccessor].toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${film[labelAccessor]}. ${normalizedTitle}`.indexOf(normalizedQuery) >=
        0
      );
    }
  };
  const renderItem = (item, { handleClick, handleFocus, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={item[valueAccessor]}
        label={item[labelAccessor]}
        onClick={handleClick}
        onFocus={handleFocus}
        roleStructure="listoption"
        text={item[labelAccessor]}
      />
    );
  };
  return (
    <Select2
      items={items}
      itemPredicate={filterFilm}
      itemRenderer={renderItem}
      noResults={
        <MenuItem
          disabled={true}
          text="No results."
          roleStructure="listoption"
        />
      }
      onItemSelect={setSelected}
    >
      <Button
        text={selected?.center_name}
        rightIcon="double-caret-vertical"
        placeholder="Select a film"
      />
    </Select2>
  );
};
