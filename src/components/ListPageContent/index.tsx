import React, {
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Card, Table, Pagination, message } from "antd";
import ListPageHeader, {
  Columns,
  processFormValueAccordingColumns,
} from "../ListPageHeader";
import styles from "./index.module.less";
import useReducer from "@/utils/useReducer";
import { downLoadFile } from "@/utils";

type RequestPageListParma = {
  pageSize: number;
  pageNum: number;
  [propName: string]: any;
};

type ListPageContentProps = {
  // 表格右上角展示自定义内容
  extra?: React.ReactNode;
  // 同 Table 组件的 rowKey
  rowKey: string | ((record: any) => string);
  // 同 Table 组件的 columns
  columns: Columns;
  // 同 Table 组件的 scroll
  tableScroll?: any;
  // 同 Table 组件的 bordered
  bordered?: boolean;
  // 表格左上角展示的标题（默认展示‘查询表格’）
  tableTitle?: string;
  // 同 Table 组件的 rowSelection
  rowSelection?: any;
  // 导出功能的 server-api
  dataExport?: Function;
  // 导出的文件名
  exportFileName?: string;
  // 表单查询按钮内容自定义
  searchButtonText?: string;
  // 是否显示表单重置按钮
  showResetButton?: boolean;
  // 同 Pagination 组件的 size
  paginationSize?: "default" | "small";
  // 请求页面数据的 server-api
  requestPageList: (query: RequestPageListParma) => Promise<any>;
  // 同 Pagination 组件的 onChange 事件
  onPaginationChange?: (pageNum: number, pageSize: number) => void;
  // 是否展示头部查询的表单
  showSearch?: boolean;
  // 同 Pagination 组件的 paginationShowTotal
  paginationShowTotal?: (total: number, range: number[]) => string;
  forceUpdate?: () => void;
};

type OrderListItem = {
  field: string;
  direction: boolean;
};

type OrderList = OrderListItem[];

type SearchCondition = {
  orderList?: OrderList;
  [propName: string]: any;
};

function initialState() {
  return {
    pageSize: 10,
    pageNum: 1,
    loading: false,
    pageList: [],
    total: 0,
    // 查询条件
    searchCondition: {} as SearchCondition,
  };
}

function showTotal(total: number) {
  return `共 ${total} 条数据`;
}

function ListPageContent(props: ListPageContentProps, ref: any) {
  const [state, setState] = useReducer(initialState);
  const { total, pageNum, loading, pageSize, pageList, searchCondition } =
    state;

  const {
    extra,
    rowKey,
    columns,
    bordered,
    showSearch,
    tableTitle,
    dataExport,
    tableScroll,
    rowSelection,
    exportFileName,
    paginationSize,
    showResetButton,
    requestPageList,
    searchButtonText,
    onPaginationChange,
    paginationShowTotal = showTotal,
  } = props;

  // 表单查询条件（初始化的值）。Form 表单不会更新初始化值，所以我们使用 ref。
  const initialSearchCondition = useRef<any>(null);

  // Table 组件使用的 columns
  const tableColumns = useMemo(() => {
    return columns.filter((column) => !column.hideInTable);
  }, [columns]);

  // 条件查询使用的 columns
  const searchColumns = useMemo(() => {
    return columns.filter((column) => !column.hideInSearch);
  }, [columns]);

  // 在此处对查询搜索的条件进行初始化，
  // 注意这个方法应该只执行一次。
  if (initialSearchCondition.current === null) {
    const initial = {} as any;
    for (let i = 0; i < columns.length; i++) {
      const { hideInSearch, name, dataIndex, initialConditionValue } =
        columns[i];
      if (hideInSearch || typeof initialConditionValue === "undefined")
        continue;

      initial[name! || dataIndex!] = initialConditionValue;
    }
    initialSearchCondition.current = initial;
    const searchCondition = processFormValueAccordingColumns(
      initial,
      searchColumns
    ) as SearchCondition;

    setState({ searchCondition });
  }

  // 请求数据
  const sendRequestPageList = useCallback(
    async (query: RequestPageListParma) => {
      setState({ loading: true });
      try {
        const response = await requestPageList(query);
        const { data, code } = response;
        if (code === 0) {
          setState({ pageList: data.list, total: data.total });
        }
      } finally {
        setState({ loading: false });
      }
    },
    []
  );

  // 对组件外部暴露可调用的 API
  useImperativeHandle(
    ref,
    () => ({
      // 强制更新页面数据
      forceUpdate(opts?: RequestPageListParma, callback?: Function) {
        const query = { pageSize, pageNum, ...searchCondition, ...opts };
        sendRequestPageList(query).finally(() => callback?.());
      },
    }),
    [pageSize, pageNum, searchCondition]
  );

  // 页面初始化。
  // 之后，每当 deps 变化都会触发 sendRequestPageList() 重新请求数据
  useEffect(() => {
    sendRequestPageList({ pageSize, pageNum, ...searchCondition });
  }, [pageSize, pageNum, searchCondition]);

  useEffect(() => {
    onPaginationChange?.(pageNum, pageSize);
  }, [pageSize, pageNum]);

  const onPageSizeChange = useCallback((_: any, pageSize: number) => {
    setState({ pageSize, pageNum: 1 });
  }, []);

  const onPageNumChange = useCallback((pageNum: number) => {
    setState({ pageNum });
  }, []);

  // 点击查询按钮
  const handleSubmit = useCallback(
    (values: any) => {
      const condition = processFormValueAccordingColumns(
        values,
        searchColumns
      ) as SearchCondition;

      setState({ searchCondition: condition, pageNum: 1 });
    },
    [searchColumns]
  );

  // 导出数据
  const handleExport = useCallback(
    async (values: any) => {
      const exportCondition = processFormValueAccordingColumns(
        values,
        searchColumns
      ) as SearchCondition;
      try {
        const file = await dataExport!({
          ...exportCondition,
          pageSize,
          pageNum,
        });
        if (file.data.type === "application/json")
          throw new Error("文件下载失败");
        downLoadFile(exportFileName! || file.fileName, file.data);
      } catch (error) {
        message.warning("文件下载失败");
      }
    },
    [dataExport, exportFileName, searchColumns, pageNum, pageSize]
  );

  // 当 columns 中的某一项设置了 sorter 时，可以设置【倒叙/正序】 查询。
  const handleTableChange = useCallback(
    (_: any, __: any, sorter: any) => {
      const orderList: OrderList = [];
      // sorter 可能是对象，也可能是数组。分开处理
      if (sorter instanceof Array) {
        for (let i = 0; i < sorter.length; i++) {
          const { field, order } = sorter[i];
          // 正序-true、倒叙-false
          if (order)
            orderList.push({ field, direction: order.includes("asc") });
        }
      } else {
        const { field, order } = sorter;
        // 正序-true、倒叙-false
        if (order) orderList.push({ field, direction: order.includes("asc") });
      }

      const newSearchCondition: SearchCondition = {
        ...searchCondition,
        order: orderList,
      };
      if (orderList.length <= 0) delete newSearchCondition.order;

      setState({ searchCondition: newSearchCondition });
    },
    [searchCondition]
  );

  return (
    <div className={styles.page_container}>
      {showSearch && (
        <ListPageHeader
          columns={searchColumns}
          onSubmit={handleSubmit}
          onExport={handleExport}
          showExport={!!dataExport}
          searchButtonText={searchButtonText}
          showResetButton={showResetButton}
          initialValues={initialSearchCondition.current}
        />
      )}
      <Card bodyStyle={{ padding: "0 24px" }}>
        <div className={styles.table_header}>
          <div className={styles.table_header_title}>
            {tableTitle || "查询表格"}
          </div>
          {extra ? (
            <div className={styles.table_header_operation}>{extra}</div>
          ) : null}
        </div>

        <Table
          columns={tableColumns}
          dataSource={pageList}
          rowKey={rowKey || "smid"}
          loading={loading}
          pagination={false}
          bordered={bordered}
          scroll={tableScroll}
          rowSelection={rowSelection}
          onChange={handleTableChange}
        />

        {total > 0 && (
          <Pagination
            className={styles.pagination}
            total={total}
            pageSize={pageSize}
            current={pageNum}
            showSizeChanger={true}
            showTotal={paginationShowTotal}
            onShowSizeChange={onPageSizeChange}
            onChange={onPageNumChange}
            size={paginationSize}
          />
        )}
      </Card>
    </div>
  );
}

export default forwardRef(ListPageContent);
