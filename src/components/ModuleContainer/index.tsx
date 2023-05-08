import React, { memo } from "react";
import classes from "./index.module.less";

type ModuleContainerProps = {
  title: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

function ModuleTitle(props: ModuleContainerProps) {
  const { title, className, style, children } = props;
  return (
    <section
      className={`${classes.container}${className ? " " + className : ""}`}
      style={style}
    >
      <h2 className={classes.title}>{title}</h2>
      <div className={classes.body}>{children}</div>
    </section>
  );
}

export default memo(ModuleTitle);
