import { useEffect, useRef, useState } from "react";
import { Table, Space, Popconfirm, Button, Modal, Form, Input, FormInstance } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, PlusOutlined } from "@ant-design/icons";
import { addAccount, deleteAccount, editAccount, getAccounts } from "../../api/accounts";
import useAccountState, { UserData } from "../../hooks/states/useAccountState";
import useApp from "../../hooks/useApp";
import { InsertType } from "../../types/helper";

interface ModalFormProps {
  open: boolean;
  onCancel: () => void;
  mode: "add" | "edit";
  form: FormInstance;
  onFinish: (values: UserData) => void;
}

const ModalForm = ({ open, onCancel, mode, form, onFinish }: ModalFormProps) => {
  return (
    <Modal
      forceRender
      title={`${mode === "add" ? "Add" : "Edit"} Account`}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Student ID"
          name="student_id"
          rules={[
            { required: true, message: "Please input the student ID!" },
            { pattern: /^[0-9]{7}$/, message: "Student ID should contain 7 digits only!" },
          ]}
        >
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input the password!" },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
              message:
                "Password should contain at least one alphabet, one numeric, and one special character, and be at least 8 characters long!",
            },
          ]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>

        <Space style={{ width: "100%", justifyContent: "end" }}>
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>

          <Button key="submit" htmlType="submit" type="primary">
            Submit
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

const Account = () => {
  const [showPasswordsFor, setShowPasswordsFor] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<UserData>();
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const edittingAccountId = useRef<string | null>(null);
  const previousFormValues = useRef<InsertType<"accounts"> | null>(null);

  const { accounts, setAccounts, loading, setLoading } = useAccountState();
  const { notification } = useApp();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const { data, error } = await getAccounts();
    if (!error) {
      setAccounts(data);
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswordsFor((prevState) =>
      prevState.includes(key) ? prevState.filter((k) => k !== key) : [...prevState, key]
    );
  };

  const handleAdd = () => {
    form.resetFields();
    setModalMode("add");
    previousFormValues.current = null;
    edittingAccountId.current = null;
    setModalOpen(true);
  };

  const handleEdit = (record: UserData) => {
    form.setFieldsValue(record);
    setModalMode("edit");
    previousFormValues.current = {
      name: record.name,
      student_id: record.student_id,
      password: record.password,
    };
    edittingAccountId.current = record._id;
    setModalOpen(true);
  };

  const handleDelete = async (record: UserData) => {
    setLoading(true);
    const { error } = await deleteAccount(record._id);
    if (error) {
      if (error.code === "23503") {
        notification.error({
          message: "This Record Can't Be Deleted",
          description:
            "This account is associated with existing bookings. Please delete the associated bookings first.",
        });
      } else {
        notification.error({
          message: "Failed To Delete",
          description: "Unexpected error occurred, please try again.",
        });
      }
    } else {
      notification.success({
        message: "Deleted Successfully",
        description: `You've deleted account \"${record.name}\"`,
      });
    }
    refresh();
    setLoading(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const onFinish = async (values: InsertType<"accounts">) => {
    setLoading(true);
    setModalOpen(false);
    if (modalMode === "add") {
      const { error } = await addAccount(values);
      if (error) {
        notification.error({
          message: "Failed To Add Account",
          description: "Unexpected error occurred, please try again.",
        });
      } else {
        notification.success({
          message: "Added Successfully",
          description: `You've added account \"${values.name}\"`,
        });
      }
    } else {
      if (JSON.stringify(values) === JSON.stringify(previousFormValues.current)) {
        notification.warning({
          message: "No Changes",
          description: "There are no changes to save.",
        });
        setLoading(false);
        return;
      }
      const { error } = await editAccount(edittingAccountId.current!, values);
      if (error) {
        notification.error({
          message: "Failed To Edit Account",
          description: "Unexpected error occurred, please try again.",
        });
      } else {
        notification.success({
          message: "Edited Successfully",
          description: `You've edited account \"${values.name}\"`,
        });
      }
    }
    refresh();
    setLoading(false);
  };

  const columns = [
    {
      width: "8%",
      title: "#",
      key: "index",
      render: (_: string, __: UserData, index: number) => index + 1,
    },
    {
      width: "20%",
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      width: "30%",
      title: "Student ID",
      dataIndex: "student_id",
      key: "student_id",
    },
    {
      width: "30%",
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (text: string, record: UserData) => (
        <Space>
          {showPasswordsFor.includes(record._id) ? text : "*".repeat(12)}
          {showPasswordsFor.includes(record._id) ? (
            <EyeInvisibleOutlined onClick={() => togglePasswordVisibility(record._id)} />
          ) : (
            <EyeOutlined onClick={() => togglePasswordVisibility(record._id)} />
          )}
        </Space>
      ),
    },
    {
      width: "12%",
      title: "Action",
      key: "action",
      render: (_: string, record: UserData) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16}>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Account
      </Button>
      <Table
        loading={loading}
        scroll={{ x: 540 }}
        size="small"
        columns={columns}
        dataSource={accounts}
        rowKey="_id"
      />
      <ModalForm
        mode={modalMode}
        open={modalOpen}
        onCancel={handleCancel}
        form={form}
        onFinish={onFinish}
      />
    </Space>
  );
};

export default Account;
