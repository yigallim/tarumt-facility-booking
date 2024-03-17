import { Flex, Typography } from "antd";

const Logo = () => {
  return (
    <Flex gap={6} align="center">
      <img src="/logo.png" alt="Logo" />
      <Typography.Title level={5} style={{ margin: 0 }}>
        Facility Booking
      </Typography.Title>
    </Flex>
  );
};

export default Logo;
