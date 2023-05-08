import { memo, useEffect, useCallback, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Spin,
  message,
  Cascader,
} from "antd";
import {
  getUserDetail,
  updateUserDetail,
  getRegionList,
} from "@/services/user";
import { useReducer } from "@/utils";

const STATUS_LIST = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 2 },
];

const TERMINAL_TYPE_LIST = [
  { value: "app", label: "移动端" },
  { value: "front", label: "前台管理用户" },
  { value: "end", label: "后端管理用户" },
  { value: "weapp", label: "小程序端" },
];

const { useForm, Item: FormItem } = Form;

const LABEL_COL = { span: 4, offset: 2 };

const WRAPPER_COL = { span: 14 };

function initialState() {
  return {
    loading: false,
    spinning: false,
    regionList: [] as any,
  };
}

function Update(props: any) {
  const [state, setState] = useReducer(initialState);
  const { loading, spinning, regionList } = state;
  const [form] = useForm();
  const { open, userId, onSuccess, onCancel } = props;

  const regionNameRef = useRef("");

  useEffect(() => {
    getRegionList().then((response: any) => {
      if (response.code === 0) {
        setState({ regionList: response.data });
      }
    });
  }, []);

  useEffect(() => {
    // setState({ spinning: true, regionList: REGION_LIST });
    // getUserDetail(userId)
    //   .then((response: any) => {
    //     if (response.code === 0) {
    //       form.setFieldsValue(response.data);
    //     }
    //   })
    //   .finally(() => setState({ spinning: false }));
  }, [open, userId]);

  const handleSubmit = (values: any) => {
    console.log(values);
    setState({ loading: true });
    updateUserDetail({ ...values, id: userId })
      .then((response: any) => {
        if (response.code === 0) {
          message.success("更新成功");
          onSuccess();
        } else {
          message.warning("更新失败");
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

  const handleChangeRegion = useCallback((...args: any[]) => {
    const [, list] = args;
    regionNameRef.current = list?.[list.length - 1]?.label ?? "";
  }, []);

  return (
    <Modal
      open={open}
      width={800}
      title="编辑"
      onOk={handleOk}
      maskClosable={false}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Spin spinning={spinning}>
        <Form
          form={form}
          onFinish={handleSubmit}
          labelCol={LABEL_COL}
          wrapperCol={WRAPPER_COL}
        >
          <FormItem label="用户名" name="username" required>
            <Input disabled />
          </FormItem>
          <FormItem
            label="行政区"
            name="regionCode"
            rules={[{ required: true, message: "行政区不能为空" }]}
          >
            <Cascader
              options={regionList}
              allowClear={false}
              placeholder="请选择行政区"
              onChange={handleChangeRegion}
            />
          </FormItem>
          <FormItem label="创建时间" name="createTime" required>
            <Input disabled />
          </FormItem>
          <FormItem
            label="真实姓名"
            name="realName"
            rules={[{ required: true, message: "真实姓名不能为空" }]}
          >
            <Input />
          </FormItem>
          <FormItem label="客户端类型" name="clientId" required>
            <Radio.Group>
              {TERMINAL_TYPE_LIST.map((item) => (
                <Radio value={item.value} key={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </FormItem>
          <FormItem label="状态" name="status" required>
            <Radio.Group>
              {STATUS_LIST.map((item) => (
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

export default memo(Update);
