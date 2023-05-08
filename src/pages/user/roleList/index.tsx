import { memo, useMemo, useCallback, useRef } from "react";
import { Button, Space, Form, message, Popconfirm } from "antd";
import { getRolePageList, deleteRole } from "@/services/user";
import { useReducer } from "@/utils";
import ListPageContent from "@/components/ListPageContent";
import classes from "./index.module.less";
import AddRole from "./AddRole";

function initialState() {
  return {
    roleId: "",
    showAddModal: false,
    selectedRowKeys: [] as React.Key[],
  };
}

function Page(props: any) {
  const [state, setState] = useReducer(initialState);
  const { roleId, showAddModal, selectedRowKeys } = state;
  const pageRef = useRef<any>();
  const { permission } = props;

  // 编辑按钮
  const handleEdit = useCallback(async (roleId: string) => {
    setState({ roleId, showAddModal: true });
  }, []);

  const handleCancel = useCallback(() => {
    setState({ showAddModal: false });
  }, []);

  const handleAddSuccess = useCallback(() => {
    setState({ showAddModal: false });
    pageRef.current?.forceUpdate();
  }, []);

  // 删除角色
  const handleDeleteRole = useCallback((roleId: React.Key | React.Key[]) => {
    deleteRole(roleId).then((response: any) => {
      if (response.code === 0) {
        setState({ selectedRowKeys: [] });
        message.success("角色删除成功");
        // 刷新列表
        pageRef.current?.forceUpdate();
      }
    });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "角色名称",
        dataIndex: "name",
        name: "keyword",
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
        width: 220,
        sorter: {
          compare: (a: any, b: any) => a.chinese - b.chinese,
          multiple: 1,
        },
        hideInSearch: true,
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        width: 220,
        sorter: {
          compare: (a: any, b: any) => a.chinese - b.chinese,
          multiple: 2,
        },
        hideInSearch: true,
      },
      {
        title: "备注",
        dataIndex: "remark",
        hideInSearch: true,
      },
      {
        title: "操作",
        dataIndex: "id",
        width: 200,
        hideInSearch: true,
        hideInTable: permission !== "1",
        render: (roleId: string) => {
          return (
            <Space style={{ marginLeft: -16 }}>
              <Button type="link" onClick={() => handleEdit(roleId)}>
                权限编辑
              </Button>
              <Popconfirm
                okText="确定"
                cancelText="取消"
                placement="topRight"
                title="此操作将永久删除数据，是否继续？"
                onConfirm={() => handleDeleteRole(roleId)}
              >
                <Button danger type="link">
                  删除
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  }, []);

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

    const handleBatchDelete = () => {
      handleDeleteRole(selectedRowKeys);
    };

    const handleAddUser = () => {
      setState({ showAddModal: true, roleId: "" });
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
          onConfirm={handleBatchDelete}
          disabled={selectedRowKeys?.length <= 0}
          title="此操作将永久删除选中数据，是否继续？"
        >
          <Button danger type="default" disabled={selectedRowKeys?.length <= 0}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    );
  }, [selectedRowKeys]);

  return (
    <div>
      <ListPageContent
        bordered
        showSearch
        rowKey="id"
        ref={pageRef}
        columns={columns}
        extra={renderExtralContent}
        rowSelection={rowSelection}
        requestPageList={getRolePageList}
      />
      <AddRole
        open={showAddModal}
        onSuccess={handleAddSuccess}
        onCancel={handleCancel}
        roleId={roleId}
      />
    </div>
  );
}

export default memo(Page);
