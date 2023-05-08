import { memo, useState } from "react";
import { Form, Button, Input, Radio, Modal, Space, message } from "antd";
// import { commitApprove } from '@/services/touristResourceOther';

const { Item: FormItem, useForm } = Form;
const LABEL_COL = { span: 4 };
const WRAPPER_COL = { span: 17 };
const initialValues = { remark: "", approveStatus: "1" };
function Submit(props: any) {
  const { open, id, onSuccess, onCancel, submitRequest } = props;
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const handleSubmit = (values: any) => {
    setLoading(true);
    submitRequest({ ...values, id })
      .then((res: any) => {
        if (res.code === 0) {
          message.success("提交成功");
          onSuccess?.();
          form.resetFields();
        }
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  return (
    <Modal
      open={open}
      footer={null}
      title="提交审批"
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form
        form={form}
        onReset={onCancel}
        labelCol={LABEL_COL}
        onFinish={handleSubmit}
        wrapperCol={WRAPPER_COL}
        initialValues={initialValues}
      >
        <FormItem name="remark" label="说明">
          <Input.TextArea rows={5} placeholder="请填写原因说明" />
        </FormItem>

        <FormItem label="状态" name="approveStatus">
          <Radio.Group>
            <Radio value="1">待审批</Radio>
            <Radio value="4">删除</Radio>
          </Radio.Group>
        </FormItem>
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button htmlType="reset">取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

export default memo(Submit);
