import { Avatar, Button, Dropdown, Flex, MenuProps, Space } from "antd";
import Logo from "../../../components/Logo";
import { DownOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";
import useSignOut from "../../../hooks/useSignOut";
import { Link } from "react-router-dom";
import useBreakpoint from "../../../hooks/useBreakPoint";
import MdScreenDrawer from "./MdScreenDrawer";
import { useState } from "react";

const UserProfileItem = () => {
  const { user } = useAuth();
  const signOut = useSignOut();

  const items: MenuProps["items"] = [
    {
      label: "Logout",
      key: "1",
      icon: <LogoutOutlined />,
      onClick: signOut,
    },
  ];

  return (
    <Flex align="center" gap={6}>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button type="text" style={{ boxSizing: "content-box", padding: 6 }}>
          <Space align="center">
            <Avatar size={32} icon={<UserOutlined />} />
            {user!.email}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Flex>
  );
};

const TopBar = () => {
  const { md } = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav style={{ height: 56, boxShadow: "0px 2px 8px 0 rgba(0,0,0,0.05)", overflow: "hidden" }}>
      <Flex
        align="center"
        justify="space-between"
        style={{
          height: "100%",
          margin: md ? "0 32px 0 36px" : "0 12px 0 16px",
          minWidth: "320px",
        }}
      >
        {md ? (
          <Link to="/main/newbooking">
            <Logo />
          </Link>
        ) : (
          <Button style={{ height: 36 }} onClick={toggleDrawer}>
            <MenuOutlined />
          </Button>
        )}

        <UserProfileItem />
      </Flex>
      <MdScreenDrawer open={md ? false : drawerOpen} onClose={toggleDrawer} />
    </nav>
  );
};

export default TopBar;
