import { memo, useEffect, useCallback, useState, useMemo, useRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, Modal, message, UploadFile, Button } from "antd";
import { getLocalStorage } from "@/utils";

type UploadImageProps = {
  action: string;
  accept?: string;
  maxSize?: number;
  maxCount?: number;
  multiple?: boolean;
  disabled?: boolean;
  value?: UploadFile[];
  uploadButtonText?: string;
  headers?: { [propName: string]: string };
  onChange?: (fileList: UploadFile[]) => void;
  listType?: "text" | "picture" | "picture-card" | "picture-circle";
};

/**
 * 图片上传组件
 * @param { action }           上传的路径
 * @param { headers }          上传时携带的请求头
 * @param { maxCount }         最多可以上传多少个图片，0 表示不限制
 * @param { multiple }         是否支持多张图片上传
 * @param { maxSize }          限制图片的大小，0 表示不限制
 * @param { value }            可控，组件回显，也可用 Form 表单控件
 * @param { onChange }         可控，value 变化的回调函数，也可用 Form 表单控件
 * @param { disabled }         是否禁用该功能
 * @param { uploadButtonText } 上传按钮的文案
 */
function UploadImage(props: UploadImageProps) {
  const {
    action,
    headers,
    maxCount = 0,
    maxSize = 0,
    value,
    onChange,
    multiple = true,
    disabled,
    uploadButtonText,
    accept = "*/**",
    listType = "text",
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
        } else if (file.status === "error") {
          const { uid, name, status } = file;
          const index = newFileList.findIndex((item) => item.uid === uid);
          newFileList.splice(index, 1, { uid, name, status });
        } else if (file.status === "done") {
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
    return { Authorization: getLocalStorage("TOKEN"), ...headers };
  }, [headers]);

  const renderUploadButton = useMemo(() => {
    return maxCount === 0 || fileList?.length < maxCount ? (
      <Button icon={<UploadOutlined />} disabled={disabled}>
        {uploadButtonText || "上传附件"}
      </Button>
    ) : null;
  }, [maxCount, fileList, disabled, uploadButtonText]);

  return (
    <Upload
      accept={accept}
      action={action}
      withCredentials
      disabled={disabled}
      multiple={multiple}
      maxCount={maxCount}
      fileList={fileList}
      listType={listType}
      headers={computeHeaders}
      onChange={handleChangeFileList}
      beforeUpload={handleBeforeUploadForFileList}
    >
      {renderUploadButton}
    </Upload>
  );
}

export default memo(UploadImage);
