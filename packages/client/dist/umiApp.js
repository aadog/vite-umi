import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { HashRouter, MemoryRouter, BrowserRouter, useRoutes, } from "react-router-dom";
import { useAppData, transformRoutes } from "./appData";
import { Result } from "antd";
import { ModelProviderWrapper } from './model/runtime';
import { useModel } from "./model";
import { Provider as AccessProvider } from './access/runtime';
import { UmiAppContext } from "./UmiAppContext";
import { RouteContext } from "./RouteContext";
function findFullRoute(routepage) {
    if (routepage.props.value.outlet == null) {
        return routepage.props.children;
    }
    return findFullRoute(routepage.props.value.outlet);
}
const RenderElement = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    const routePage = useRoutes(umiAppContext.routes || []);
    if (!routePage) {
        return umiAppContext.notfound;
    }
    const fullRoute = findFullRoute(routePage);
    return (_jsx(RouteContext.Provider, { value: { "route": fullRoute }, children: _jsx(React.Suspense, { fallback: umiAppContext.loading, children: routePage }) }));
};
export const InitialStateError = (props) => {
    const initialStateModel = useModel("@@initialState");
    return _jsx(Result, { status: 'error', extra: `App初始化失败:${initialStateModel.error}` });
};
export const UmiApp = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    umiAppContext.initialStateSync = props.initialStateSync == false ? false : umiAppContext.initialStateSync;
    umiAppContext.initialPropsSync = props.initialPropsSync == false ? false : umiAppContext.initialPropsSync;
    umiAppContext.initialStateLoading = props.initialStateLoading || umiAppContext.initialStateLoading;
    umiAppContext.initialStateError = props.initialStateError || umiAppContext.initialStateError;
    umiAppContext.loading = props.loading || umiAppContext.loading;
    umiAppContext.notfound = props.loading || umiAppContext.notfound;
    umiAppContext.routes = transformRoutes(useAppData().umiConfig);
    return (_jsx(UmiAppContext.Provider, { value: umiAppContext, children: _jsx(ModelProviderWrapper, { children: _jsx(AccessProvider, { children: _jsx(UmiAppEntry, {}) }) }) }));
};
export const UmiAppEntry = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    if (umiAppContext.initialStateSync) {
        const initialStateModel = useModel("@@initialState");
        if (initialStateModel.loading) {
            return umiAppContext.initialStateLoading;
        }
        if (initialStateModel.error) {
            return umiAppContext.initialStateError;
        }
    }
    return (_jsx(DynamicRouter, { type: useAppData().umiConfig.type, basename: useAppData().umiConfig.basename, children: _jsx(RenderElement, {}) }));
};
const DynamicRouter = (props) => {
    if (props.type == "memory") {
        return _jsx(MemoryRouter, { basename: props.basename, children: props.children });
    }
    if (props.type == "hash") {
        return _jsx(HashRouter, { basename: props.basename, children: props.children });
    }
    return _jsx(BrowserRouter, { basename: props.basename, children: props.children });
};
//# sourceMappingURL=umiApp.js.map