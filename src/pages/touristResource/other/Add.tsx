import { memo, useCallback, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  message,
  Spin,
  Input,
  InputNumber,
  Cascader,
  Row,
  Col,
  Radio,
  Select,
  Button,
} from "antd";
import {
  addResource,
  getRegionList,
  getResourceDetail,
  updateResource,
  getDetailType,
} from "@/services/touristResourceOther";
import { useReducer, isArray } from "@/utils";
import UploadImage from "@/components/UploadImage";
import UploadVideo from "@/components/UploadVideo";
import UploadAudio from "@/components/UploadAudio";
import Bmap from "../components/Bmap";
const { useForm, Item: FormItem } = Form;

const LABEL_COL = { span: 8 };
const WRAPPER_COL = { span: 16 };

const computeImageOption = (data: any[]) => {
  // eslint-disable-next-line
  if (data == null) return undefined;
  return data.map((item: any) => {
    const { id, miniUrl, url, name } = item;
    return {
      url: miniUrl || url,
      // 高清图 URL
      hdPictureUrl: url,
      uid: id || Math.random().toString(32).slice(2),
      name: name || "",
      status: "done",
    };
  });
};
const computeFileOption = (data: any) => {
  // eslint-disable-next-line
  if (data == null) return undefined;
  if (isArray(data)) {
    return data.map((item: any) => {
      const { id, url, name } = item;
      return {
        url: url,
        uid: id || Math.random().toString(32).slice(2),
        name: name || "",
        status: "done",
      };
    });
  } else {
    const { id, url, name } = data;
    return [
      {
        url: url,
        uid: id || Math.random().toString(32).slice(2),
        name: name || "",
        status: "done",
      },
    ];
  }
};
const getImageUrl = (data: any[]) => {
  // eslint-disable-next-line
  if (data == null) return undefined;

  return data
    .map((item: any) => {
      if (item.status !== "done") return null;
      const { path, miniPath } = item.response?.data ?? {};
      return {
        url: item.hdPictureUrl || path,
        miniUrl: item.url || miniPath,
      };
    })
    .filter(Boolean);
};

const getFileUrl = (data: any): string[] | string | undefined => {
  // eslint-disable-next-line
  if (data == null) return undefined;
  if (isArray(data)) {
    return data
      .map((item: any) => {
        return item.url || item.response?.data?.path;
      })
      .filter(Boolean);
  } else {
    return data.url || data.response?.data?.path;
  }
};

const initialValus = {
  isProtect: "1",
  isPark: "1",
};

function initialState() {
  return {
    loading: false,
    spinning: false,
    regionList: [] as any[],
    detailTypeList: [] as { value: string; label: string }[],
    showMapModal: false,
  };
}

type AddUserProps = {
  id?: string;
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  disabled?: boolean;
};

function AddUser(props: AddUserProps) {
  const [state, setState] = useReducer(initialState);
  const { loading, spinning, regionList, detailTypeList, showMapModal } = state;
  const [form] = useForm();
  const { open, onSuccess, onCancel, id, disabled } = props;
  const statusRef = useRef(null);

  // 乡镇名称
  const townNameRef = useRef("");
  // 乡镇全称，例如：安徽省安庆市迎江区宜城路街道
  const townFullNameRef = useRef("");

  useEffect(() => {
    getRegionList().then((response: any) => {
      if (response.code === 0) {
        setState({ regionList: response.data });
      }
    });

    getDetailType().then((response: any) => {
      const { data, code } = response;
      if (code === 0) {
        setState({
          detailTypeList: data?.map((item: any) => ({
            label: item.desc,
            value: item.typeCode,
          })),
        });
      }
    });
  }, []);

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
            const { pics, videos, introduceAudio, xzjxzqh, xzjxzqhdm, status } =
              data;
            townNameRef.current = xzjxzqh;
            townFullNameRef.current = xzjxzqh;
            const xzjxzqhdmArr = [
              String(xzjxzqhdm).substring(0, 2),
              String(xzjxzqhdm).substring(0, 4),
              String(xzjxzqhdm).substring(0, 6),
              xzjxzqhdm,
            ];
            form.setFieldsValue({
              ...data,
              pics: computeImageOption(pics),
              videos: computeFileOption(videos),
              introduceAudio: computeFileOption(introduceAudio),
              xzjxzqhdm: xzjxzqhdmArr,
            });
            statusRef.current = status;
          }
        })
        .finally(() => setState({ spinning: false }));
    }
  }, [open, id]);

  const handleFocus = useCallback((event: any) => {
    event.target.blur();
    if (!form.getFieldValue("xzjxzqhdm")) {
      message.warning("请先选择所属乡(镇)");
      return;
    }

    setState({ showMapModal: true });
  }, []);

  const handleSubmit = (values: any) => {
    setState({ loading: true });
    const { pics, videos, introduceAudio, xzjxzqhdm } = values;
    const newPictures = getImageUrl(pics);
    const newVideos = getFileUrl(videos);
    const newIntroduceAudio = getFileUrl(introduceAudio?.[0]);
    const params = {
      ...values,
      pics: newPictures,
      videos: newVideos,
      xzjxzqh: townNameRef.current,
      introduceAudio: newIntroduceAudio,
      xzjxzqhdm: xzjxzqhdm.slice(-1)[0],
    };

    const submit = id ? updateResource : addResource;
    const successMsg = id ? "编辑成功" : "新增成功";
    const failMsg = id ? "编辑失败" : "新增失败";
    if (id) {
      params.id = id;
      params.status = statusRef.current;
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

  const handleChangeTownName = useCallback((...args: any[]) => {
    const [, list] = args;
    townNameRef.current = list?.[list.length - 1]?.label ?? "";
    townFullNameRef.current = list?.[list.length - 1]?.fullName ?? "";
    // 每次修改所属乡镇后，都会将经纬度进行重置。
    form.resetFields(["longitude", "latitude"]);
  }, []);
  // 关闭地图弹框
  const handleBmapCancel = useCallback(() => {
    setState({ showMapModal: false });
  }, []);

  // 获取到经纬度
  const handleBmapSuccess = useCallback((latlng: any) => {
    setState({ showMapModal: false });
    form.setFieldsValue({ longitude: latlng?.lng, latitude: latlng?.lat });
  }, []);

  return (
    <>
      <Modal
        open={open}
        width={1200}
        title={id ? "编辑" : "新增"}
        onOk={handleOk}
        maskClosable={false}
        onCancel={handleCancel}
        confirmLoading={loading}
        okButtonProps={{ disabled }}
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
            <Row>
              <Col span={12}>
                <FormItem
                  label="资源名称"
                  name="name"
                  rules={[{ required: true, message: "资源名称不能为空" }]}
                >
                  <Input
                    placeholder="请填写资源名称"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="所属乡（镇）"
                  name="xzjxzqhdm"
                  rules={[{ required: true, message: "所属乡（镇）不能为空" }]}
                >
                  <Cascader
                    options={regionList}
                    allowClear={false}
                    placeholder="请选择所属乡镇"
                    onChange={handleChangeTownName}
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  label="经度"
                  name="longitude"
                  getValueFromEvent={getValueFromEventForInput}
                  rules={[{ required: true, message: "经度不能为空" }]}
                >
                  <Input
                    placeholder="请填写经度"
                    autoComplete="false"
                    disabled={disabled}
                    onDoubleClick={handleFocus}
                  />
                  {/* <Input placeholder="请填写经度" autoComplete="false" disabled={disabled} /> */}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="维度"
                  name="latitude"
                  getValueFromEvent={getValueFromEventForInput}
                  rules={[{ required: true, message: "维度不能为空" }]}
                >
                  <Input
                    placeholder="请填写维度"
                    autoComplete="false"
                    disabled={disabled}
                    onDoubleClick={handleFocus}
                  />
                  {/* <Input placeholder="请填写维度" autoComplete="false" disabled={disabled} /> */}
                </FormItem>
              </Col>
            </Row>

            <Row>
              {/* <Col span={12}>
                <FormItem label="类型" name="type" getValueFromEvent={getValueFromEventForInput}>
                  <Input placeholder="请填写类型" autoComplete="false" disabled={disabled} />
                </FormItem>
              </Col> */}
              <Col span={12}>
                <FormItem label="详细类型" name="detailType">
                  <Select
                    options={detailTypeList}
                    placeholder="请填写详细类型"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="是否在生态保护线内" name="isProtect">
                  <Radio.Group>
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="是否在自然公园内" name="isPark">
                  <Radio.Group>
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="基本情况" name="merit">
                  <Input
                    placeholder="请填写基本情况"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="产权属性" name="propertyRight">
                  <Input
                    placeholder="请填写产权属性"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="面积（平方米）" name="area">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写面积（平方米）"
                    autoComplete="false"
                    min={0}
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="年代" name="year">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写年代"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  label="其他"
                  name="other"
                  getValueFromEvent={getValueFromEventForInput}
                >
                  <Input
                    placeholder="请填写其他的相关信息"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="适合开发类型" name="developType">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写适合开发类型"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <FormItem
                  label="介绍"
                  name="introduction"
                  labelCol={{ span: 4 }}
                  getValueFromEvent={getValueFromEventForInput}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="请填写介绍"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item
                  name="pics"
                  label="上传图片"
                  extra={
                    <span>
                      （单张图片大小不超过50M，最多不超过200张）
                      <Button
                        type="link"
                        disabled={disabled}
                        onClick={() => form.resetFields(["pics"])}
                      >
                        清除所有图片
                      </Button>
                    </span>
                  }
                  labelCol={{ span: 4 }}
                >
                  <UploadImage
                    action="/v1.0/file/upload"
                    maxCount={200}
                    maxSize={50}
                    multiple
                    disabled={disabled}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="videos"
                  label="上传视频"
                  extra="（单个视频大小不超过600M，最多不超过5张）"
                  labelCol={{ span: 4 }}
                >
                  <UploadVideo
                    action="/v1.0/file/upload"
                    maxCount={5}
                    maxSize={600}
                    multiple
                    disabled={disabled}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="introduceAudio"
                  label="上传介绍音频"
                  labelCol={{ span: 4 }}
                >
                  <UploadAudio
                    action="/v1.0/file/upload"
                    maxCount={1}
                    multiple={false}
                    disabled={disabled}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <Bmap
        height={500}
        open={showMapModal}
        onCancel={handleBmapCancel}
        onSuccess={handleBmapSuccess}
        location={townFullNameRef.current}
        lng={form.getFieldValue("longitude")}
        lat={form.getFieldValue("latitude")}
      />
    </>
  );
}

export default memo(AddUser);
