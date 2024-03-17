import { Flex } from "antd";
import React from "react";

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <Flex component="main" vertical gap={24} flex={1} style={{ minWidth: 0, overflow: "hidden" }}>
      {children}
    </Flex>
  );
};

export default Main;
