import { Button, Form, Input, Grid } from "antd";
import supabase from "../lib/supabase";
import useApp from "../hooks/useApp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const { useBreakpoint } = Grid;

type FieldType = {
  email: string;
  password: string;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { notification } = useApp();
  const { sm } = useBreakpoint();
  const [form] = Form.useForm();

  const emptyLabel = sm && " ";

  const onFinish = async (values: FieldType) => {
    const { email, password } = values;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.status === 400) {
        notification.error({
          message: "Failed to Login",
          description: "Wrong email or password, please try again.",
        });
      } else {
        notification.error({
          message: "Failed to register",
          description: "Unexpected error occured, please try again.",
        });
      }
    } else {
      notification.success({
        message: "Logged In",
        description: `You've successfully logged in with email: ${email}`,
      });
      navigate("/main/newbooking", { replace: true });
      login(data.user);
    }
  };

  return (
    <Form
      form={form}
      name="login"
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
        rules={[
          { required: true, message: "Please input your email" },
          { type: "email", message: "This is not a valid email" },
        ]}
      >
        <Input />
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

      <Form.Item label={emptyLabel} style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" style={{ minWidth: 120 }}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
