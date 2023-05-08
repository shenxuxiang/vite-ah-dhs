import { memo, useMemo, useCallback, useRef, useEffect } from "react";
import { Button, message, Tag, Popconfirm } from "antd";
import {
  getPageList,
  deleteResource,
  approve,
  commitApprove,
  getResourceDetail,
  getRegionList,
} from "@/services/touristResourceOther";
import { useReducer } from "@/utils";
import ListPageContent from "@/components/ListPageContent";
import Add from "./Add";
import Submit from "../components/Submit";
import Check from "../components/Check";
import ApproveFlows from "../components/ApproveFlows";
import Icon from "@/components/Icon";

const STATUS_LIST = [
  { label: "待提交", value: "0" },
  { label: "待审核", value: "1" },
  { label: "已驳回", value: "2" },
  { label: "已审核", value: "3" },
  { label: "删除审核", value: "4" },
];
const TYPE_LIST = [
  { label: "体育赛事", value: "1" },
  { label: "医养康养类", value: "2" },
  { label: "会展经济类", value: "3" },
  { label: "创意创造类", value: "4" },
  { label: "旧厂房设施", value: "5" },
  { label: "其他", value: "6" },
];

const STATUS_MAP = new Map([
  [
    0,
    <Tag color="#87d068" key={2}>
      待提交
    </Tag>,
  ],
  [
    1,
    <Tag color="#ff5500" key={3}>
      待审核
    </Tag>,
  ],
  [
    2,
    <Tag color="#108ee9" key={2}>
      已驳回
    </Tag>,
  ],
  [
    3,
    <Tag color="#2db7f5" key={3}>
      已审核
    </Tag>,
  ],
  [
    4,
    <Tag color="#bfbfbf" key={3}>
      删除审核
    </Tag>,
  ],
]);

const TYPE_MAP = new Map([
  [1, <span key={1}>体育赛事</span>],
  [2, <span key={2}>医养康养类</span>],
  [3, <span key={3}>会展经济类</span>],
  [4, <span key={4}>创意创造类</span>],
  [5, <span key={5}>旧厂房设施</span>],
  [6, <span key={6}>其他</span>],
]);

function initialState() {
  return {
    id: "",
    showAddModal: false,
    showSubmitModal: false,
    showCheckModal: false,
    showDetailModal: false,
    showFlowsModal: false,
    regionList: [] as any[],
  };
}
// 枢纽数量
function Page(props: any) {
  const [state, setState] = useReducer(initialState);
  const {
    showAddModal,
    id,
    showSubmitModal,
    showCheckModal,
    showDetailModal,
    showFlowsModal,
    regionList,
  } = state;
  const pageRef = useRef<any>();
  // 1-超级管理员；2-市县用户；3-省级用户
  const { permission, searchParams } = props;

  useEffect(() => {
    getRegionList().then((response: any) => {
      if (response.code === 0) {
        setState({ regionList: response.data });
      }
    });
  }, []);

  const handleShowDetailModal = useCallback((id: string) => {
    setState({ id, showDetailModal: true });
  }, []);

  const handleEdit = useCallback((id: string) => {
    setState({ id, showAddModal: true });
  }, []);

  const handleCancel = useCallback(() => {
    setState({ showAddModal: false, showDetailModal: false });
  }, []);

  const handleSuccess = useCallback(() => {
    setState({ showAddModal: false, showDetailModal: false });
    pageRef.current?.forceUpdate();
  }, []);

  // 删除用户
  const handleDelete = useCallback((id: React.Key | React.Key[]) => {
    deleteResource(id).then((response: any) => {
      if (response.code === 0) {
        message.success("删除成功");
        // 刷新列表
        pageRef.current?.forceUpdate();
      } else {
        message.warning("删除失败");
      }
    });
  }, []);

  const handleShowSubmitModal = useCallback((id: string) => {
    setState({ id, showSubmitModal: true });
  }, []);

  const handleSuccessSubmitModal = useCallback(() => {
    setState({ showSubmitModal: false });
    // 刷新列表
    pageRef.current?.forceUpdate();
  }, []);

  const handleCancelSubmitModal = useCallback(() => {
    setState({ showSubmitModal: false });
  }, []);

  const handleShowCheckModal = useCallback((id: string) => {
    setState({ id, showCheckModal: true });
  }, []);

  const handleSuccessCheckModal = useCallback(() => {
    setState({ showCheckModal: false });
    // 刷新列表
    pageRef.current?.forceUpdate();
  }, []);

  const handleCancelCheckModal = useCallback(() => {
    setState({ showCheckModal: false });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        width: 120,
        hideInSearch: true,
      },
      {
        title: "所在市",
        dataIndex: "sjxzqh",
        width: 120,
        hideInSearch: true,
      },
      {
        title: "所在区/县",
        dataIndex: "xjxzqh",
        width: 120,
        hideInSearch: true,
      },
      {
        title: "所在乡镇",
        dataIndex: "xzjxzqh",
        width: 120,
        hideInSearch: true,
      },
      {
        title: "经度",
        dataIndex: "longitude",
        hideInSearch: true,
        width: 120,
      },
      {
        title: "纬度",
        dataIndex: "latitude",
        hideInSearch: true,
        width: 120,
      },
      {
        title: "介绍",
        dataIndex: "introduction",
        hideInSearch: true,
        width: 200,
        render: (text: string) => {
          return (
            <div
              title={text}
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: "状态",
        dataIndex: "status",
        hideInSearch: true,
        width: 120,
        render: (status: number) => {
          return STATUS_MAP.get(status);
        },
      },
      // {
      //   title: '资源分类',
      //   dataIndex: 'type',
      //   hideInSearch: true,
      //   width: 100,
      // },
      {
        title: "资源具体类型",
        dataIndex: "detailType",
        hideInSearch: true,
        width: 120,
        render: (type: number) => {
          return TYPE_MAP.get(type);
        },
      },
      {
        title: "是否完全位于生态保护红线内",
        dataIndex: "isProtect",
        hideInSearch: true,
        width: 220,
      },
      {
        title: "是否在自然公园内",
        dataIndex: "isPark",
        hideInSearch: true,
        width: 150,
      },
      {
        title: "基本情况",
        dataIndex: "merit",
        hideInSearch: true,
        width: 200,
        render: (text: string) => {
          return (
            <div
              title={text}
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: "产权属性",
        dataIndex: "propertyRtight",
        hideInSearch: true,
        width: 100,
      },
      {
        title: "面积（平方米）",
        dataIndex: "area",
        hideInSearch: true,
        width: 150,
        render: (value: number) => {
          return value?.toFixed(2);
        },
      },
      {
        title: "年代",
        dataIndex: "year",
        hideInSearch: true,
        width: 120,
      },
      {
        title: "其他",
        dataIndex: "other",
        hideInSearch: true,
        width: 200,
        render: (text: string) => {
          return (
            <div
              title={text}
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: "图片",
        dataIndex: "picNum",
        hideInSearch: true,
        width: 120,
        render: (num: number) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                color: num > 0 ? "#87d068" : "#ccc",
              }}
            >
              <Icon name="image-fill" style={{ fontSize: 24 }} />
              &nbsp;&nbsp;×&nbsp;&nbsp;
              {num || 0}
            </div>
          );
        },
      },
      {
        title: "视频",
        dataIndex: "videoNum",
        hideInSearch: true,
        width: 120,
        render: (num: number) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                color: num > 0 ? "#87d068" : "#ccc",
              }}
            >
              <Icon name="videofill" style={{ fontSize: 24 }} />
              &nbsp;&nbsp;×&nbsp;&nbsp;
              {num || 0}
            </div>
          );
        },
      },
      {
        title: "介绍音频",
        dataIndex: "introduceAudioNum",
        hideInSearch: true,
        width: 120,
        render: (num: number) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                color: num > 0 ? "#87d068" : "#ccc",
              }}
            >
              <Icon name="audio-fill" style={{ fontSize: 24 }} />
              &nbsp;&nbsp;×&nbsp;&nbsp;
              {num || 0}
            </div>
          );
        },
      },
      {
        title: "适合开发类型",
        dataIndex: "developType",
        hideInSearch: true,
        width: 150,
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
        width: 260,
        hideInSearch: true,
        fixed: "right",
        render: (id: string, record: any) => {
          return (
            <div>
              {(permission === "2" || permission === "1") && (
                <>
                  <Button
                    type="link"
                    onClick={() => handleEdit(id)}
                    disabled={record.status === 1}
                  >
                    编辑
                  </Button>
                  <Button
                    type="link"
                    onClick={() => handleShowSubmitModal(id)}
                    disabled={record.status >= 1}
                  >
                    提交审批
                  </Button>
                </>
              )}
              {(permission === "3" || permission === "1") && (
                <Button
                  type="link"
                  disabled={record.status !== 1 && record.status !== 4}
                  onClick={() => handleShowCheckModal(id)}
                >
                  审核
                </Button>
              )}
              <Button type="link" onClick={() => handleShowDetailModal(id)}>
                详情
              </Button>
              <Button
                type="link"
                onClick={() => setState({ showFlowsModal: true, id })}
                disabled={record.status < 1}
              >
                流程
              </Button>
              {permission === "1" && (
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
              )}
            </div>
          );
        },
      },
      {
        title: "内容搜索",
        name: "keyword",
        hideInTable: true,
        placeholder: "请输入你要查询的关键字",
      },
      {
        title: "行政区",
        name: "xzqhdm",
        hideInTable: true,
        renderType: "cascader",
        placeholder: "请输入你要查询的行政区",
        options: regionList,
        beforeSubmitBehavior: (value: string[]) => {
          return { xzqhdm: value.slice(-1)[0] };
        },
      },
      {
        title: "类型搜索",
        name: "type",
        hideInTable: true,
        renderType: "select",
        options: TYPE_LIST,
        placeholder: "请选择要查询的状态",
      },
      {
        title: "状态搜索",
        name: "status",
        hideInTable: true,
        renderType: "select",
        options: STATUS_LIST,
        placeholder: "请选择要查询的状态",
        initialConditionValue: searchParams[0].get("status"),
      },
    ];
  }, [regionList, handleDelete]);

  const renderExtralContent = useMemo(() => {
    if (permission === "3") return null;
    const handleAdd = () => setState({ showAddModal: true, id: "" });

    return (
      <Button type="primary" ghost onClick={handleAdd}>
        新增
      </Button>
    );
  }, [permission]);

  return (
    <div>
      <ListPageContent
        bordered
        showSearch
        rowKey="id"
        ref={pageRef}
        columns={columns}
        tableScroll={{ x: 1500 }}
        extra={renderExtralContent}
        requestPageList={getPageList}
      />
      <Add
        open={showAddModal || showDetailModal}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        id={id}
        disabled={showDetailModal}
      />
      <Submit
        id={id}
        open={showSubmitModal}
        submitRequest={commitApprove}
        onCancel={handleCancelSubmitModal}
        onSuccess={handleSuccessSubmitModal}
      />
      <Check
        id={id}
        open={showCheckModal}
        checkRequest={approve}
        onCancel={handleCancelCheckModal}
        onSuccess={handleSuccessCheckModal}
      />
      <ApproveFlows
        id={id}
        open={showFlowsModal}
        detailRequest={getResourceDetail}
        onCancel={() => setState({ showFlowsModal: false })}
      />
    </div>
  );
}

export default memo(Page);
