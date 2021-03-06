import React from "react";
import styled from "styled-components";

interface Props {
  size: string;
}

const Circle = styled.div`
  height: calc(${(props) => props.size} / 2);
  width: calc(${(props) => props.size} / 2);
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  flex-direction: column;
  border: 0.1rem solid gray;
  align-items: center;
  border-radius: 50%;
`;
const CircleInner = styled.div`
  height: calc(${(props) => props.size} / 4);
  width: calc(${(props) => props.size} / 4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0.1rem solid gray;
  border-radius: 50%;
`;
const Dot = styled.div`
  height: calc(${(props) => props.size} / 10);
  width: calc(${(props) => props.size} / 10);
  margin: ${(props) =>
    props.marginUp
      ? ` calc(${props.size} / 20 *-1) 0`
      : `0  calc(${props.size} / 20 *-1)`};
  background-color: black;
  border: calc(${(props) => props.size} / 32.948) solid white;
  border-radius: 50%;
`;

export const Logo: React.FC<Props> = ({ size }) => {
  return (
    <>
      <Circle size={size}>
        <Dot size={size} marginUp></Dot>
        <CircleInner size={size}>
          <Dot size={size}></Dot>
          <Dot size={size}></Dot>
        </CircleInner>
        <Dot size={size} marginUp></Dot>
      </Circle>
    </>
  );
};
