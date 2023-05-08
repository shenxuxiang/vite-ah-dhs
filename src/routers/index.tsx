/**
 * 请不要再这里配置业务路由和菜单，配置路由请移步 ./routesMap.tsx，
 * @variable { computeMenuItems } 生成菜单项的方法，
 * @variable { menuItems }        生成菜单项，在 @/layout/mainLayout.tsx 中被使用，
 * @variable { Router }           路由项，根据 ./routesMap.tsx 的配置生成。
 */
import React from "react";
import { useRoutes } from "react-router-dom";
import routesMap from "@/routers/routesMap";
import MainLayout from "@/layout/MainLayout";
import Login from "@/pages/login";
export type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode | null;
  children?: MenuItem[];
};

export function computeMenuItems(
  permissions = new Set<string>(),
  routes: any[] = routesMap
) {
  const items = [] as MenuItem[];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const { label, icon, path, children } = route;
    if (!label) continue;
    if (!permissions.has(path)) continue;
    const item: any = { label, key: path, icon };
    if (children?.length > 0)
      item.children = computeMenuItems(permissions, children);
    items.push(item);
  }
  return items;
}

export default function Router() {
  return useRoutes([
    {
      path: "/login/:status?",
      element: <Login />,
    },
    {
      path: "/",
      element: <MainLayout />,
      children: routesMap,
    },
  ]);
}
