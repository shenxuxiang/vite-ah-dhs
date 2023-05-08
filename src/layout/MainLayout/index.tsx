import React, {
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellFilled,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Avatar,
  Popover,
  message,
  Badge,
  Button,
  Tabs,
  Drawer,
  Alert,
  Card,
} from "antd";
import useReducer from "@/utils/useReducer";
import { computeMenuItems, MenuItem } from "@/routers";
import logo from "@/assets/images/logo.png";
import { events, getLocalStorage } from "@/utils";
import { signOut, getUnDealTaskList } from "@/services/login";
import avatarUrl from "@/assets/images/avatar.png";
import "./index.less";

const { Content, Sider, Header, Footer } = Layout;

const initialState = () => {
  return {
    collapsed: false,
    selectedMenuKeys: ["/"],
    openKeys: ["/"],
    userName: "",
    avatar: "",
    menuItems: [] as MenuItem[],
    userMessage: { total: 0, other: [] as any[], village: [] as any[] },
    // 是否普通用户
    isOrdinaryUser: true,
    openDrawer: false,
  };
};

const MainLayout: React.FC = () => {
  const [state, setState] = useReducer(initialState);
  const {
    selectedMenuKeys,
    collapsed,
    avatar,
    userName,
    menuItems,
    userMessage,
    isOrdinaryUser,
    openDrawer,
  } = state;

  const navigate = useNavigate();
  const location = useLocation();
  const menuItemsRef = useRef<any>(null);

  useLayoutEffect(() => {
    const userInfo = getLocalStorage("USER_INFO");
    if (!userInfo) return;

    // resourceList 为用户菜单权限
    const { avatar, username, regionRight, resourceList } = userInfo;
    const menuPerissions = flatTreeObject(resourceList || []);
    const menuItems = computeMenuItems(menuPerissions);
    menuItemsRef.current = menuItems;
    setState({
      menuItems,
      avatar,
      userName: username,
      isOrdinaryUser: regionRight === "2",
    });

    function flatTreeObject(ary: any[]): Set<string> {
      const stack = [...ary];
      const map = new Set<string>();

      while (stack.length) {
        const { path, children } = stack.shift();
        map.add(path);
        if (children?.length) stack.unshift(...children);
      }
      return map;
    }
  }, []);

  useEffect(() => {
    const { pathname } = location;

    if (!getLocalStorage("TOKEN")) {
      message.warning("请先完成用户登录");
      window.location.assign("/#/login");
      return;
    }

    // 每当访问 "/" 路径时，重定向到菜单的第一项。
    if (pathname === "/" && menuItemsRef.current) {
      let firstPage = menuItemsRef.current[0];
      while (firstPage?.children?.length) {
        firstPage = firstPage.children[0];
      }
      navigate(firstPage.key);
      return;
    }

    // 1-超级管理员；2-市县用户；3-省级用户
    const { regionRight } = getLocalStorage("USER_INFO") || {};
    // 超级用户、省级用户才能调用该接口
    regionRight !== "2" &&
      getUnDealTaskList().then((res: any) => {
        const { code, data } = res;
        if (code === 0) {
          const village: any[] = [];
          const other: any[] = [];
          const total = data?.length;
          total > 0 &&
            data.forEach((item: any) => {
              if (item.bussinessType === "POTENTIAL_VILLAGE") {
                village.push(item);
              } else {
                other.push(item);
              }
            });
          setState({ userMessage: { total, village, other } });
        }
      });

    const regexp = /^(\/[^/?#]+)(\/[^/?#]+)+/;
    let openKeys: string[] = [];
    if (regexp.exec(pathname)) openKeys = [RegExp.$1];

    setState({ selectedMenuKeys: [pathname], openKeys });
  }, [location]);

  const handleSelectMenu = (event: any) => {
    navigate(event.key);
    setState({ selectedMenuKeys: event.selectedKeys });
  };

  const handleChangeOpenKeys = useCallback((keys: any[]) => {
    setState({ openKeys: keys });
  }, []);

  const handleSignOut = () => {
    // 先调用退出接口。不管结果如何都清空本地数据缓存。
    signOut().finally(() => {
      window.localStorage.clear();
      navigate("/login");
    });
  };

  const handleTriggerSlider = useCallback(() => {
    setState((prevState) => ({ collapsed: !prevState.collapsed }));
    // 菜单展开和收缩的时候有动画效果，需要等待动画效果完成后再触发 resize 事件。
    // 所有图标的组件中都会添加对 resize 事件的监听。
    setTimeout(() => events.emit("resize"), 400);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setState({ openDrawer: false });
  }, []);

  // 渲染右侧的消息任务列表
  const renderDrawerContent = useMemo(() => {
    // 普通用户不渲染
    if (isOrdinaryUser) return [];
    const handleNavigate = (opts: any) => {
      const { approveType, bussinessType } = opts;
      setState({ openDrawer: false });
      let href = `/tourist-resource/${
        bussinessType === "POTENTIAL_VILLAGE" ? "village" : "other"
      }`;
      let forceUpdate = false;
      if (window.location.href.includes(href)) forceUpdate = true;

      window.location.hash = `${href}?status=${
        approveType === "1" ? "1" : "4"
      }`;
      forceUpdate && window.location.reload();
    };

    const computeChildren = (data: any[], onClick: (opts: any) => void) => {
      return (
        <div style={{ height: "100%", overflow: "auto", padding: "0 20px" }}>
          {data.map((item: any) => (
            <Card
              onClick={() => onClick(item)}
              key={item.bussinessId}
              bodyStyle={{ padding: "10px 20px" }}
              className="hn-picc-user-message-list-card"
              title={item.approveType === "1" ? "审批任务" : "删除审批任务"}
            >
              <p>业务单据：{item.bussinessId}</p>
              <p>创建人：{item.createUserName}</p>
            </Card>
          ))}
        </div>
      );
    };

    return [
      {
        key: "1",
        label: "潜力村庄",
        children: computeChildren(userMessage.village, handleNavigate),
      },
      {
        key: "2",
        label: "其他资源",
        children: computeChildren(userMessage.other, handleNavigate),
      },
    ];
  }, [userMessage, isOrdinaryUser]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        collapsible
        theme="dark"
        trigger={null}
        collapsed={collapsed}
      >
        <div className="hn-picc-logo">
          <img src={logo} className="hn-picc-logo-img" />
          <div className={`hn-picc-logo-title ${collapsed ? " hide" : ""}`}>
            大黄山中台系统
          </div>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          openKeys={state.openKeys}
          onSelect={handleSelectMenu}
          selectedKeys={selectedMenuKeys}
          onOpenChange={handleChangeOpenKeys}
        />
      </Sider>
      <Layout className="hn-picc-body">
        <Header className="hn-picc-body-header">
          <span onClick={handleTriggerSlider}>
            {collapsed ? (
              <MenuUnfoldOutlined className="hn-picc-menu-slider-button" />
            ) : (
              <MenuFoldOutlined className="hn-picc-menu-slider-button" />
            )}
          </span>
          <div className="hn-picc-body-header-right">
            {
              // 普通用户不渲染该节点
              isOrdinaryUser ? null : (
                <div
                  className="hn-picc-body-header-right-message"
                  onClick={() => setState({ openDrawer: true })}
                >
                  <BellFilled className="hn-picc-body-header-right-message-icon" />
                  <Badge
                    count={userMessage.total}
                    className="hn-picc-body-header-right-message-tips"
                  />
                </div>
              )
            }
            <Popover
              trigger="click"
              placement="bottomLeft"
              content={
                <>
                  <a className="hn-picc-signout-button" onClick={handleSignOut}>
                    退出登录
                  </a>
                  <a
                    className="hn-picc-signout-button"
                    onClick={() => navigate("/login/passwd")}
                  >
                    修改密码
                  </a>
                </>
              }
            >
              <div className="hn-picc-body-header-avatar">
                <Avatar
                  icon={<UserOutlined />}
                  src={avatar || avatarUrl}
                  size={48}
                />
                <span className="hn-picc-body-header-userName">{userName}</span>
              </div>
            </Popover>
          </div>
        </Header>
        <Content>
          <Outlet />
        </Content>
        <Footer className="hn-picc-body-footer">
          安徽阡陌网络科技有限公司 ©2022 Created by Qianmo
        </Footer>
      </Layout>

      {
        // 普通用户不渲染该节点
        isOrdinaryUser ? null : (
          <Drawer
            placement="right"
            closable={false}
            open={openDrawer}
            bodyStyle={{ padding: 0 }}
            onClose={handleCloseDrawer}
            getContainer={document.body}
          >
            <Tabs
              defaultActiveKey="1"
              tabBarStyle={{ padding: "0 20px" }}
              items={renderDrawerContent}
            />
          </Drawer>
        )
      }
    </Layout>
  );
};

export default MainLayout;
