import { BarsOutlined, PlusCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getLastPath from "../../../utils/getLastPath";

export const titleMap: Record<string, any> = {
  newbooking: "New Booking",
  history: "Booking History",
  account: "Account Management",
};

const Navigator = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [segmentPath, setSegmentPath] = useState<string>(getLastPath(pathname)!);

  const changePage = (value: string) => {
    navigate(value);
  };

  useEffect(() => {
    const path = getLastPath(pathname);
    setSegmentPath(path!);
  }, [pathname]);

  return (
    <Segmented
      style={{ width: "min-content" }}
      onChange={changePage}
      options={[
        { label: "New Booking", value: "newbooking", icon: <PlusCircleOutlined /> },
        { label: "Booking History", value: "history", icon: <BarsOutlined /> },
        { label: "Account Management", value: "account", icon: <UserOutlined /> },
      ]}
      value={segmentPath}
    />
  );
};

export default Navigator;
