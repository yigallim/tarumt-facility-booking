import { Flex, Typography } from "antd";
import TopBar from "./TopBar";
import Main from "./Main";
import { Outlet, useLocation } from "react-router-dom";
import Aside from "./Aside";
import Navigator, { titleMap } from "./Navigator";
import useBreakpoint from "../../../hooks/useBreakPoint";
import getLastPath from "../../../utils/getLastPath";

const Layout = () => {
  const { md } = useBreakpoint();
  const { pathname } = useLocation();

  const title = titleMap[getLastPath(pathname)!];

  return (
    <Flex vertical style={{ height: "100%" }}>
      <TopBar />
      <Flex
        vertical={!md}
        style={{
          padding: md ? "24px 36px 24px 36px" : "24px 16px 24px 16px",
          flex: 1,
          marginTop: 56,
        }}
        gap={md ? 36 : 18}
      >
        {md ? (
          <Aside />
        ) : (
          <Typography.Title level={4} style={{ margin: 0, marginTop: 4 }}>
            {title}
          </Typography.Title>
        )}
        <Main>
          {md && <Navigator />}
          <Outlet />
        </Main>
      </Flex>
    </Flex>
  );
};

export default Layout;
