import {
  Dialog,
  FormGroup,
  InputGroup,
  MenuItem,
  NumericInput,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";
import { DateInput2 } from "@blueprintjs/datetime2";
import { MultiSelect2 } from "@blueprintjs/select";
import moment from "moment";
import { useCallback } from "react";
import { useState } from "react";
import { IoMdCalendar } from "react-icons/io";
import { useSelector } from "react-redux";

export default function SalesReport({ isOpen, close }) {
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [item, setItem] = useState("");

  const outlets = useSelector((state) => state.outlets);

  const [dateValue, setDateValue] = useState(moment());
  const handleChange = useCallback(setDateValue, []);
  const formatDate = useCallback((date) => date.toLocaleString(), []);
  const parseDate = useCallback((str) => new Date(str), []);

  return (
    <Dialog
      isOpen={isOpen}
      // canEscapeKeyClose
      canOutsideClickClose={false}
      onClose={close}
      title="Sale report"
      style={{ width: "800px", minHeight: "800px", margin: "1rem" }}
    >
      <div className="form">
        <FormGroup
          label="Select outlets"
          labelFor="outlet"
          labelInfo="(required)"
        >
          <div id="outlet">
            <MultiSelect2
              activeItem={item}
              items={outlets || []}
              selectedItems={selectedOutlets}
              noResults={
                <MenuItem
                  disabled={true}
                  text="No results."
                  roleStructure="listoption"
                />
              }
              itemRenderer={(val, itemProps) => {
                return (
                  <MenuItem
                    key={val.id}
                    id={val.id}
                    text={val.Outletname}
                    selected={selectedOutlets.some((v) => v === val.Outletname)}
                    disabled={selectedOutlets.some((v) => v === val.Outletname)}
                    onClick={(elm) => {
                      setItem(elm.target.textContent);
                      setSelectedOutlets((items) => {
                        return [...items, elm.target.textContent];
                      });
                    }}
                    active={itemProps.modifiers.active}
                  />
                );
              }}
              //   onItemSelect={(items) => setSelectedOutlets(items)}
              tagRenderer={(item) => item}
              onRemove={(item) => {
                setSelectedOutlets((items) =>
                  items.filter((elm) => elm !== item)
                );
              }}
              onClear={() => setSelectedOutlets([])}
            />
          </div>
        </FormGroup>
        <FormGroup label="Sale Date" labelFor="date" labelInfo="(required)">
          <div id="date">
            <DateInput2
              formatDate={(d) => moment(d).format("DD/MM/YYYY")}
              onChange={handleChange}
              parseDate={parseDate}
              placeholder="DD/MM/YYYY"
              showActionsBar
              highlightCurrentDay
              value={dateValue}
            />
          </div>
        </FormGroup>

        <RadioGroup
          label="Are there any expenses?"
          onChange={() => {}}
          selectedValue={true}
          inline
        >
          <Radio label="Yes" value={true} />
          <Radio label="No" value={false} />
        </RadioGroup>
        <FormGroup
          label="Total Sale"
          labelFor="total-sale"
          labelInfo="(required)"
        >
          <InputGroup id="total-sale" />
        </FormGroup>
        <FormGroup label="Total MTD" labelFor="mtd">
          <InputGroup id="mtd" />
        </FormGroup>
        <FormGroup
          label="Daily Cash Sale"
          labelFor="opening"
          labelInfo="(required)"
        >
          <InputGroup id="opening" />
        </FormGroup>
        <FormGroup
          label="Opening Balance"
          labelFor="opening"
          labelInfo="(required)"
        >
          <InputGroup id="opening" />
        </FormGroup>
        <FormGroup
          label="Bank Deposit"
          labelFor="bank-deposit"
          labelInfo="(required)"
        >
          <InputGroup id="bank-deposit" />
        </FormGroup>
        <FormGroup
          // helperText="Helper text with details..."
          label="Cash Received (from Office/Happay/Others)"
          labelFor="cash-received"
          labelInfo="(required)"
        >
          <InputGroup id="cash-received" />
        </FormGroup>
        <FormGroup
          label="Total Cash in Hand"
          labelFor="cash-in-hand"
          labelInfo="(required)"
        >
          <InputGroup id="cash-in-hand" />
        </FormGroup>
      </div>
    </Dialog>
  );
}
