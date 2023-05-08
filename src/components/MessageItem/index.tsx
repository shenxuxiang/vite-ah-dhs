import React, { memo } from "react";
import cn from "classnames";
import "./index.less";

type MessageItemProps = {
  label: React.ReactNode;
  message?: React.ReactNode;
  children?: React.ReactNode;
  labelWidth?: number;
  wrapperClass?: string;
};

function MessageItem(props: MessageItemProps) {
  const { label, children, labelWidth, message, wrapperClass } = props;
  return (
    <div className="qm-message-item-x">
      <div className="qm-message-item-x-left" style={{ width: labelWidth }}>
        {label}：
      </div>
      <p
        className={cn("qm-message-item-x-right", {
          [wrapperClass!]: !!wrapperClass,
        })}
        title={message as string}
      >
        {children || message}
      </p>
    </div>
  );
}

export default memo(MessageItem);
