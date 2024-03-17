import { Button, Form, Input, Checkbox, Tooltip, Grid } from "antd";
import { useState } from "react";
import supabase from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import useApp from "../hooks/useApp";
const { useBreakpoint } = Grid;

type FieldType = {
  email: string;
  password: string;
  confirmPassword?: string;
  remember?: string;
  agreeTerms?: boolean;
};

const Register = () => {
  const { notification } = useApp();
  const { sm } = useBreakpoint();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [emailError, setEmailError] = useState<string | null>(null);

  const emptyLabel = sm && " ";

  const onFinish = async (values: FieldType) => {
    const { email, password } = values;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.status === 400) {
        setEmailError("Email is previously registered, try another.");
      } else {
        notification.error({
          message: "Failed to register",
          description: "Unexpected error occured, please try again.",
        });
      }
    } else {
      setEmailError(null);
      navigate(`/success?email=${data.user?.email}`, { replace: true });
    }
  };

  return (
    <Form
      form={form}
      name="register"
      labelCol={{ flex: sm ? "90px" : undefined }}
      style={{ minWidth: "100%" }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      scrollToFirstError
      labelWrap
      colon={false}
    >
      <Form.Item
        name="email"
        label="Email"
        validateStatus={emailError ? "error" : undefined}
        help={emailError}
        rules={[
          { required: true, message: "Please input your email" },
          { type: "email", message: "This is not a valid email" },
        ]}
      >
        <Input
          onChange={() => {
            if (emailError) setEmailError(null);
          }}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password",
          },
          { min: 8, message: "Password must be at least 8 characters long" },
          { max: 64, message: "Password cannot exceed 64 characters" },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("The passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label={emptyLabel}
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("You must accept the agreement")),
          },
        ]}
      >
        <Checkbox>
          I understand the{" "}
          <Tooltip
            title={
              <div>
                <p>1. TARUMT might notice your requests if tried very frequently.</p>
                <p>2. This system only interacts with the TARUMT intranet APIs.</p>
                <p>3. You will not hold any party responsible if any issues occur.</p>
                <p>
                  4. In case of forgetting the password, your account may be lost. Please contact
                  creator personally for account recovery.
                </p>
              </div>
            }
          >
            <a href="#">risks</a>
          </Tooltip>{" "}
          of this system.
        </Checkbox>
      </Form.Item>

      <Form.Item label={emptyLabel} style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" style={{ minWidth: 120 }}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
