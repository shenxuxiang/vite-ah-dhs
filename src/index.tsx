import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Router from "@/routers";



import "./index.less";
// import '@/mock/mock';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ConfigProvider locale={zhCN}>
    <HashRouter>
      <Router />
    </HashRouter>
  </ConfigProvider>
);
