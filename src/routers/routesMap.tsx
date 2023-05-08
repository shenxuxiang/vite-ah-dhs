import React from "react";
import LazyLoader from "@/components/LazyLoader";
import Icon from "@/components/Icon";

type RouteItem = {
  label?: string;
  icon?: React.ReactElement;
  path: string;
  element?: React.ReactElement;
  children?: RouteItem[];
};

const iconStyle = { fontSize: 18, marginRight: 10, color: "#fff" };

const routesMap: RouteItem[] = [
  {
    path: "/user",
    label: "用户管理",
    icon: <Icon name="manage" style={iconStyle} className="action" />,
    children: [
      {
        path: "/user/user-list",
        element: React.createElement(
          LazyLoader(() => import("../pages/user/userList"))
        ),
        label: "用户列表",
        icon: <Icon name="user" style={iconStyle} />,
      },
      {
        path: "/user/role-list",
        element: React.createElement(
          LazyLoader(() => import("../pages/user/roleList"))
        ),
        label: "角色列表",
        icon: <Icon name="role" style={iconStyle} />,
      },
      {
        path: "/user/menu-list",
        element: React.createElement(
          LazyLoader(() => import("../pages/user/menuList"))
        ),
        label: "菜单列表",
        icon: <Icon name="menu" style={iconStyle} />,
      },
    ],
  },
  {
    path: "/monitor",
    label: "监控管理",
    icon: <Icon name="monitor" style={iconStyle} className="action" />,
    children: [
      {
        path: "/monitor/request-log",
        element: React.createElement(
          LazyLoader(() => import("../pages/monitor/requestLog"))
        ),
        label: "请求日志",
        icon: <Icon name="calendar" style={iconStyle} />,
      },
    ],
  },
  {
    path: "/overview",
    label: "概况总览",
    icon: <Icon name="dashboard" style={iconStyle} className="action" />,
    children: [
      {
        path: "/overview/point-resource",
        element: React.createElement(
          LazyLoader(() => import("../pages/overview/pointResource"))
        ),
        label: "景区资源统计",
        icon: <Icon name="statistics" style={iconStyle} />,
      },
      {
        path: "/overview/history-travel",
        element: React.createElement(
          LazyLoader(() => import("../pages/overview/historyTravel"))
        ),
        label: "历年旅游指数",
        icon: <Icon name="zhishu" style={iconStyle} />,
      },
      {
        path: "/overview/travel-invest",
        element: React.createElement(
          LazyLoader(() => import("../pages/overview/travelInvest"))
        ),
        label: "旅游投资规模",
        icon: <Icon name="touzi" style={iconStyle} />,
      },
      {
        path: "/overview/hinge-program",
        element: React.createElement(
          LazyLoader(() => import("../pages/overview/hingeProgram"))
        ),
        label: "枢纽数量",
        icon: <Icon name="map" style={iconStyle} />,
      },
      {
        path: "/overview/trip-type",
        element: React.createElement(
          LazyLoader(() => import("../pages/overview/tripType"))
        ),
        label: "出行方式占比",
        icon: <Icon name="pie" style={iconStyle} />,
      },
    ],
  },
  {
    path: "/tourist-resource",
    label: "旅游资源",
    icon: <Icon name="travel" style={iconStyle} className="action" />,
    children: [
      {
        path: "/tourist-resource/village",
        element: React.createElement(
          LazyLoader(() => import("../pages/touristResource/village"))
        ),
        label: "潜力村庄",
        icon: <Icon name="ziyuan" style={iconStyle} />,
      },
      {
        path: "/tourist-resource/other",
        element: React.createElement(
          LazyLoader(() => import("../pages/touristResource/other"))
        ),
        label: "其他资源",
        icon: <Icon name="qita" style={iconStyle} />,
      },
    ],
  },
];

export default routesMap;
