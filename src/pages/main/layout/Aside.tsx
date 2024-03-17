import { format } from "date-fns";
import { Card, Flex, Statistic, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useApp from "../../../hooks/useApp";
import getLastPath from "../../../utils/getLastPath";
import WarningBlame from "../../../components/WarningBlame";
import useBookingState from "../../../hooks/states/useBookingState";

const Aside = () => {
  const { bookings } = useBookingState();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { pathname } = useLocation();
  const { notification } = useApp();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return format(date, "EEEE, dd MMMM yyyy");
  };

  const checkOnHistoryPage = () => {
    const path = getLastPath(pathname);
    if (path === "history")
      notification.info({
        message: "Not navigating",
        description: "Already at booking history page.",
      });
  };

  return (
    <Flex gap={18} vertical style={{ width: 260, minWidth: 260 }}>
      <Card bordered={false} style={{ boxShadow: "0px 2px 8px 0 rgba(0,0,0,0.07)" }}>
        <Statistic title="Current Time" value={currentTime.toLocaleTimeString()} precision={2} />
        <Typography.Text>{formatDate(currentTime)}</Typography.Text>
      </Card>
      <Card bordered={false} style={{ boxShadow: "0px 2px 8px 0 rgba(0,0,0,0.07)" }}>
        <Flex justify="space-between" style={{ marginBottom: 4 }}>
          <Typography.Text type="secondary">Pending Bookings</Typography.Text>
          <Link to="/main/history" onClick={checkOnHistoryPage}>
            Details
          </Link>
        </Flex>
        <Typography.Text style={{ fontSize: 24 }}>
          {bookings.filter((booking) => booking.status === "pending").length}
        </Typography.Text>
      </Card>
      <WarningBlame />
    </Flex>
  );
};

export default Aside;
