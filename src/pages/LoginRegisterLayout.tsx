import React from "react";
import { useState } from "react";
import { Card, Flex } from "antd";
import Login from "./Login";
import Register from "./Register";
import Logo from "../components/Logo";

const tabsTitle = [
  {
    key: "login",
    label: "Login",
  },
  {
    key: "register",
    label: "Register Account",
  },
];

const tabsContent: Record<string, React.ReactNode> = {
  login: <Login />,
  register: <Register />,
};

const LoginRegisterLayout = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>(tabsTitle[0].key);

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <Flex
      style={{
        height: "100%",
        width: "100%",
        padding: 24,
        boxSizing: "border-box",
        transform: "translateY(-30px)",
      }}
      gap={28}
      vertical
      align="center"
      justify="center"
    >
      <Card bordered={false} title={false}>
        <Logo />
      </Card>
      <Card
        style={{ minWidth: 300, width: "100%", maxWidth: 450 }}
        tabList={tabsTitle}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
        tabProps={{
          size: "middle",
          centered: true,
        }}
        bordered={false}
        type="inner"
      >
        {tabsContent[activeTabKey]}
      </Card>
    </Flex>
  );
};

export default LoginRegisterLayout;
