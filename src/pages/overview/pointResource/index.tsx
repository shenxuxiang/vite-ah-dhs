import { memo, useMemo, useCallback, useRef } from "react";
import { Button, Space, message, Popconfirm, Tag } from "antd";
import { getPageList, deleteResource } from "@/services/overviewPointResource";
import { useReducer } from "@/utils";
import ListPageContent from "@/components/ListPageContent";
import Add from "./Add";

const MENU_TYPE_MAP = new Map([
  [
    0,
    <Tag color="#87d068" key={2}>
      示范区
    </Tag>,
  ],
  [
    1,
    <Tag color="#ff5500" key={3}>
      核心区
    </Tag>,
  ],
]);

function initialState() {
  return {
    id: "",
    showAddModal: false,
    selectedRowKeys: [] as React.Key[],
  };
}

function Page() {
  const [state, setState] = useReducer(initialState);
  const { showAddModal, id, selectedRowKeys } = state;
  const pageRef = useRef<any>();

  const handleEdit = useCallback((id: string) => {
    setState({ id, showAddModal: true });
  }, []);

  const handleCancel = useCallback(() => {
    setState({ showAddModal: false });
  }, []);

  const handleSuccess = useCallback(() => {
    setState({ showAddModal: false });
    pageRef.current?.forceUpdate();
  }, []);

  // 删除用户
  const handleDelete = useCallback((id: React.Key | React.Key[]) => {
    deleteResource(id).then((response: any) => {
      if (response.code === 0) {
        setState({ selectedRowKeys: [] });
        message.success("删除成功");
        // 刷新列表
        pageRef.current?.forceUpdate();
      } else {
        message.warning("删除失败");
      }
    });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "ID",
        dataIndex: "id",
        hideInSearch: true,
        width: 180,
      },
      // {
      //   title: '分类',
      //   dataIndex: 'type',
      //   hideInSearch: true,
      //   render: (type: number) => {
      //     return MENU_TYPE_MAP.get(type);
      //   },
      // },
      {
        title: "国家全域旅游示范区（个）",
        dataIndex: "nationalCount",
        hideInSearch: true,
        width: 210,
        render: (count: number) => count + "个",
      },
      {
        title: "省级旅游度假区（个）",
        dataIndex: "provinceCount",
        width: 200,
        render: (count: number) => count + "个",
      },
      {
        title: "5A级景区（个）",
        dataIndex: "fiveACount",
        hideInSearch: true,
        width: 180,
        render: (count: number) => count + "个",
      },
      {
        title: "4A级景区（个）",
        dataIndex: "fourACount",
        hideInSearch: true,
        width: 180,
        render: (count: number) => count + "个",
      },
      {
        title: "国家重点生态功能区（个）",
        dataIndex: "nationalImportantCount",
        hideInSearch: true,
        width: 210,
        render: (count: number) => count + "个",
      },
      {
        title: "国家生态文明建设示范县（个）",
        dataIndex: "nationalCivilityCount",
        hideInSearch: true,
        width: 230,
        render: (count: number) => count + "个",
      },
      {
        title: "“绿水青山就是金山银山”实践创新基地（个）",
        dataIndex: "practiceInnovationCount",
        hideInSearch: true,
        width: 315,
        render: (count: number) => count + "个",
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        hideInSearch: true,
        width: 180,
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        hideInSearch: true,
        width: 180,
      },
      {
        title: "操作",
        dataIndex: "id",
        width: 220,
        hideInSearch: true,
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
                onConfirm={() => handleDelete(id)}
              >
                <Button danger type="link">
                  删除
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);

  // 选中 Table 数据项
  const rowSelection = useMemo(() => {
    return {
      onChange: (selectedRowKeys: React.Key[]) => setState({ selectedRowKeys }),
      selectedRowKeys,
      preserveSelectedRowKeys: true,
    };
  }, [selectedRowKeys]);

  const renderExtralContent = useMemo(() => {
    const handleAdd = () => {
      setState({ showAddModal: true, id: "" });
    };

    return (
      <Space>
        <Button type="primary" ghost onClick={handleAdd}>
          新增
        </Button>
        <Popconfirm
          okText="确定"
          cancelText="取消"
          placement="topRight"
          onConfirm={() => handleDelete(selectedRowKeys)}
          disabled={selectedRowKeys?.length <= 0}
          title="此操作将永久删除选中数据，是否继续？"
        >
          <Button danger type="default" disabled={selectedRowKeys?.length <= 0}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    );
  }, [selectedRowKeys, handleDelete]);

  return (
    <div>
      <ListPageContent
        bordered
        rowKey="id"
        ref={pageRef}
        columns={columns}
        rowSelection={rowSelection}
        extra={renderExtralContent}
        requestPageList={getPageList}
        tableScroll={{ x: 1500 }}
      />
      <Add
        open={showAddModal}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        id={id}
      />
    </div>
  );
}

export default memo(Page);
