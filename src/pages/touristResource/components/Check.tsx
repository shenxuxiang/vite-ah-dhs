import { memo, useState } from "react";
import { Form, Button, Input, Radio, Modal, Space, message } from "antd";
// import { approve } from '@/services/touristResourceOther';

const { Item: FormItem, useForm } = Form;
const LABEL_COL = { span: 4 };
const WRAPPER_COL = { span: 17 };
const initialValues = { remark: "", approveStatus: "3" };

function Check(props: any) {
  const { open, id, onSuccess, onCancel, checkRequest } = props;
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const handleSubmit = (values: any) => {
    setLoading(true);
    checkRequest({ ...values, id })
      .then((res: any) => {
        if (res.code === 0) {
          message.success("审核成功");
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
      title="提交审核"
      maskClosable={false}
      onCancel={handleCancel}
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
          <Input.TextArea
            rows={5}
            placeholder="请填写原因说明"
            maxLength={500}
          />
        </FormItem>

        <FormItem label="状态" name="approveStatus">
          <Radio.Group>
            <Radio value="2">驳回</Radio>
            <Radio value="3">确认</Radio>
          </Radio.Group>
        </FormItem>
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button htmlType="reset">取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              审核
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

export default memo(Check);
