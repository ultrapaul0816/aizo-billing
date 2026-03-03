import styled from "styled-components";

export const FullScreenWrapper = styled.div`
  height: 100vh;
`;
export const CenterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.cols ? props.cols.join(" ") : "auto"};
  grid-template-rows: ${(props) =>
    props.rows ? props.rows.join(" ") : "auto"};
  height: ${(props) => (props.full ? "100%" : "auto")};
  column-gap: ${(props) => props.cgap || "0px"};
  row-gap: ${(props) => props.rgap || "0px"};
  grid-row-start: ${(props) => props.rs || "auto"};
  grid-row-end: ${(props) => props.re || "auto"};
  grid-column-start: ${(props) => props.cs || "auto"};
  grid-column-end: ${(props) => props.ce || "auto"};
`;
export const Expanded = styled.div`
  height: 100%;
  width: 100%;
`;
export const BackFace = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  zindex: ${(props) => props.z || "2"};
`;
