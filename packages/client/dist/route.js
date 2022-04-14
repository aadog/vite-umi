import React, { useContext, useEffect, useState } from "react";
import { UmiAppContext } from "./UmiAppContext";
import { useAccess } from "./access";
import { RouteContext } from "./RouteContext";
import { BrowserRouter, HashRouter, MemoryRouter, Navigate } from "react-router-dom";
const getWrapRoutePropsElement = async (props, umiAppContext) => {
    let struct = {
        access: [],
        isValidElement: false,
        element: "",
        meta: {},
        isElementType: false,
    };
    //如果不是组件
    if (typeof props.element == "string") {
        struct.isValidElement = false;
        struct.element = props.element;
        if (typeof props.access == "string") {
            struct.access?.push(props.access);
        }
        else if (typeof props.access == "object" && props.access.length > 0) {
            struct.access?.push(...props.access);
        }
        struct.getInitialPropsSync = props.getInitialPropsSync;
        if (struct.getInitialPropsSync == undefined) {
            struct.getInitialPropsSync = umiAppContext.initialPropsSync;
        }
        struct.meta = {
            ...props.meta
        };
        return struct;
    }
    if (typeof props.element == "function") {
        //组件类型
        struct.isValidElement = true;
        struct.element = React.createElement(props.element);
        struct.isElementType = true;
    }
    // @ts-ignore
    if (props.element._payload?._status) { //是lazy组件类型
        // console.log("lazy异步组件类型")
        struct.isElementType = true;
        const el = React.createElement(props.element);
        // @ts-ignore
        if (el.type._payload?._status == -1) {
            // @ts-ignore
            const load = (await (await el.type._payload?._result)()).default;
            struct.element = load;
            struct.isValidElement = true;
            // @ts-ignore
        }
        else if (el.type._payload?._status == 1) {
            // @ts-ignore
            const load = (await el.type._payload?._result);
            struct.element = load;
            struct.isValidElement = true;
        }
        // @ts-ignore
    }
    else if (props.element?.type?._payload?._status != undefined) { //是lazy组件
        // console.log("lazy异步组件")
        const el = props.element;
        // @ts-ignore
        if (el.type._payload?._status == -1) {
            // @ts-ignore
            const load = (await (await el.type._payload?._result)()).default;
            struct.element = load;
            struct.isValidElement = true;
            // @ts-ignore
        }
        else if (el.type._payload?._status == 1) {
            // @ts-ignore
            const load = (await el.type._payload?._result);
            struct.element = load;
            struct.isValidElement = true;
        }
    }
    else {
        struct.element = props.element;
        struct.isValidElement = true;
    }
    if (!struct.element) {
        throw Error(`路由解析element失败,path:${props.path}`);
    }
    if (typeof props?.access == "string") {
        struct.access?.push(props.access);
    }
    else if (typeof props.access == "object" && props.access.length > 0) {
        struct.access?.push(...props.access);
    }
    // @ts-ignore
    struct.getInitialPropsSync = props.getInitialProps;
    if (struct.getInitialPropsSync == undefined) {
        struct.getInitialPropsSync = umiAppContext.initialPropsSync;
    }
    struct.meta = {
        // @ts-ignore
        ...struct.element?.meta,
        ...props.meta,
    };
    // @ts-ignore
    struct.getInitialProps = struct.element?.getInitialProps || struct.element?.type?.getInitialProps;
    // @ts-ignore
    const access = struct.element?.access || struct.element?.type?.access || props?.access;
    if (typeof access == "string") {
        struct.access?.push(access);
    }
    else if (typeof access == "object" && access.length > 0) {
        struct.access?.push(...access);
    }
    return struct;
};
// @ts-ignore
const WrapRoute = (props) => {
    const umiAppContext = useContext(UmiAppContext);
    const routeContext = useContext(RouteContext);
    const access = useAccess();
    const [elState, setElState] = useState();
    const [authState, setAuthState] = useState(undefined);
    const [initialPropsState, setInitialPropsState] = useState(undefined);
    useEffect(() => {
        let _isUnMound = false;
        getWrapRoutePropsElement(props, umiAppContext).then((el) => {
            if (!_isUnMound) {
                setElState(el);
            }
            // @ts-ignore
            if (access && el.access && !umiAppContext.appData.umiConfig.skipAccess && routeContext.route?.props?.skipAccess != true) {
                const allows = [];
                let forbid = undefined;
                if (typeof el.access == 'string') {
                    if (access[el.access] != true) {
                        forbid = el.access;
                        if (!_isUnMound) {
                            setAuthState({ auth: false, allows: allows, forbid: forbid });
                        }
                        return;
                    }
                    allows.push(el.access);
                }
                else if ((typeof el.access == "object") && el.access.length != undefined) {
                    for (const a of el.access) {
                        if (access[a] != true) {
                            forbid = el.access;
                            forbid = a;
                            if (!_isUnMound) {
                                setAuthState({ auth: false, allows: allows, forbid: forbid });
                            }
                            return;
                        }
                        allows.push(a);
                    }
                }
                if (!_isUnMound) {
                    setAuthState({ auth: true, allows: el.access, forbid: forbid });
                }
            }
            else {
                if (!_isUnMound) {
                    setAuthState({ auth: true, allows: el.access });
                }
            }
            if (el.getInitialProps) {
                if (typeof el.getInitialProps == "function") {
                    const result = el.getInitialProps();
                    if (result instanceof Promise) {
                        result.then((ld) => {
                            if (!_isUnMound) {
                                setInitialPropsState(ld);
                            }
                        });
                    }
                    else {
                        if (!_isUnMound) {
                            setInitialPropsState(result);
                        }
                    }
                }
                else {
                    if (!_isUnMound) {
                        setInitialPropsState(el.getInitialProps);
                    }
                }
            }
            else {
                if (!_isUnMound) {
                    setInitialPropsState({});
                }
            }
        });
        /*
        (async () => {
            const el = await getWrapRoutePropsElement(props, umiAppContext)

        })()
        */
        return () => {
            _isUnMound = true;
        };
        // @ts-ignore
    }, [routeContext.route?.props?.skipAccess]);
    if (authState == undefined) {
        return umiAppContext.loading;
    }
    else if (authState.auth == false) {
        return React.cloneElement(umiAppContext.noAccess, authState);
    }
    else if (!elState?.isValidElement) {
        return props.element;
    }
    else if (elState.getInitialPropsSync && initialPropsState == undefined) {
        return umiAppContext.loading;
    }
    const newProps = {
        access: elState.access,
        ...initialPropsState,
        path: props.path,
        getInitialPropsSync: elState.getInitialPropsSync,
        meta: elState.meta,
        initialedProps: initialPropsState != undefined,
        auth: authState,
    };
    let el;
    if (elState.isElementType) {
        // @ts-ignore
        el = React.createElement(props.element, { ...newProps, });
    }
    else {
        el = React.cloneElement(props.element, newProps);
    }
    return el;
};
function transformRoute(route) {
    if (route.redirect) {
        route.element = React.createElement(Navigate, { to: route.redirect });
    }
    else if (route.element) {
        // @ts-ignore
        route.access = route.element.access || route.access;
        // @ts-ignore
        route.meta = route.element.meta || route.meta;
        route.getInitialPropsSync = route.getInitialPropsSync;
        route.element = (React.createElement(WrapRoute, { ...route, key: route.path }, route.element));
    }
    if (route.children) {
        for (let i = 0; i < route.children.length; i++) {
            transformRoute(route.children[i]);
        }
    }
}
export function transformRoutes(umiConfig) {
    const routes = [];
    umiConfig.routes?.map((item) => {
        transformRoute(item);
        routes.push({
            path: item.path,
            // @ts-ignore
            element: item.element,
            caseSensitive: item.caseSensitive,
            index: item.index,
            // @ts-ignore
            children: item.children,
        });
    });
    return routes;
}
export const DynamicRouter = (props) => {
    if (props.type == "memory") {
        return React.createElement(MemoryRouter, { basename: props.basename, children: props.children });
    }
    if (props.type == "hash") {
        return React.createElement(HashRouter, { basename: props.basename, children: props.children });
    }
    return React.createElement(BrowserRouter, { basename: props.basename, children: props.children });
};
//# sourceMappingURL=route.js.map