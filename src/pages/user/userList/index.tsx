import { memo, useMemo, useCallback, useRef, useEffect } from "react";
import { Button, Space, message, Popconfirm } from "antd";
import { getUserList, deleteUser, getRegionList } from "@/services/user";
import { useReducer } from "@/utils";
import ListPageContent from "@/components/ListPageContent";
import classes from "./index.module.less";
import AddUser from "./AddUser";

const TERMINAL_TYPE_LIST = [
  { value: "app", label: "移动端" },
  { value: "front", label: "前台管理用户" },
  { value: "end", label: "后端管理用户" },
  { value: "weapp", label: "小程序端" },
];

function initialState() {
  return {
    userId: "",
    showAddModal: false,
    selectedRowKeys: [] as React.Key[],
    regionList: [] as any[],
  };
}

function Page(props: any) {
  const [state, setState] = useReducer(initialState);
  const { showAddModal, userId, selectedRowKeys, regionList } = state;
  const pageRef = useRef<any>();
  const { permission } = props;

  useEffect(() => {
    getRegionList({ level: 3 }).then((response: any) => {
      const { code, data } = response;
      if (code === 0) {
        setState({ regionList: data });
      }
    });
  }, []);

  const handleEdit = useCallback((userId: string) => {
    setState({ userId, showAddModal: true });
  }, []);

  const handleCancel = useCallback(() => {
    setState({ showAddModal: false });
  }, []);

  const handleSuccess = useCallback(() => {
    setState({ showAddModal: false });
    pageRef.current?.forceUpdate();
  }, []);

  // 更新用户状态
  const handleUpdateUserStatus = useCallback((value: boolean) => {
    console.log(value);
  }, []);

  // 删除用户
  const handleDeleteUser = useCallback((userId: React.Key | React.Key[]) => {
    deleteUser(userId).then((response: any) => {
      if (response.code === 0) {
        setState({ selectedRowKeys: [] });
        message.success("用户删除成功");
        // 刷新列表
        pageRef.current?.forceUpdate();
      } else {
        message.warning("用户删除失败");
      }
    });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "用户名",
        dataIndex: "username",
        hideInSearch: true,
      },
      {
        title: "姓名",
        dataIndex: "realName",
        hideInSearch: true,
        name: "keyword",
        placeholder: "请输入要查询用户的真实姓名",
      },
      {
        title: "行政区",
        dataIndex: "regionName",
        hideInSearch: true,
      },
      {
        title: "所属终端",
        dataIndex: "clientId",
        render: (text: string) => {
          return (
            TERMINAL_TYPE_LIST.find((item) => item.value === text)?.label ?? "-"
          );
        },
        hideInSearch: true,
      },
      {
        title: "状态",
        dataIndex: "status",
        hideInSearch: true,
        render: (status: number) => {
          if (status === 1) {
            return <span className={classes.enabled}>启用</span>;
          } else {
            return <span className={classes.disabled}>禁用</span>;
          }
        },
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        hideInSearch: true,
      },
      {
        title: "操作",
        dataIndex: "id",
        width: 220,
        hideInSearch: true,
        hideInTable: permission !== "1",
        fixed: "right",
        render: (id: string) => {
          return (
            <>
              <Button type="link" onClick={() => handleEdit(id)}>
                编辑
              </Button>
              <Popconfirm
                okText="确定"
                cancelText="取消"
                placement="topRight"
                title="此操作将永久删除数据，是否继续？"
                onConfirm={() => handleDeleteUser(id)}
              >
                <Button danger type="link">
                  删除
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
      {
        title: "用户查询",
        name: "keyword",
        placeholder: "请输入要查询的用户名或真实姓名",
        hideInTable: true,
      },
      {
        title: "行政区",
        name: "regionCode",
        hideInTable: true,
        renderType: "cascader",
        options: regionList,
        placeholder: "请选择要查询的行政区",
        beforeSubmitBehavior: (value: string[]) => {
          return { regionCode: value.slice(-1)[0] };
        },
      },
    ];
  }, [handleUpdateUserStatus, regionList, permission]);

  // 选中 Table 数据项
  const rowSelection = useMemo(() => {
    if (permission !== "1") return null;
    return {
      onChange: (selectedRowKeys: React.Key[]) => setState({ selectedRowKeys }),
      selectedRowKeys,
      preserveSelectedRowKeys: true,
    };
  }, [selectedRowKeys, permission]);

  const renderExtralContent = useMemo(() => {
    if (permission !== "1") return null;

    const handleAddUser = () => {
      setState({ showAddModal: true, userId: "" });
    };

    return (
      <Space>
        <Button type="primary" ghost onClick={handleAddUser}>
          新增
        </Button>
        <Popconfirm
          okText="确定"
          cancelText="取消"
          placement="topRight"
          onConfirm={() => handleDeleteUser(selectedRowKeys)}
          disabled={selectedRowKeys?.length <= 0}
          title="此操作将永久删除选中数据，是否继续？"
        >
          <Button danger type="default" disabled={selectedRowKeys?.length <= 0}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    );
  }, [selectedRowKeys, handleDeleteUser, permission]);

  return (
    <div>
      <ListPageContent
        bordered
        showSearch
        rowKey="id"
        ref={pageRef}
        columns={columns}
        rowSelection={rowSelection}
        extra={renderExtralContent}
        requestPageList={getUserList}
      />
      <AddUser
        open={showAddModal}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        userId={userId}
      />
    </div>
  );
}

export default memo(Page);
