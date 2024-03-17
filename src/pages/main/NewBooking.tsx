import { Button, Col, DatePicker, Form, Row, Select } from "antd";
import useAccountState from "../../hooks/states/useAccountState";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useFacilityState from "../../hooks/states/useFacilityState";
import dayjs, { Dayjs } from "dayjs";
import { InsertType } from "../../types/helper";
import useApp from "../../hooks/useApp";
import { addBooking } from "../../api/bookings";
import { useState } from "react";

type BookingFormType = {
  account_id: string;
  facility_id: string;
  date: Dayjs;
  time: {
    start_time: number;
    end_time: number;
  };
};

const minDate = dayjs().add(3, "day");
const maxDate = dayjs().add(3, "month");

type TimeOption = {
  label: string;
  value: number;
};

const timeOptions: TimeOption[] = [];
for (let hour = 8; hour <= 21; hour++) {
  const amPM = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  const timeValue = hour;
  timeOptions.push({
    label: `${displayHour.toString().padStart(2, "0")}:00 ${amPM}`,
    value: timeValue,
  });
}

const endTimeOptions: TimeOption[] = [];
for (let hour = 9; hour <= 22; hour++) {
  const amPM = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  const timeValue = hour;
  endTimeOptions.push({
    label: `${displayHour.toString().padStart(2, "0")}:00 ${amPM}`,
    value: timeValue,
  });
}

const NewBooking = () => {
  const [loading, setLoading] = useState(false);
  const { notification } = useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { accounts } = useAccountState();
  const { facilities } = useFacilityState();

  const selectAccountOptions = accounts.map((account) => {
    return {
      value: account._id,
      label: `${account.name}   ( ${account.student_id} )`,
    };
  });

  const selectFacilityOptions = facilities.map((facility) => ({
    value: facility._id,
    label: facility.name,
  }));

  const validateTimeRange = (_: any, value: { start_time?: number; end_time?: number }) => {
    if (value == undefined || value.start_time == undefined || value.end_time == undefined)
      return Promise.reject("Please select both start and end time!");

    const { end_time, start_time } = value;

    if (end_time == start_time) return Promise.reject("The start time and end time is same!");

    if (end_time < start_time)
      return Promise.reject("The start time should be earlier than end time!");

    if (end_time - start_time > 2)
      return Promise.reject("The duration should be not more than 2 hours!");

    return Promise.resolve();
  };

  const handleSelectChange = () => {
    form.validateFields(["time"]);
  };

  const handleFinish = async (data: BookingFormType) => {
    setLoading(true);
    const {
      account_id,
      facility_id,
      time: { start_time, end_time },
    } = data;

    const payload: InsertType<"bookings"> = {
      account_id,
      facility_id,
      start_time,
      end_time,
      book_date: data.date.format("YYYY/MM/DD"),
    };

    const { error } = await addBooking(payload);
    if (error) {
      notification.error({
        message: "Failed To Add Booking",
        description: "Unexpected error occurred, please try again.",
      });
    } else {
      notification.success({
        message: "Added Successfully",
        description: "You've added a scheduled booking successfully",
      });
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      variant="filled"
      style={{ maxWidth: "500px" }}
      onFinish={handleFinish}
    >
      <Form.Item label="Student Account" required>
        <Row gutter={[8, 6]}>
          <Col flex={1}>
            <Form.Item
              name="account_id"
              noStyle
              rules={[{ required: true, message: "Please select an account!" }]}
            >
              <Select options={selectAccountOptions} style={{ minWidth: "200px" }} />
            </Form.Item>
          </Col>
          <Col>
            <Button
              type="default"
              onClick={() => {
                navigate("/main/account");
              }}
              icon={<PlusOutlined />}
            >
              Add Account
            </Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        label="Facility"
        name="facility_id"
        rules={[{ required: true, message: "Please select an facility!" }]}
      >
        <Select options={selectFacilityOptions} />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: "Please select a date!" }]}
        extra="You can just book facility in TARUMT official intranet if the selected date is within two days from today."
      >
        <DatePicker style={{ width: "100%" }} minDate={minDate} maxDate={maxDate} />
      </Form.Item>

      <Form.Item
        label="Time Duration"
        name="time"
        htmlFor="time_start_time"
        rules={[{ validator: validateTimeRange }]}
        required
      >
        <Row gutter={[8, 6]}>
          <Col span={12}>
            <Form.Item noStyle name={["time", "start_time"]}>
              <Select
                placeholder="Start time"
                options={timeOptions}
                onChange={handleSelectChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item noStyle name={["time", "end_time"]}>
              <Select
                placeholder="End time"
                options={endTimeOptions}
                onChange={handleSelectChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item>
        <Row gutter={8} style={{ marginTop: 8 }}>
          <Col span={12}>
            <Button loading={loading} style={{ width: "100%" }} htmlType="submit" type="primary">
              Submit
            </Button>
          </Col>
          <Col span={12}>
            <Button style={{ width: "100%" }} htmlType="reset">
              Reset
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default NewBooking;
