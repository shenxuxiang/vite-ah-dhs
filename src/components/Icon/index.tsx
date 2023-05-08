import React, { memo, useMemo } from "react";
import "@/assets/font/iconfont.css";

type IconProps = {
  name: string;
  style?: React.CSSProperties;
  size?: number;
  color?: string;
  extraProps?: any;
  onClick?: () => void;
  className?: string;
};

function Icon(props: IconProps) {
  const { name, style, size, color, onClick, className } = props;

  const renderStyle = useMemo(() => {
    const newStyle = { ...style };
    if (color) newStyle.color = color;
    if (size) newStyle.fontSize = size;
    return newStyle;
  }, [style, color, size]);

  return (
    <i
      className={`iconfont icon-${name}${className ? " " + className : ""}`}
      style={renderStyle}
      onClick={onClick}
    />
  );
}

export default memo(Icon);
