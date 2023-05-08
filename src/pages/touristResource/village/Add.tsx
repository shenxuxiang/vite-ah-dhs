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
  Button,
} from "antd";
import {
  addResource,
  getRegionList,
  getResourceDetail,
  updateResource,
} from "@/services/touristResourceVillage";
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
  type: 0,
  airport: "",
  tollGate: "",
  airStation: "",
  railwayStation: "",
  passengerStation: "",
};

function initialState() {
  return {
    loading: false,
    spinning: false,
    regionList: [] as any[],
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
  const { loading, spinning, regionList, showMapModal } = state;
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
            const {
              pics,
              videos,
              bgm,
              introduceAudio,
              xzjxzqh,
              xzjxzqhdm,
              status,
            } = data;
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
              bgm: computeFileOption(bgm),
              introduceAudio: computeFileOption(introduceAudio),
              xzjxzqhdm: xzjxzqhdmArr,
            });

            statusRef.current = status;
          }
        })
        .finally(() => setState({ spinning: false }));
    }
  }, [open]);

  const handleSubmit = (values: any) => {
    setState({ loading: true });

    const { pics, videos, bgm, introduceAudio, xzjxzqhdm } = values;
    const newPictures = getImageUrl(pics);
    const newVideos = getFileUrl(videos);
    const newBgm = getFileUrl(bgm?.[0]);
    const newIntroduceAudio = getFileUrl(introduceAudio?.[0]);
    const params = {
      ...values,
      bgm: newBgm,
      pics: newPictures,
      videos: newVideos,
      introduceAudio: newIntroduceAudio,
      xzjxzqhdm: xzjxzqhdm.slice(-1)[0],
      xzjxzqh: townNameRef.current,
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

  const handleFocus = useCallback((event: any) => {
    event.target.blur();
    if (!form.getFieldValue("xzjxzqhdm")) {
      message.warning("请先选择所属乡(镇)");
      return;
    }

    setState({ showMapModal: true });
  }, []);

  const handleChangeTownName = useCallback((...args: any[]) => {
    const [, list] = args;
    townNameRef.current = list?.[list.length - 1]?.label ?? "";
    townFullNameRef.current = list?.[list.length - 1]?.fullName ?? "";
    // 每次修改所属乡镇后，都会将经纬度进行重置。
    // form.resetFields(['longitude', 'latitude']);
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
                  label="村庄名称"
                  name="villageName"
                  rules={[{ required: true, message: "村庄名称不能为空" }]}
                >
                  <Input
                    placeholder="请填写村庄名称"
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
                    placeholder="请填写经度"
                    autoComplete="false"
                    disabled={disabled}
                    onDoubleClick={handleFocus}
                  />
                  {/* <Input placeholder="请填写维度" autoComplete="false" disabled={disabled} /> */}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  label="分组"
                  name="villageGroup"
                  getValueFromEvent={getValueFromEventForInput}
                >
                  <Input
                    placeholder="请填写分组"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="户数" name="residence">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写户数"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="户籍人口" name="population">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写户籍人口"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="常住人口" name="permanentNum">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写常住人口"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="房屋总数量" name="houseNum">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写房屋总数量"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="闲置房屋" name="idleHouseNum">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写闲置房屋"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="闲置占比" name="idleHouseRate">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写闲置占比"
                    autoComplete="false"
                    min={0}
                    max={100}
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="村庄面积(平方千米)" name="area">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写村庄面积(平方千米)"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  label="自然村开发情况"
                  name="developCondition"
                  getValueFromEvent={getValueFromEventForInput}
                >
                  <Input
                    placeholder="请填写自然村开发情况"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="通村公路等级" name="roadLevel">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写通村公路等级"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  label="距最近高速出口距离(公里)"
                  name="distanceToFreeway"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写距最近高速出口距离(公里)"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="距高铁站距离(公里)" name="distanceToRailway">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写距高铁站距离(公里)"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  label="距县道、省道最近距离(公里)"
                  name="distanceToHighway"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写距县道、省道最近距离(公里)"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="距县城最近距离(公里)"
                  name="distanceToDistrict"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写距县城最近距离(公里)"
                    autoComplete="false"
                    disabled={disabled}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="距乡镇中心距离(公里)" name="distanceToVillage">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请填写距乡镇中心距离(公里)"
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
