import { memo, useEffect, useCallback, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  message,
  Spin,
  Cascader,
} from "antd";
import {
  addUser,
  getUserDetail,
  updateUserDetail,
  getRegionList,
  getRoleList,
} from "@/services/user";
import { useReducer } from "@/utils";
import JSSHA from "jssha";

const encrypto = (value: string) => {
  const hash = new JSSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  hash.update(value);
  return hash.getHash("HEX");
};

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

type RoleList = { value: string; label: string }[];

const { useForm, Item: FormItem } = Form;
const LABEL_COL = { span: 4, offset: 2 };
const WRAPPER_COL = { span: 14 };
const initialValus = {
  status: 1,
  remark: "",
  realName: "",
  username: "",
  password: "",
  clientId: "end",
};

function initialState() {
  return {
    loading: false,
    spinning: false,
    regionList: [] as any[],
    roleList: [] as RoleList,
  };
}

type AddUserProps = {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  userId?: string;
};

function getParentNode(
  treeNode: any,
  key: string,
  stack: string[] = []
): string[] {
  let result: string[] | null = null;

  stack.pop();
  function loop(treeNode: any, key: string) {
    stack.push(treeNode.value);
    for (let i = 0; i < treeNode.children?.length; i++) {
      if (result) return;
      const child = treeNode.children[i];
      if (child.value === key) {
        result = [...stack];
        return;
      } else {
        loop(child, key);
      }
    }
    stack.pop();
  }
  loop(treeNode, key);
  return result || [];
}

function AddUser(props: AddUserProps) {
  const [state, setState] = useReducer(initialState);
  const { loading, spinning, regionList, roleList } = state;
  const [form] = useForm();
  const { open, onSuccess, onCancel, userId } = props;

  const regionNameRef = useRef("");

  useEffect(() => {
    getRegionList({ level: 3 }).then((response: any) => {
      if (response.code === 0) {
        setState({ regionList: response.data });
      }
    });
    getRoleList().then((response: any) => {
      if (response.code === 0) {
        setState({
          roleList: response.data.map((item: any) => ({
            value: item.id,
            label: item.name,
          })),
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    setState({ spinning: false });
    if (userId) {
      setState({ spinning: true });
      getUserDetail(userId)
        .then((response: any) => {
          const { code, data } = response;
          if (code === 0) {
            regionNameRef.current = data?.regionName;
            form.setFieldsValue({
              ...data,
              regionCode: [
                ...getParentNode(regionList[0], data?.regionCode),
                data?.regionCode,
              ],
            });
          }
        })
        .finally(() => setState({ spinning: false }));
    }
  }, [open, userId, regionList]);

  const handleSubmit = (values: any) => {
    setState({ loading: true });
    const submit = userId ? updateUserDetail : addUser;
    const successMsg = userId ? "编辑成功" : "新增成功";
    const failMsg = userId ? "编辑失败" : "新增失败";
    const params = {
      ...values,
      regionCode: values.regionCode.slice(-1)[0],
      regionName: regionNameRef.current,
    };
    if (userId) {
      params.id = userId;
    } else {
      params.password = encrypto(values.password);
    }
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

  const handleChangeRegion = useCallback((...args: any[]) => {
    const [, list] = args;
    regionNameRef.current = list?.[list.length - 1]?.label ?? "";
  }, []);

  return (
    <Modal
      open={open}
      width={800}
      onOk={handleOk}
      maskClosable={false}
      onCancel={handleCancel}
      confirmLoading={loading}
      title={userId ? "编辑用户" : "新增用户"}
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
            label="姓名"
            name="realName"
            getValueFromEvent={getValueFromEventForInput}
            rules={[{ required: true, message: "姓名不能为空" }]}
          >
            <Input placeholder="请输入姓名" autoComplete="false" />
          </FormItem>

          <FormItem
            label="用户名"
            name="username"
            getValueFromEvent={getValueFromEventForInput}
            rules={[{ required: true, message: "用户名不能为空" }]}
          >
            <Input placeholder="请输入用户名" autoComplete="false" />
          </FormItem>

          {userId ? null : (
            <FormItem
              label="密码"
              name="password"
              rules={[
                { required: true, message: "密码不能为空" },
                {
                  pattern: /^[\w-[\](){}|#^$,.;:'"/\\*?+@%&\s><]{5,17}$/,
                  message: "密码为包含6-18个字符的字符串",
                },
              ]}
            >
              <Input.Password placeholder="请输入密码" autoComplete="false" />
            </FormItem>
          )}

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
              changeOnSelect
            />
          </FormItem>

          {/* <FormItem label="客户端类型" name="clientId" required>
            <Radio.Group defaultValue="app">
              {TERMINAL_TYPE_LIST.map((item) => (
                <Radio value={item.value} key={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </FormItem> */}

          <FormItem
            label="角色"
            name="roleId"
            rules={[{ required: true, message: "角色不能为空" }]}
          >
            <Select options={roleList} placeholder="请选择角色" />
          </FormItem>

          <FormItem label="状态" name="status" required>
            <Radio.Group defaultValue={1}>
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

export default memo(AddUser);
