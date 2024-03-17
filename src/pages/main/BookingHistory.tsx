import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Space, Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import BookingStatus from "../../components/BookingStatus";
import { useEffect } from "react";
import { deleteBooking, getBookings } from "../../api/bookings";
import useAccountState from "../../hooks/states/useAccountState";
import useBookingState from "../../hooks/states/useBookingState";
import useFacilityState from "../../hooks/states/useFacilityState";
import { Tables } from "../../types/supabase";
import useApp from "../../hooks/useApp";

function convertToAMPM(hour: number): string {
  const time = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "AM" : "PM";
  const formattedTime = time.toString().padStart(2, "0");
  return formattedTime + ":00 " + suffix;
}

const BookingHistory = () => {
  const { notification } = useApp();
  const { facilities } = useFacilityState();
  const { accounts } = useAccountState();
  const { bookings, setBookings, loading, setLoading } = useBookingState();
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
      render: (_: string, __: any, index: number) => index + 1,
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
    {
      title: "Booking Date",
      dataIndex: "book_date",
      key: "book_date",
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
    Table.EXPAND_COLUMN,
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <BookingStatus>{status}</BookingStatus>,
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

  return (
    <Space direction="vertical" size={16}>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Bookings
      </Button>
      <Table
        rowKey="_id"
        scroll={{ x: 800 }}
        size="small"
        columns={columns}
        dataSource={bookings}
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
                  {record.response_msg || `Triggering Soon in 12:00AM ${formattedThreeDaysBefore}`}
                </Typography.Text>
              </Flex>
            );
          },
        }}
      />
    </Space>
  );
};

export default BookingHistory;
