import { memo, useCallback, useMemo } from "react";
import { getMenuSourceTree } from "@/services/user";
import { Tag } from "antd";
import ListPageContent from "@/components/ListPageContent";
import classes from "./index.module.less";

const MENU_TYPE_MAP = new Map([
  [
    1,
    <Tag color="#ff5500" key={1}>
      目录
    </Tag>,
  ],
  [
    2,
    <Tag color="#87d068" key={2}>
      菜单
    </Tag>,
  ],
  [
    3,
    <Tag color="#2db7f5" key={3}>
      按钮
    </Tag>,
  ],
  [
    4,
    <Tag color="#108ee9" key={4}>
      接口
    </Tag>,
  ],
  [
    5,
    <Tag color="#cccccc" key={5}>
      其他
    </Tag>,
  ],
]);

function Page() {
  const columns = useMemo(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        hideInSearch: true,
      },
      {
        title: "类型",
        dataIndex: "type",
        hideInSearch: true,
        render: (type: number) => {
          return MENU_TYPE_MAP.get(type);
        },
      },
      {
        title: "路径",
        dataIndex: "path",
        hideInSearch: true,
      },
      {
        title: "排序",
        dataIndex: "sort",
        hideInSearch: true,
      },
      {
        title: "备注",
        dataIndex: "remark",
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
        dataIndex: "create_time",
        hideInSearch: true,
      },
    ];
  }, []);

  const requestPageList = useCallback(async () => {
    const response = (await getMenuSourceTree()) as any;
    const { code, message, data } = response;
    return { code, message, data: { list: data, total: data.length } };
  }, []);

  return (
    <div>
      <ListPageContent
        bordered
        rowKey="id"
        columns={columns}
        requestPageList={requestPageList}
      />
    </div>
  );
}

export default memo(Page);
