import { memo, useEffect, useState } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Select,
  Radio,
  message,
  Upload,
  Spin,
} from "antd";
import {
  addResource,
  getResourceDetail,
  updateResource,
} from "@/services/overviewPointResource";
import { useReducer } from "@/utils";

const { useForm, Item: FormItem } = Form;

const LABEL_COL = { span: 7 };
const WRAPPER_COL = { span: 14 };
const TYPE_LIST = [
  { value: 0, label: "示范区" },
  { value: 1, label: "核心区" },
];
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
      width={860}
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
            label="国家全域旅游示范区"
            name="nationalCount"
            rules={[{ required: true, message: "国家全域旅游示范区不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写国家全域旅游示范区"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="省级旅游度假区"
            name="provinceCount"
            rules={[{ required: true, message: "省级旅游度假区不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写省级旅游度假区"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="5A级景区"
            name="fiveACount"
            rules={[{ required: true, message: "5A级景区不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写5A级景区"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="4A级景区"
            name="fourACount"
            rules={[{ required: true, message: "4A级景区不能为空" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写4A级景区"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="国家重点生态功能区"
            name="nationalImportantCount"
            rules={[
              { required: true, message: "国家生态文明建设示范县不能为空" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写国家重点生态功能区"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="国家生态文明建设示范县"
            name="nationalCivilityCount"
            rules={[
              { required: true, message: "国家生态文明建设示范县不能为空" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写国家生态文明建设示范县"
              autoComplete="false"
            />
          </FormItem>

          <FormItem
            label="绿水青山就是金山银山实践创基地"
            name="practiceInnovationCount"
            rules={[
              {
                required: true,
                message: "“绿水青山就是金山银山”实践创新基地不能为空",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请填写请填写“绿水青山就是金山银山”实践创新基地"
              autoComplete="false"
            />
          </FormItem>

          {/* <FormItem label="分类" name="type" required>
            <Radio.Group>
              {TYPE_LIST.map((item) => (
                <Radio value={item.value} key={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </FormItem> */}
        </Form>
      </Spin>
    </Modal>
  );
}

export default memo(AddUser);
