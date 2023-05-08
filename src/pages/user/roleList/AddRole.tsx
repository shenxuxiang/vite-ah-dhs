import React, { memo, useEffect } from "react";
import { Modal, Form, Radio, Input, InputNumber, message, Spin } from "antd";
import { addRole, getRoleDetail, updateRoleDetail } from "@/services/user";
import { useReducer, getLocalStorage } from "@/utils";
import TreeComp, { getParentKey } from "@/components/TreeComp";

const { useForm, Item: FormItem } = Form;
const LABEL_COL = { span: 6 };
const WRAPPER_COL = { span: 16 };
type SourceListItem = { id: string; name: string; children?: SourceListItem[] };
type TreeData = {
  key: string;
  title: string;
  children?: TreeData[];
};

function computeTreeData(sourceList: SourceListItem[]): TreeData[] {
  return (
    sourceList?.map((item: SourceListItem) => {
      const { id, name, children } = item;
      return {
        title: name,
        key: id,
        children: children ? computeTreeData(children) : undefined,
      };
    }) ?? []
  );
}

function initialState() {
  return {
    loading: false,
    spinning: false,
    resourceList: [] as any[],
  };
}

function AddRole(props: any) {
  const [state, setState] = useReducer(initialState);
  const { loading, spinning, resourceList } = state;
  const { roleId, open, onSuccess, onCancel } = props;
  const [form] = useForm();

  useEffect(() => {
    setState({
      resourceList: computeTreeData(getLocalStorage("MENU_RESOURCE")),
    });
  }, []);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (roleId) {
        setState({ spinning: true });

        getRoleDetail(roleId)
          .then((response: any) => {
            const { code, data } = response;
            if (code === 0) {
              const { name, sort, remark, status, resourceIds } = data;
              form.setFieldsValue({
                name,
                sort,
                remark,
                status,
                resourceIds: resourceIds.filter(
                  (val: string) => val.length > 3
                ),
              });
            }
          })
          .finally(() => setState({ spinning: false }));
      }
    }
  }, [roleId, open]);

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleSubmit = (values: any) => {
    setState({ loading: true });
    const submit = roleId ? updateRoleDetail : addRole;
    const successMsg = roleId ? "编辑成功" : "新增成功";
    const failMsg = roleId ? "编辑失败" : "新增失败";
    const params = { ...values };
    if (roleId) params.id = roleId;

    const { resourceIds } = values;
    const menus = new Set(resourceIds);
    for (let i = 0; i < resourceIds.length; i++) {
      const parentKey = getParentKey(resourceIds[i], resourceList);
      parentKey && menus.add(parentKey);
    }

    params.resourceIds = [...menus];

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

  return (
    <Modal
      open={open}
      width={720}
      onOk={handleOk}
      maskClosable={false}
      onCancel={handleCancel}
      confirmLoading={loading}
      title={roleId ? "编辑角色" : "新增角色"}
    >
      <Spin spinning={spinning}>
        <Form
          name="add-role"
          form={form}
          labelCol={LABEL_COL}
          wrapperCol={WRAPPER_COL}
          onFinish={handleSubmit}
        >
          <FormItem
            label="角色名称"
            name="name"
            rules={[{ required: true, message: "角色名称不能为空" }]}
          >
            <Input placeholder="请输入角色名称" />
          </FormItem>

          <FormItem
            label="权限"
            name="resourceIds"
            valuePropName="checkedKeys"
            rules={[{ required: true, message: "权限不能为空" }]}
          >
            <TreeComp checkable treeData={resourceList} />
          </FormItem>

          <FormItem
            label="排序"
            name="sort"
            rules={[{ required: true, message: "角色名称不能为空" }]}
          >
            <InputNumber step={1} style={{ width: "100%" }} />
          </FormItem>

          <FormItem
            label="状态"
            name="status"
            rules={[{ required: true, message: "状态不能为空" }]}
          >
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={2}>禁用</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem
            label="备注"
            name="remark"
            rules={[{ required: true, message: "角色名称不能为空" }]}
          >
            <Input.TextArea placeholder="请输入备注信息" rows={4} />
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
}

export default memo(AddRole);
