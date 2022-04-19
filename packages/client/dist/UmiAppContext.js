import React from "react";
import { Result, Spin } from "antd";
import { useModel } from "./model/index";
export const InitialStateError = (props) => {
    const initialStateModel = useModel("@@initialState");
    return React.createElement(Result, { status: 'error', extra: `App初始化失败:${initialStateModel.error}` });
};
export const UmiAppContext = React.createContext({
    initialStateLoading: React.createElement(Spin, { size: "large", tip: React.createElement("div", { style: { marginTop: 10 } }, "\u7CFB\u7EDF\u6B63\u5728\u521D\u59CB\u5316..."), style: { width: "100%", height: "100%", top: "30%", position: 'absolute' } }),
    initialStateError: React.createElement(InitialStateError, null),
    initialStateSync: true,
    initialPropsSync: true,
    loading: React.createElement(React.Fragment, null),
    notfound: React.createElement(Result, { status: "404", extra: "找不到页面" }),
    noAccess: React.createElement(Result, { status: "403", extra: "没有权限访问" }),
});
//# sourceMappingURL=UmiAppContext.js.map