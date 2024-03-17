import { Button, Result } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

const RegisterSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <Result
      status="success"
      title="Account registered successfully"
      subTitle={`Email registered: ${searchParams.get("email")}`}
      extra={[
        <Button type="primary" key="console" onClick={() => navigate("/login")}>
          Go To Login
        </Button>,
      ]}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: "translateY(-30px)",
      }}
    />
  );
};

export default RegisterSuccess;
