import styled from "styled-components";

export const Div = styled.div`
  ${(props) => (props.fullWidth ? "width:100%;" : "")}
  ${(props) => (props.fullheight ? "height:100%;" : "")}
  padding:10px;
`;

export const BackDropDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.bcolor || "transparent"};
  z-index: 5;
  animation: fadein 0.2s;
`;
