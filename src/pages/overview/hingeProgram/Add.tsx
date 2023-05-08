import { memo, useEffect } from "react";
import { Modal, Form, Radio, message, Spin, InputNumber } from "antd";
import {
  addResource,
  getResourceDetail,
  updateResource,
} from "@/services/overviewHingeProgram";
import { useReducer } from "@/utils";
import moment from "moment";

const { useForm, Item: FormItem } = Form;

const LABEL_COL = { span: 6 };
const WRAPPER_COL = { span: 16 };
const TYPE_LIST = [
  { value: 0, label: "示范区" },
  { value: 1, label: "核心区" },
];
const initialValus = {
  type: 0,
  airport: "",
  tollGate: "",
  airStation: "",
  railwayStation: "",
  passengerStation: "",
};

function initialState() {
  return {
    loading: false,
    spinning: false,
  };
}

type AddUserProps = {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  id?: string;
};

function AddUser(props: AddUserProps) {
  const [state, setState] = useReducer(initialState);
  const { loading, spinning } = state;
  const [form] = useForm();
  const { open, onSuccess, onCancel, id } = props;

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    setState({ spinning: false });
    if (id) {
      setState({ spinning: true });
      getResourceDetail(id)
        .then((response: any) => {
          const { code, data } = response;
          if (code === 0) {
            form.setFieldsValue({ ...data, year: moment(data.year) });
          }
        })
        .finally(() => setState({ spinning: false }));
    }
  }, [open, id]);

  const handleSubmit = (values: any) => {
    setState({ loading: true });
    const params = { ...values };
    const submit = id ? updateResource : addResource;
    const successMsg = id ? "编辑成功" : "新增成功";
    const failMsg = id ? "编辑失败" : "新增失败";
    if (id) params.id = id;
    submit(params)
      .then((response: any) => {
        if (response.code === 0) {
          message.success(successMsg);
          onSuccess();
        } else {
          message.warning(failMsg);
        }
      })
      .finally(() => setState({ loading: false }));
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    onCancel();
    setState({ loading: false });
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      width={800}
      title={id ? "编辑" : "新增"}
      onOk={handleOk}
      maskClosable={false}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Spin spinning={spinning}>
        <Form
          form={form}
          name="add-user"
          labelCol={LABEL_COL}
          onFinish={handleSubmit}
          wrapperCol={WRAPPER_COL}
          initialValues={initialValus}
        >
          <FormItem
            label="火车站"
            name="railwayStation"
            rules={[{ required: true, message: "火车站不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写火车站"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="机场"
            name="airport"
            rules={[{ required: true, message: "机场不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写机场"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="高速收费站"
            name="tollGate"
            rules={[{ required: true, message: "高速收费站不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写高速收费站"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="客运站"
            name="passengerStation"
            rules={[{ required: true, message: "客运站不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写客运站"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="航运站"
            name="airStation"
            rules={[{ required: true, message: "航运站不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写航运站"
              autoComplete="false"
            />
          </FormItem>

          <FormItem label="分类" name="type" required>
            <Radio.Group>
              {TYPE_LIST.map((item) => (
                <Radio value={item.value} key={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
}

export default memo(AddUser);
