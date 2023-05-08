import React, { memo, useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Input,
  Select,
  DatePicker,
  Cascader,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { throttle } from "@/utils";

const FormItem = Form.Item;
const SelectOption = Select.Option;

enum ColSize {
  xxl = 6,
  xl = 8,
  // eslint-disable-next-line
  lg = 8,
  sm = 12,
  // eslint-disable-next-line
  md = 12,
  xs = 24,
}
// 计算屏幕的宽度
function clientWidth() {
  return window.innerWidth || document.documentElement.clientWidth;
}

// 计算一行可以盛放几个 Col 盒子
function computedColSpan(width?: number): number {
  if (!width) width = clientWidth();
  if (width > 1600) return ColSize.xxl;
  if (width > 1200) return ColSize.xl;
  if (width > 992) return ColSize.lg;
  if (width > 768) return ColSize.md;
  if (width > 576) return ColSize.sm;
  return ColSize.xs;
}

export type Column = {
  // 用作 FormItem 的 name 字段， 如果该字段没有则取 dataIndex。
  name?: string;
  label?: string;
  // 标题
  title: string;
  dataIndex?: string;
  // 渲染的表单类型，可以是 select、rangePicker
  renderType?: string;
  // 当 renderType === select 时，渲染 Select.Option 时的 value 取值
  keyNameForValue?: string;
  // 当 renderType === select 时，渲染 Select.Option 时的 title 取值
  keyNameForKey?: string;
  // 用来过滤 columns，
  hideInSearch?: boolean;
  hideInTable?: boolean;
  // 在 Select 组件中，用作 下拉选项的列表；其他组件时用作组件的 props 使用
  options?: any;
  // 在表单查询之前的行为，value 是 Form 表单传递的值，通过此方法可以对值进行修改。
  beforeSubmitBehavior?: (value: any) => any;
  placeholder?: string;
  // 初始化查询条件值
  initialConditionValue?: any;
};

export type Columns = Column[];

// 根据 columns 处理 Form，并得到我们需要的内容。
export function processFormValueAccordingColumns(
  values: any,
  columns: Column[]
) {
  const formValue = {} as { [propName: string]: any };

  // 在对表单查询之前，我要需要遍历 columns 数组，查看是否有自定义的行为
  for (let i = 0; i < columns.length; i++) {
    const { name, dataIndex, beforeSubmitBehavior } = columns[i];
    // 通过 name/dataIndex 获取表单的值，name 优先于 dataIndex。
    const value = values[name! || dataIndex!];
    if (value === null || value === undefined) continue;

    // beforeSubmitBehavior 必须要要返回一个有效的值，并最终做为表单查询的条件。
    if (typeof beforeSubmitBehavior === "function") {
      const fieldValue = beforeSubmitBehavior(value);
      Object.assign(formValue, fieldValue);
    } else {
      formValue[name! || dataIndex!] = value;
    }
  }
  return formValue;
}

type PageHeaderProps = {
  columns: Columns;
  onSubmit: (values: {}) => void;
  initialValues?: any;
  title?: string;
  onExport?: (values: {}) => void;
  showExport: boolean;
  // 查询按钮内容自定义
  searchButtonText?: string;
  // 是否显示重置按钮
  showResetButton?: boolean;
};

function PageHeader(props: PageHeaderProps) {
  // 每个 Col 组件的 span 值
  const [colSpan, setColSpan] = useState(() => computedColSpan());
  // 是否展开（显示所有的查询条件）
  const [expand, setExpand] = useState(true);

  const {
    onSubmit,
    initialValues,
    columns,
    onExport,
    showExport,
    showResetButton = true,
    searchButtonText = "查询",
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    function resize() {
      const colSpan = computedColSpan();
      setColSpan(() => colSpan);
    }

    const hanleResize = throttle(resize, 200);

    window.addEventListener("resize", hanleResize, false);
    return () => {
      window.removeEventListener("resize", hanleResize, false);
    };
  }, []);

  // 渲染查询表单内容
  const renderFormContext = useMemo(() => {
    const cols = 24 / colSpan;
    let length = columns.length;
    // 这一段代码先不去掉，暂时不确定是不渲染还是不展示
    // if (length >= cols) length = expand ? columns.length : 24 / colSpan - 1;
    const context = [];

    for (let i = 0; i < length; i++) {
      const {
        dataIndex,
        title,
        label,
        renderType,
        keyNameForValue,
        keyNameForKey,
        options,
        name,
        placeholder,
      } = columns[i];

      let contextItem = null;
      if (renderType === "select") {
        contextItem = (
          <Select
            placeholder={placeholder || `请选择您要查询的${title}`}
            allowClear
            style={{ maxWidth: "290px" }}
          >
            {options.map((item: any) => (
              <SelectOption
                value={item[keyNameForValue || "value"]}
                key={item[keyNameForValue || "value"]}
              >
                {item[keyNameForKey || "label"]}
              </SelectOption>
            ))}
          </Select>
        );
      } else if (renderType === "cascader") {
        contextItem = (
          <Cascader
            options={options}
            placeholder={placeholder || `请选择您要查询的${title}`}
            changeOnSelect
          />
        );
      } else if (renderType === "rangePicker") {
        contextItem = (
          <DatePicker.RangePicker format="YYYY-MM-DD" {...options} />
        );
      } else if (renderType === "datePicker") {
        contextItem = (
          <DatePicker
            format="YYYY-MM-DD"
            {...options}
            style={{ width: "100%" }}
          />
        );
      } else {
        contextItem = (
          <Input
            placeholder={placeholder || `请输入要查询的${title}`}
            allowClear
            autoComplete="off"
          />
        );
      }

      context.push(
        <Col
          sm={12}
          md={12}
          lg={8}
          xl={8}
          xxl={6}
          key={`key-${i}`}
          style={{ display: i > cols - 2 && !expand ? "none" : "" }}
        >
          <FormItem label={label || title} name={name || dataIndex}>
            {contextItem}
          </FormItem>
        </Col>
      );
    }
    return context;
  }, [colSpan, expand, columns]);

  // 计算最后一个 Col 组件的 offset 偏移量
  const offsetColSpan = useMemo(() => {
    // 一行可以盛放几个 Col 组件
    const cols = 24 / colSpan;

    if (columns.length < cols) return (cols - columns.length - 1) * colSpan;

    // 取模，表示最后一行会有几个 Col 组件
    const remainder = columns.length % cols;
    // 计算【查询】按钮所在的 Col 组件的 offsetSpan 数。
    const offsetSpan = (cols - 1 - remainder) * colSpan;
    return expand ? offsetSpan : 0;
  }, [columns, colSpan, expand]);

  // 展开/收起
  const handleChangeExpand = useCallback(() => {
    setExpand((expand) => !expand);
  }, []);

  const handleFinish = useCallback(
    (values: {}) => {
      onSubmit?.(values);
    },
    [onSubmit]
  );

  const handleReset = useCallback(() => {
    onSubmit?.({});
  }, []);

  const handleExport = useCallback(() => {
    onExport?.(form.getFieldsValue());
  }, [form, onExport]);

  return (
    <div className={styles.header}>
      <Form
        name="basic"
        onFinish={handleFinish}
        form={form}
        onReset={handleReset}
        initialValues={initialValues}
      >
        <Row className={styles.row_start}>
          {renderFormContext}
          <Col
            sm={12}
            md={12}
            lg={8}
            xl={8}
            xxl={6}
            offset={offsetColSpan}
            className={styles.button_groups}
          >
            <Button type="primary" htmlType="submit">
              {searchButtonText}
            </Button>
            {showResetButton && (
              <Button htmlType="reset" style={{ marginLeft: "8px" }}>
                重置
              </Button>
            )}
            {showExport && (
              <Button style={{ marginLeft: "8px" }} onClick={handleExport}>
                导出
              </Button>
            )}
            {columns.length >= 24 / colSpan && (
              <Button type="link" onClick={handleChangeExpand}>
                {expand ? "收起" : "展开"}
                <DownOutlined
                  className={`${styles.icon}${
                    expand ? " " + styles.expand : ""
                  }`}
                />
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default memo(PageHeader);
