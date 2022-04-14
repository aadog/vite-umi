import React, {useContext, useEffect, useState} from "react";
import {IUmiAppContext, UmiAppContext} from "./UmiAppContext";
import {useAccess} from "./access";
import {RouteContext} from "./RouteContext";
import {IRoute, IUmiConfig} from "./types";
import {BrowserRouter, HashRouter, MemoryRouter, Navigate, RouteObject} from "react-router-dom";


type WrapRouteProps={
    //是否区分大小写
    caseSensitive?: boolean;
    index?: boolean;
    path?: string;
    element?: React.ReactElement|string|Function;
    //同步,默认true
    getInitialPropsSync?:boolean|undefined
    //加载组件
    loading?:React.ReactElement|string
    //权限
    access?: string|string[]
    //元数据
    meta?:{
        //标题
        title?: string
        [name:string]:any
    }
    [name:string]:any
}
const getWrapRoutePropsElement= async (props: WrapRouteProps, umiAppContext: IUmiAppContext) => {
    let struct: {
        access?: string[]
        element: React.ReactElement | string|any
        isValidElement: boolean
        isElementType:boolean
        //同步,默认true
        getInitialPropsSync?: boolean | undefined
        getInitialProps?:Function|object
        loading?:React.ReactElement|string
        meta: {
            //标题
            title?: string
            [name: string]: any
        }
    } = {
        access:[],
        isValidElement: false,
        element: "",
        meta: {},
        isElementType:false,
    }



    if (typeof props.element == "string") {
        struct.isValidElement = false
        struct.element = props.element as string
    }else if (typeof props.element == "function") {
        //组件类型
        struct.isValidElement = true
        struct.element = React.createElement(props.element as React.FC)
        struct.isElementType=true
        // @ts-ignore
    }else if (props.element._payload?._status) {//是lazy组件类型
        // console.log("lazy异步组件类型")
        struct.isElementType=true
        // @ts-ignore
        const el=React.createElement(props.element as React.ElementType)
        // @ts-ignore
        if (el.type._payload?._status == -1) {
            // @ts-ignore
            const load=(await (await el.type._payload?._result)()).default
            struct.element=load
            struct.isValidElement=true
            // @ts-ignore
        }else if(el.type._payload?._status==1){
            // @ts-ignore
            const load=(await el.type._payload?._result)
            struct.element=load
            struct.isValidElement=true
        }
        // @ts-ignore
    }else if (props.element?.type?._payload?._status != undefined) {  //是lazy组件
        // console.log("lazy异步组件")
        const el=props.element
        // @ts-ignore
        if (el.type._payload?._status == -1) {
            // @ts-ignore
            const load=(await (await el.type._payload?._result)()).default
            struct.element=load
            struct.isValidElement=true
            // @ts-ignore
        }else if(el.type._payload?._status==1){
            // @ts-ignore
            const load=(await el.type._payload?._result)
            struct.element=load
            struct.isValidElement=true
        }
    }else{
        struct.element=props.element as React.ReactElement
        struct.isValidElement=true
    }
    if(!struct.element){
        throw Error(`路由解析element失败,path:${props.path}`)
    }


    struct.access=[]
    // @ts-ignore
    if(struct.element?.access){
        const el:any=struct.element
        if (typeof el.access == "string") {
            struct.access.push(el.access)
        } else if (typeof el.access == "object" && el.access.length > 0) {
            struct.access.push(...el.access)
        }
    }else if(struct.element?.type?.access){
        const el:any=struct.element?.type
        if (typeof el.access == "string") {
            struct.access.push(el.access)
        } else if (typeof el.access == "object" && el.access.length > 0) {
            struct.access.push(...el.access)
        }
    }else if (typeof props.access == "string") {
        struct.access.push(props.access)
    } else if (typeof props.access == "object" && props.access.length > 0) {
        struct.access.push(...props.access)
    }




    struct.getInitialPropsSync=true
    if(struct.element.getInitialPropsSync!=undefined){
        const el=struct.element
        struct.getInitialPropsSync=el.getInitialPropsSync
    }else if(struct.element.type?.getInitialPropsSync!=undefined){
        const el=struct.element.type
        struct.getInitialPropsSync=el.getInitialPropsSync
    }else if(props.getInitialPropsSync!=undefined){
        struct.getInitialPropsSync = props.getInitialPropsSync
    }else if(umiAppContext.initialPropsSync!=undefined){
        struct.getInitialPropsSync = umiAppContext.initialPropsSync
    }


    struct.meta={
        ...props.meta,
        ...struct.element.type?.meta,
        ...struct.element.meta,
    }

    if(struct.element.getInitialProps){
        const el=struct.element
        struct.getInitialProps=el.getInitialProps
    }else if(struct.element.type?.getInitialProps){
        const el=struct.element.type
        struct.getInitialProps=el.getInitialProps
    }

    struct.loading=umiAppContext.loading
    if(struct.element.loading){
        const el=struct.element
        struct.loading=el.loading
    }else if(struct.element.type?.loading){
        const el=struct.element.type
        struct.loading=el.loading
    }else if(props.loading){
        struct.loading=props.loading
    }

    return struct
}

// @ts-ignore
const WrapRoute: React.FC<WrapRouteProps> = (props) => {
    const umiAppContext = useContext(UmiAppContext);
    const routeContext = useContext(RouteContext);
    const access = useAccess()
    const [elState, setElState] = useState<{
        access?: string[]
        element: React.ReactElement | string
        isValidElement: boolean
        isElementType:boolean
        //同步,默认true
        getInitialPropsSync?: boolean | undefined
        getInitialProps?:Function|object
        loading?:React.ReactElement|string
        meta: {
            //标题
            title?: string
            [name: string]: any
        }
    }>();
    const [authState, setAuthState] = useState<{
        auth: boolean
        allows?: string[]
        forbid?: string
    } | undefined>(undefined);
    const [initialPropsState, setInitialPropsState] = useState<Record<string, any>|undefined>(undefined);


    useEffect(() => {
        let _isUnMound=false
        getWrapRoutePropsElement(props, umiAppContext).then((el) => {
            if (!_isUnMound) {
                setElState(el)
            }

            // @ts-ignore
            if (access && el.access && !umiAppContext.appData.umiConfig.skipAccess && routeContext.route?.props?.skipAccess != true) {
                const allows: string[] = []
                let forbid = undefined
                if (typeof el.access == 'string') {
                    if (access[el.access as string] != true) {
                        forbid = el.access
                        if (!_isUnMound) {
                            setAuthState({auth: false, allows: allows, forbid: forbid})
                        }
                        return
                    }
                    allows.push(el.access)
                } else if ((typeof el.access == "object") && el.access.length != undefined) {
                    for (const a of el.access) {
                        if (access[a] != true) {
                            forbid = el.access
                            forbid = a
                            if (!_isUnMound) {
                                setAuthState({auth: false, allows: allows, forbid: forbid})
                            }
                            return
                        }
                        allows.push(a)
                    }
                }
                if (!_isUnMound) {
                    setAuthState({auth: true, allows: el.access, forbid: forbid})
                }
            } else {
                if (!_isUnMound) {
                    setAuthState({auth: true, allows: el.access})
                }
            }

            if (el.getInitialProps) {
                if (typeof el.getInitialProps == "function") {
                    const result = el.getInitialProps(el)
                    if (result instanceof Promise) {
                        result.then((ld)=>{
                            if (!_isUnMound) {
                                setInitialPropsState(ld)
                            }
                        })
                    } else {
                        if (!_isUnMound) {
                            setInitialPropsState(result)
                        }
                    }
                } else {
                    if (!_isUnMound) {

                        setInitialPropsState(el.getInitialProps)
                    }
                }
            } else {
                if (!_isUnMound) {
                    setInitialPropsState({})
                }
            }
        })
        return ()=>{
            _isUnMound=true
        }
        // @ts-ignore
    }, [routeContext.route?.props?.skipAccess])


    if (authState == undefined) {
        return elState?.loading
    } else if (authState.auth == false) {
        return React.cloneElement(umiAppContext.noAccess, authState)
    }else if(!elState?.isValidElement){
        return props.element
    }else if(elState.getInitialPropsSync&&initialPropsState==undefined){
        return elState?.loading
    }


    const newProps={
        access:elState.access,
        ...initialPropsState,
        path:props.path,
        getInitialPropsSync:elState.getInitialPropsSync,
        meta:elState.meta,
        initialedProps:initialPropsState!=undefined,
        auth:authState,
    }
    let el:React.ReactElement
    if(elState.isElementType){
        // @ts-ignore
        el=React.createElement(props.element as React.FunctionComponent,{...newProps,})
    }else{
        el=React.cloneElement(props.element as React.ReactElement,newProps)
    }
    return el
}
function transformRoute(route:IRoute){
    if(route.redirect){
        route.element=<Navigate to={route.redirect}></Navigate>
    }else if(route.element){
        route.element = (
            <WrapRoute {...route} key={route.path}>
                {route.element}
            </WrapRoute>
        )
    }
    if(route.children){
        for (let i = 0; i < route.children.length; i++) {
            transformRoute(route.children[i])
        }
    }
}
export function transformRoutes(umiConfig:IUmiConfig):RouteObject[]{
    const routes:RouteObject[]=[]
    umiConfig.routes?.map((item)=>{
        transformRoute(item)
        routes.push({
            path:item.path,
            // @ts-ignore
            element:item.element,
            caseSensitive:item.caseSensitive,
            index:item.index,
            // @ts-ignore
            children:item.children,
        })
    })
    return routes
}


export type DynamicRouterProps = {
    type?: string
    children: React.ReactNode
    basename?: string
}
export const DynamicRouter: React.FC<DynamicRouterProps> = (props) => {
    if (props.type == "memory") {
        return <MemoryRouter basename={props.basename} children={props.children}/>
    }
    if (props.type == "hash") {
        return <HashRouter basename={props.basename} children={props.children}/>
    }
    return <BrowserRouter basename={props.basename} children={props.children}/>
}
