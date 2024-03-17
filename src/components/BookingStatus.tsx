import { CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import React from "react";

type BookingStatusProps = {
  children: string;
};

const textStatusMap: Record<string, string> = {
  pending: "Pending",
  failed: "Failed",
  success: "Success",
};

const colorStatusMap: Record<string, string> = {
  pending: "processing",
  failed: "error",
  success: "success",
};

const iconStatusMap: Record<string, React.ReactNode> = {
  pending: <SyncOutlined />,
  failed: <ExclamationCircleOutlined />,
  success: <CheckCircleOutlined />,
};

const BookingStatus = ({ children }: BookingStatusProps) => {
  return (
    <Tag bordered={false} color={colorStatusMap[children]} icon={iconStatusMap[children]}>
      {textStatusMap[children]}
    </Tag>
  );
};

export default BookingStatus;
