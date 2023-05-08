import { memo, useCallback, useMemo } from "react";
import { getPageList } from "@/services/monitor";
import ListPageContent from "@/components/ListPageContent";
import classes from "./index.module.less";
import { useReducer } from "@/utils";

function initialState() {
  return { pageSize: 10, pageNum: 1 };
}

function Page() {
  const [state, setState] = useReducer(initialState);
  const { pageSize, pageNum } = state;

  const columns = useMemo(() => {
    return [
      {
        title: "序号",
        dataIndex: "id",
        hideInSearch: true,
        render: (...args: any[]) => {
          const [, , index] = args;
          return index + (pageNum - 1) * pageSize;
        },
      },
      {
        title: "用户ID",
        dataIndex: "creatorId",
        hideInSearch: true,
      },
      {
        title: "用户名",
        dataIndex: "creator",
        hideInSearch: true,
      },
      {
        title: "请求地址",
        dataIndex: "requestUri",
        hideInSearch: true,
      },
      {
        title: "请求方法",
        dataIndex: "requestMethod",
        hideInSearch: true,
      },
      {
        title: "参数",
        dataIndex: "params",
        hideInSearch: true,
        render: (text: string) => {
          return (
            <div className={classes.ellipsis} title={text}>
              {text}
            </div>
          );
        },
      },
      {
        title: "ip",
        dataIndex: "ip",
        hideInSearch: true,
      },
      {
        title: "ip地址",
        dataIndex: "ipAddress",
        hideInSearch: true,
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        hideInSearch: true,
      },
      {
        title: "响应结果",
        dataIndex: "responseResult",
        hideInSearch: true,
        render: (text: string) => {
          return (
            <div className={classes.ellipsis} title={text}>
              {text}
            </div>
          );
        },
      },
      {
        title: "异常信息",
        dataIndex: "exceptionInfo",
        hideInSearch: true,
        render: (text: string) => {
          return (
            <div className={classes.ellipsis} title={text}>
              {text}
            </div>
          );
        },
      },
      {
        title: "",
        name: "keyword",
        hideInTable: true,
        placeholder: "输入您要查询的请求地址、参数、ip",
      },
    ];
  }, [pageSize, pageNum]);

  const handlePaginationChange = useCallback(
    (pageNum: number, pageSize: number) => {
      setState({ pageNum, pageSize });
    },
    []
  );

  return (
    <div>
      <ListPageContent
        bordered
        showSearch
        rowKey="id"
        columns={columns}
        requestPageList={getPageList}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}

export default memo(Page);
