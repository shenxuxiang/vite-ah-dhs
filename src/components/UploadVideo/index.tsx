import { memo, useEffect, useCallback, useState, useMemo, useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, message, UploadFile } from "antd";
import { getLocalStorage } from "@/utils";
import Video from "./Video";

type UploadVideoProps = {
  action: string;
  maxSize?: number;
  maxCount?: number;
  disabled?: boolean;
  multiple?: boolean;
  value?: UploadFile[];
  headers?: { [propName: string]: string };
  onChange?: (fileList: UploadFile[]) => void;
};

/**
 * 图片上传组件
 * @param { action }   上传的路径
 * @param { headers }  上传时携带的请求头
 * @param { maxCount } 最多可以上传多少个图片，0 表示不限制
 * @param { multiple } 是否支持多张图片上传
 * @param { maxSize }  限制图片的大小，0 表示不限制
 * @param { value }    可控，组件回显，也可用 Form 表单控件
 * @param { onChange } 可控，value 变化的回调函数，也可用 Form 表单控件
 */
function UploadVideo(props: UploadVideoProps) {
  const {
    action,
    headers,
    maxCount = 0,
    maxSize = 0,
    value,
    onChange,
    multiple = true,
    disabled,
  } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 是否是内部更新的 fileList
  const isInternalModifiedFileList = useRef(false);

  useEffect(() => {
    if (isInternalModifiedFileList.current) onChange?.(fileList);
  }, [fileList]);

  useEffect(() => {
    if (value === undefined) {
      return;
    } else if (isInternalModifiedFileList.current) {
      isInternalModifiedFileList.current = false;
      return;
    } else {
      setFileList(() => value);
    }
  }, [value]);

  // 图片预览功能
  const handlePreview = useCallback((file: any) => {
    return Promise.resolve(window.URL.createObjectURL(file));
  }, []);

  // 图片上传事件
  const handleChangeFileList = useCallback(
    (field: any) => {
      const { file } = field;
      // maxSize === 0 表示不对文件大小进行限制。
      if (maxSize > 0 && file.size > maxSize * 1024 * 1024) return;

      function setStateAction(prevFileList: UploadFile[]) {
        let newFileList: any[] = [...prevFileList];
        if (file.status === "uploading" && file.percent <= 0) {
          // maxCount === 0 表示不限制上传的数量
          if (maxCount > 0 && newFileList.length >= maxCount)
            return prevFileList;
          newFileList.push(file);
        } else if (file.status === "done" || file.status === "error") {
          const index = newFileList.findIndex((item) => item.uid === file.uid);
          newFileList.splice(index, 1, file);
        } else if (file.status === "removed") {
          newFileList = prevFileList.filter((item) => item.uid !== file.uid);
        }

        return newFileList;
      }
      isInternalModifiedFileList.current = true;

      setFileList(setStateAction);
    },
    [fileList, maxSize, maxCount]
  );

  // 返回 false 表示不上传图片。
  const handleBeforeUploadForFileList = useCallback(
    (file: File) => {
      // 如果maxSize === 0 表示不对文件大小进行限制。
      if (maxSize === 0) return true;

      if (file.size > maxSize * 1024 * 1024) {
        message.warning(`上传图片大小不能超过${maxSize}M`);
        return false;
      } else {
        return true;
      }
    },
    [maxSize]
  );

  const computeHeaders = useMemo(() => {
    return { ...headers, Authorization: getLocalStorage("TOKEN") };
  }, [headers]);

  const handleDeleteFile = useCallback((file: any) => {
    isInternalModifiedFileList.current = true;
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  }, []);

  return (
    <Upload
      action={action}
      withCredentials
      accept="video/*"
      disabled={disabled}
      multiple={multiple}
      maxCount={maxCount}
      fileList={fileList}
      listType="picture-card"
      headers={computeHeaders}
      previewFile={handlePreview}
      onChange={handleChangeFileList}
      beforeUpload={handleBeforeUploadForFileList}
      // eslint-disable-next-line
      itemRender={(_: any, file: any) => {
        return (
          <Video
            width={100}
            height={100}
            file={file}
            onDelete={handleDeleteFile}
            disabled={disabled}
          />
        );
      }}
    >
      {maxCount === 0 || fileList?.length < maxCount ? (
        <div>
          <PlusOutlined disabled={disabled} />
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      ) : null}
    </Upload>
  );
}

export default memo(UploadVideo);
