import { memo, useEffect } from "react";
import { Modal, Form, message, Spin, InputNumber } from "antd";
import {
  addResource,
  getResourceDetail,
  updateResource,
} from "@/services/overviewTripType";
import { useReducer } from "@/utils";
import moment from "moment";

const { useForm, Item: FormItem } = Form;

const LABEL_COL = { span: 6 };
const WRAPPER_COL = { span: 16 };
const initialValus = {
  ship: "",
  train: "",
  plane: "",
  drive: "",
};

function initialState() {
  return {
    loading: false,
    spinning: false,
  };
}

type AddUserProps = {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  id?: string;
};

function AddUser(props: AddUserProps) {
  const [state, setState] = useReducer(initialState);
  const { loading, spinning } = state;
  const [form] = useForm();
  const { open, onSuccess, onCancel, id } = props;

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    setState({ spinning: false });
    if (id) {
      setState({ spinning: true });
      getResourceDetail(id)
        .then((response: any) => {
          const { code, data } = response;
          if (code === 0) {
            form.setFieldsValue({ ...data, year: moment(data.year) });
          }
        })
        .finally(() => setState({ spinning: false }));
    }
  }, [open, id]);

  const handleSubmit = (values: any) => {
    setState({ loading: true });
    const params = { ...values };
    const submit = id ? updateResource : addResource;
    const successMsg = id ? "编辑成功" : "新增成功";
    const failMsg = id ? "编辑失败" : "新增失败";
    if (id) params.id = id;
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

  return (
    <Modal
      open={open}
      width={800}
      title={id ? "编辑" : "新增"}
      onOk={handleOk}
      maskClosable={false}
      onCancel={handleCancel}
      confirmLoading={loading}
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
            label="飞机"
            name="plane"
            rules={[{ required: true, message: "飞机不能为空" }]}
          >
            <InputNumber
              min={0}
              placeholder="请填写飞机"
              style={{ width: "100%" }}
            />
          </FormItem>

          <FormItem
            label="火车"
            name="train"
            rules={[{ required: true, message: "火车不能为空" }]}
          >
            <InputNumber
              min={0}
              placeholder="请填写火车"
              style={{ width: "100%" }}
            />
          </FormItem>

          <FormItem
            label="自驾"
            name="drive"
            rules={[{ required: true, message: "自驾不能为空" }]}
          >
            <InputNumber
              min={0}
              placeholder="请填写自驾"
              style={{ width: "100%" }}
            />
          </FormItem>

          <FormItem
            label="轮船"
            name="ship"
            rules={[{ required: true, message: "轮船不能为空" }]}
          >
            <InputNumber
              min={0}
              placeholder="请填写轮船"
              style={{ width: "100%" }}
            />
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
}

export default memo(AddUser);

type ChartOptions = {
  series: [
    {
      type: "line";
      name: string;
      colorBy: "series" | "data";
      coordinateSystem: "cartesian2d" | "polar";
      symbol:
        | "emptyCircle"
        | "circle"
        | "rect"
        | "roundRect"
        | "pin"
        | "arrow"
        | "none";
      symbolSize: number | [number, number] | ((value: any) => number);
      showSymbol: boolean;
      showAllSymbol: boolean;
      xAxisIndex: number;
      yAxisIndex: number;
      polarIndex: number;
      stack: string;
      triggerLineEvent: boolean;
      label: {
        show: boolean;
        position:
          | "top"
          | "bottom"
          | "left"
          | "right"
          | "inside"
          | "outside"
          | "center";
        distance: number;
        offset: [number, number];
        rotate: number;
        color: string;
        fontSize: number;
        fontWeight: string;
        align: "left" | "center" | "right";
        verticalAlign: "top" | "middle" | "bottom";
        width: number;
        height: number;
        overflow: "truncate" | "break" | "breakAll";
        ellipsis: string;
      };
      labelLine: {
        show: boolean;
        showAbove: boolean;
        length2: number;
        minTurnAngle: number;
        lineStyle: {
          color: string;
          type: "solid" | "dashed" | "dotted";
          width: number;
        };
      };
      labelLayout: {
        x: number;
        y: number;
        hideOverLap: boolean;
        moveOverlap: "shiftX" | "shiftY";
        align: string;
        verticalAlign: string;
        width: number;
        height: number;
      };
      itemStyle: {
        color: string;
        borderWidth: number;
        borderType: string;
        borderColor: string;
        borderRadius: number;
      };
      lineStyle: {
        color: string;
        type: string;
        width: number;
      };
      areaStyle: {
        color: string;
        opacity: number;
      };
      emphasis: {
        disabled: boolean;
        scale: number | boolean;
        focus: "series" | "self" | "none";
        label: {};
        labelLine: {};
        labelLayout: {};
        lineStyle: {};
        itemStyle: {};
        areaStyle: {};
      };
      smooth: boolean;
      markPoint: {
        symbol: "circle" | "rect" | "roundRect" | "pin" | "arrow" | "none";
        symbolSize: Function | number | [number, number];
        symbolRotate: number;
        silent: boolean;
        data: Array<
          | { type: "min" | "max" | "average"; name: string; value: string }
          | {
              coord: [number | string, number | string];
              name: string;
              value: string;
            }
          | {
              x: number | string;
              y: number | string;
              value: string;
              name: string;
            }
          | {
              xAxis: number | string;
              yAxis: number | string;
              value: string;
              name: string;
            }
        >;
      };
      markLine: {
        silent: boolean;
        symbol: string | [string, string];
        symbolSize: number;
        label: {};
        lineStyle: {};
        data: [{}];
      };
    }
  ];
};
