import { Div } from "components/Elements";
import { useSelector } from "react-redux";
import { ItemRenderer, MultiSelect2 } from "@blueprintjs/select";
import {
  Button,
  Code,
  Dialog,
  H5,
  Intent,
  MenuItem,
  Switch,
  TagProps,
} from "@blueprintjs/core";
import { useState } from "react";
import SalesReport from "./SalesReport";

const escapeRegExpChars = (text) => {
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};
const highlightText = (text, query) => {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
};

export default function Forms() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Div className="forms" fullheight>
      <div>
        <div className="forms-header">
          <Button onClick={() => setIsOpen((prev) => !prev)}>Open</Button>
          <SalesReport isOpen={isOpen} close={() => setIsOpen(false)} />
        </div>
      </div>
    </Div>
  );
}
