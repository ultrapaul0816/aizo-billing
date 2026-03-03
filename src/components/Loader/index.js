import "./style.scss";
import { Spinner } from "@blueprintjs/core";

export const Loader = () => {
  return <Spinner className="suspense-loader" intent="primary" />;
};
