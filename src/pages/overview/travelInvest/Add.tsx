import { memo, useEffect } from "react";
import { Modal, Form, InputNumber, message, Spin } from "antd";
import {
  addResource,
  getResourceDetail,
  updateResource,
} from "@/services/overviewTravelInvest";
import { useReducer } from "@/utils";

const { useForm, Item: FormItem } = Form;

const LABEL_COL = { span: 7 };
const WRAPPER_COL = { span: 14 };
const initialValus = {
  type: 0,
  nationalCount: "",
  provinceCount: "",
  fiveACount: "",
  fourACount: "",
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
            form.setFieldsValue({ ...data });
          }
        })
        .finally(() => setState({ spinning: false }));
    }
  }, [open, id]);

  const handleSubmit = (values: any) => {
    setState({ loading: true });
    const submit = id ? updateResource : addResource;
    const successMsg = id ? "编辑成功" : "新增成功";
    const failMsg = id ? "编辑失败" : "新增失败";
    const params = { ...values };
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
    form.resetFields();
  };

  const getValueFromEventForInput = (event: any) => {
    return event.target.value.trim();
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
            label="招商项目"
            name="investmentProgram"
            rules={[{ required: true, message: "招商项目不能为空" }]}
          >
            <InputNumber
              placeholder="请填写招商项目"
              autoComplete="false"
              style={{ width: "100%" }}
            />
          </FormItem>

          <FormItem
            label="招商金额"
            name="investmentCost"
            rules={[{ required: true, message: "招商金额不能为空" }]}
          >
            <InputNumber
              placeholder="请填写招商金额"
              autoComplete="false"
              min={0}
              style={{ width: "100%" }}
            />
          </FormItem>

          <FormItem
            label="在建项目"
            name="buildingProgram"
            rules={[{ required: true, message: "在建项目不能为空" }]}
          >
            <InputNumber
              placeholder="请填写在建项目"
              autoComplete="false"
              style={{ width: "100%" }}
            />
          </FormItem>

          <FormItem
            label="在建金额"
            name="buildingCost"
            rules={[{ required: true, message: "在建金额不能为空" }]}
          >
            <InputNumber
              placeholder="请填写在建金额"
              autoComplete="false"
              min={0}
              style={{ width: "100%" }}
            />
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
}

export default memo(AddUser);
