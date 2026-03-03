import React from "react";
import MultiSelectComponent from "react-multi-select-component";

export default function MultiSelect(props) {
  const { overrideStrings } = props;
  return (
    <div style={{margin:'0px 5px'}}>
      <MultiSelectComponent
        {...props}
        labelledBy="filter"
        overrideStrings={{
          ...overrideStrings,
          // selectSomeItems: "spicy",
          allItemsAreSelected: "all selected",
          selectAll: "Select All",
          search: "Search",
          clearSearch: "Clear Search",
        }}
        disableSearch
      />
    </div>
  );
}
