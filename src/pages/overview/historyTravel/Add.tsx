import { memo, useEffect } from "react";
import {
  Modal,
  Form,
  Radio,
  message,
  DatePicker,
  Spin,
  InputNumber,
} from "antd";
import {
  addResource,
  getResourceDetail,
  updateResource,
} from "@/services/overviewHistoryTravel";
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
  year: "",
  population: "",
  income: "",
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
    const params = { ...values, year: values.year.format("YYYY") };
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
            label="年份"
            name="year"
            rules={[{ required: true, message: "年份不能为空" }]}
          >
            <DatePicker picker="year" style={{ width: "100%" }} />
          </FormItem>

          <FormItem
            label="入境人数（万人次）"
            name="population"
            rules={[{ required: true, message: "入境人数不能为空" }]}
          >
            <InputNumber
              placeholder="请填写入境人数"
              autoComplete="false"
              min={0}
              style={{ width: "100%" }}
            />
          </FormItem>

          <FormItem
            label="收入（亿元）"
            name="income"
            rules={[{ required: true, message: "收入不能为空" }]}
          >
            <InputNumber
              placeholder="请填写收入"
              autoComplete="false"
              min={0}
              style={{ width: "100%" }}
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
