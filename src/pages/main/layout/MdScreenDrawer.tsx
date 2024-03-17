import { Drawer, GetProp, Menu, MenuProps } from "antd";
import Logo from "../../../components/Logo";
import { titleMap } from "./Navigator";
import { useLocation, useNavigate } from "react-router-dom";
import getLastPath from "../../../utils/getLastPath";
import WarningBlame from "../../../components/WarningBlame";

type MenuItem = GetProp<MenuProps, "items">[number];

interface MdScreenDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MdScreenDrawer = ({ open, onClose }: MdScreenDrawerProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = getLastPath(pathname);

  const items: MenuItem[] = Object.entries(titleMap).map(([key, value]) => ({
    key,
    label: value,
    onClick: () => {
      navigate(key);
      onClose();
    },
  }));

  return (
    <Drawer
      width={280}
      title={<Logo />}
      placement="left"
      closable={false}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          padding: 0,
          paddingTop: 8,
        },
      }}
      footer={<WarningBlame />}
    >
      <Menu style={{ border: "none" }} selectedKeys={[path!]} items={items} theme="light" />
    </Drawer>
  );
};

export default MdScreenDrawer;
