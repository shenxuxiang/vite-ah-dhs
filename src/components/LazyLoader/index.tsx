import React, { useState, useLayoutEffect, useRef } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Spin } from "antd";
import { getLocalStorage } from "@/utils";
import classes from "./index.module.less";

type Loader = () => Promise<{
  default: React.FunctionComponent | React.ComponentClass;
}>;

export default function LazyLoader(loader: Loader): React.FunctionComponent {
  return function (props: any) {
    const [content, setContent] = useState<
      React.FunctionComponent | React.ComponentClass | null
    >(null);
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const searchParams = useSearchParams();
    const permissionRef = useRef();
    if (!permissionRef.current) {
      // 1-超级管理员；2-市县用户；3-省级用户
      const { regionRight } = getLocalStorage("USER_INFO") || {};
      permissionRef.current = regionRight;
    }
    useLayoutEffect(() => {
      loader().then((response) => {
        setContent(() => response.default);
      });
    }, []);

    if (content) {
      let Comp = content;
      return (
        <Comp
          {...props}
          location={location}
          navigate={navigate}
          params={params}
          searchParams={searchParams}
          permission={permissionRef.current}
        />
      );
    }

    return (
      <div className={classes.loading}>
        <Spin size="large" />
      </div>
    );
  };
}
