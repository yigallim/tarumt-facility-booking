import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, List, Popconfirm, Space, Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import BookingStatus from "../../components/BookingStatus";
import { useEffect, useMemo } from "react";
import { deleteBooking, getBookings } from "../../api/bookings";
import useAccountState from "../../hooks/states/useAccountState";
import useBookingState from "../../hooks/states/useBookingState";
import useFacilityState from "../../hooks/states/useFacilityState";
import { Tables } from "../../types/supabase";
import useApp from "../../hooks/useApp";
import useBreakpoint from "../../hooks/useBreakPoint";

function getDatewithDay(bookDate: string) {
  const date = new Date(bookDate);
  const dayOfWeek = date.getDay();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const formattedDate = date.toISOString().split("T")[0];
  return `${formattedDate} ${daysOfWeek[dayOfWeek]}`;
}

function convertToAMPM(hour: number): string {
  const time = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "AM" : "PM";
  const formattedTime = time.toString().padStart(2, "0");
  return formattedTime + ":00" + suffix;
}

const BookingHistory = () => {
  const { md } = useBreakpoint();
  const { notification } = useApp();
  const { facilities } = useFacilityState();
  const { accounts } = useAccountState();
  const { bookings, setBookings, loading, setLoading } = useBookingState();

  const indexedBookings = useMemo(
    () => bookings.map((booking, index) => ({ ...booking, index: index + 1 })),
    [bookings]
  );

  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/main/newbooking");
  };

  const refresh = async () => {
    const { data, error } = await getBookings();
    if (!error) {
      setBookings(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    const timeoutId = setTimeout(() => {
      refresh();
    }, timeUntilMidnight + 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const getAccountInfo = (accountId: string) => {
    const account = accounts.find((acc) => acc._id === accountId);
    return account ? `${account.name} ( ${account.student_id} )` : "N/A";
  };

  const getFacilityName = (facilityId: string) => {
    const facility = facilities.find((facility) => facility._id === facilityId);
    return facility ? facility.name : "N/A";
  };

  const handleDelete = async (record: Tables<"bookings">) => {
    setLoading(true);
    const { error } = await deleteBooking(record._id);
    if (error) {
      notification.error({
        message: "Failed To Delete",
        description: "Unexpected error occurred, please try again.",
      });
    } else {
      notification.success({
        message: "Deleted Successfully",
        description: "You've successfully deleted bookings",
      });
      refresh();
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Account",
      dataIndex: "account_id",
      key: "account_id",
      render: (accountId: string) => getAccountInfo(accountId),
    },
    {
      title: "Facility",
      dataIndex: "facility_id",
      key: "facility_id",
      render: (facilityId: string) => getFacilityName(facilityId),
    },
    Table.EXPAND_COLUMN,
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <BookingStatus>{status}</BookingStatus>,
    },
    {
      title: "Booking Date",
      dataIndex: "book_date",
      key: "book_date",
      render: (bookDate: string) => getDatewithDay(bookDate),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (start_time: number) => convertToAMPM(start_time),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (end_time: number) => convertToAMPM(end_time),
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: Tables<"bookings">) => {
        return (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <a>Delete</a>
          </Popconfirm>
        );
      },
    },
  ];

  const tableDom = useMemo<React.ReactNode>(() => {
    return (
      <Table
        rowKey="_id"
        scroll={{ x: 800 }}
        size="small"
        columns={columns}
        dataSource={indexedBookings}
        loading={loading}
        expandable={{
          expandedRowRender: (record) => {
            const bookDate = new Date(record.book_date);
            const threeDaysBefore = new Date(bookDate);
            threeDaysBefore.setDate(bookDate.getDate() - 2);
            const formattedThreeDaysBefore = `${threeDaysBefore.getFullYear()}-${(
              threeDaysBefore.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${threeDaysBefore.getDate().toString().padStart(2, "0")}`;

            return (
              <Flex vertical style={{ padding: "6px 12px" }}>
                <Typography.Text strong>Message: </Typography.Text>
                <Typography.Text>
                  {record.response_msg || `Triggering soon in 12:00AM ${formattedThreeDaysBefore}`}
                </Typography.Text>
              </Flex>
            );
          },
        }}
      />
    );
  }, [bookings, loading]);

  return (
    <Space direction="vertical" size={16}>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Bookings
      </Button>
      {md ? (
        tableDom
      ) : (
        <List
          loading={loading}
          itemLayout="vertical"
          pagination={{ position: "bottom", align: "center" }}
          dataSource={indexedBookings}
          renderItem={(item) => {
            const bookDate = new Date(item.book_date);
            const threeDaysBefore = new Date(bookDate);
            threeDaysBefore.setDate(bookDate.getDate() - 2);
            const formattedThreeDaysBefore = `${threeDaysBefore.getFullYear()}-${(
              threeDaysBefore.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${threeDaysBefore.getDate().toString().padStart(2, "0")}`;

            return (
              <List.Item
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Sure to delete?"
                    onConfirm={() => handleDelete(item)}
                  >
                    <a>Delete</a>
                  </Popconfirm>,
                ]}
                style={{ position: "relative" }}
              >
                <Flex gap={24} justify="space-between">
                  <List.Item.Meta
                    style={{ marginBottom: 6, textWrap: "nowrap" }}
                    title={item.index + ". " + getFacilityName(item.facility_id)}
                  />
                  <BookingStatus>{item.status}</BookingStatus>
                </Flex>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Flex gap={24} justify="space-between" align="center">
                    <Space size={4} direction="vertical">
                      <Typography.Text style={{ textWrap: "nowrap" }}>Booked By :</Typography.Text>
                      <Typography.Text style={{ textWrap: "nowrap" }}>
                        {getAccountInfo(item.account_id)}
                      </Typography.Text>
                    </Space>
                    <Space align="end" size={4} direction="vertical">
                      <Typography.Text style={{ textWrap: "nowrap" }}>
                        {getDatewithDay(item.book_date)}
                      </Typography.Text>
                      <Typography.Text style={{ textWrap: "nowrap" }}>
                        {convertToAMPM(item.start_time)} - {convertToAMPM(item.end_time)}
                      </Typography.Text>
                    </Space>
                  </Flex>
                  <Typography.Text type="secondary">
                    Message :{" "}
                    {item.response_msg || `Triggering soon in 12:00AM ${formattedThreeDaysBefore}`}
                  </Typography.Text>
                </Space>
              </List.Item>
            );
          }}
        />
      )}
    </Space>
  );
};

export default BookingHistory;
