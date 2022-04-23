import React, { useContext, useEffect, useRef, useState } from "react";
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
    if (typeof props.element == "string") {
        struct.isValidElement = false;
        struct.element = props.element;
    }
    else if (typeof props.element == "function") {
        //组件类型
        struct.isValidElement = true;
        struct.element = React.createElement(props.element);
        struct.isElementType = true;
        // @ts-ignore
    }
    else if (props.element._payload?._status) { //是lazy组件类型
        // console.log("lazy异步组件类型")
        struct.isElementType = true;
        // @ts-ignore
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
            const load = (await el.type._payload?._result.default);
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
    struct.access = [];
    // @ts-ignore
    if (struct.element?.access) {
        const el = struct.element;
        if (typeof el.access == "string") {
            struct.access.push(el.access);
        }
        else if (typeof el.access == "object" && el.access.length > 0) {
            struct.access.push(...el.access);
        }
    }
    else if (struct.element?.type?.access) {
        const el = struct.element?.type;
        if (typeof el.access == "string") {
            struct.access.push(el.access);
        }
        else if (typeof el.access == "object" && el.access.length > 0) {
            struct.access.push(...el.access);
        }
    }
    else if (typeof props.access == "string") {
        struct.access.push(props.access);
    }
    else if (typeof props.access == "object" && props.access.length > 0) {
        struct.access.push(...props.access);
    }
    struct.getInitialPropsSync = true;
    if (struct.element.getInitialPropsSync != undefined) {
        const el = struct.element;
        struct.getInitialPropsSync = el.getInitialPropsSync;
    }
    else if (struct.element.type?.getInitialPropsSync != undefined) {
        const el = struct.element.type;
        struct.getInitialPropsSync = el.getInitialPropsSync;
    }
    else if (props.getInitialPropsSync != undefined) {
        struct.getInitialPropsSync = props.getInitialPropsSync;
    }
    else if (umiAppContext.initialPropsSync != undefined) {
        struct.getInitialPropsSync = umiAppContext.initialPropsSync;
    }
    struct.meta = {
        ...props.meta,
        ...struct.element.type?.meta,
        ...struct.element.meta,
    };
    if (struct.element.getInitialProps) {
        const el = struct.element;
        struct.getInitialProps = el.getInitialProps;
    }
    else if (struct.element.type?.getInitialProps) {
        const el = struct.element.type;
        struct.getInitialProps = el.getInitialProps;
    }
    struct.loading = umiAppContext.loading;
    if (struct.element.loading) {
        const el = struct.element;
        struct.loading = el.loading;
    }
    else if (struct.element.type?.loading) {
        const el = struct.element.type;
        struct.loading = el.loading;
    }
    else if (props.loading) {
        struct.loading = props.loading;
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
    const _isUnMound = useRef(false);
    useEffect(() => {
        return () => {
            _isUnMound.current = true;
        };
    });
    useEffect(() => {
        const fn = async () => {
            const el = await getWrapRoutePropsElement(props, umiAppContext);
            if (!_isUnMound.current) {
                setElState(el);
            }
            // @ts-ignore
            if (access && el.access && !umiAppContext.appData.umiConfig.skipAccess && routeContext.route?.props?.skipAccess != true) {
                const allows = [];
                let forbid = undefined;
                if (typeof el.access == 'string') {
                    if (access[el.access] != true) {
                        forbid = el.access;
                        if (!_isUnMound.current) {
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
                            if (!_isUnMound.current) {
                                setAuthState({ auth: false, allows: allows, forbid: forbid });
                            }
                            return;
                        }
                        allows.push(a);
                    }
                }
                if (!_isUnMound.current) {
                    setAuthState({ auth: true, allows: el.access, forbid: forbid });
                }
            }
            else {
                if (!_isUnMound.current) {
                    setAuthState({ auth: true, allows: el.access });
                }
            }
            if (el.getInitialProps) {
                if (typeof el.getInitialProps == "function") {
                    const result = el.getInitialProps(el);
                    if (result instanceof Promise) {
                        result.then((ld) => {
                            if (!_isUnMound.current) {
                                setInitialPropsState(ld);
                            }
                        });
                    }
                    else {
                        if (!_isUnMound.current) {
                            setInitialPropsState(result);
                        }
                    }
                }
                else {
                    if (!_isUnMound.current) {
                        setInitialPropsState(el.getInitialProps);
                    }
                }
            }
            else {
                if (!_isUnMound.current) {
                    setInitialPropsState({});
                }
            }
        };
        fn();
        return () => {
        };
        // @ts-ignore
    }, [routeContext.route?.props?.skipAccess]);
    if (authState == undefined) {
        return elState?.loading;
    }
    else if (authState.auth == false) {
        return React.cloneElement(umiAppContext.noAccess, authState);
    }
    else if (!elState?.isValidElement) {
        return props.element;
    }
    else if (elState.getInitialPropsSync && initialPropsState == undefined) {
        return elState?.loading;
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
export function routeToUmiRoute(f) {
    // @ts-ignore
    const r = { ...f };
    r.routes = [];
    f.children?.map((item) => {
        r.routes.push(routeToUmiRoute(item));
    });
    return r;
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