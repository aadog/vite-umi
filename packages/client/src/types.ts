import {AxiosRequestConfig, AxiosResponse} from "axios";
import * as React from "react";


export interface IUmiConfig{
    //默认 'browser'
    type?: ('browser'|'hash'|'memory')
    //默认 "/"
    basename?:string
    //默认 {}
    request?:RequestConfig
    //初始化状态,支持函数或异步函数
    getInitialState?:Function
    //跳过权限处理,自己手动处理权限
    skipAccess?:boolean
    //权限设置
    access?:(initialState?:Record<string, any>)=>Record<string, any>
    //默认 []
    routes?:IRoute[]
}
export interface IAppData{
    pluginName:string
    pluginVersion:string
    projectName:string
    umiConfig:IUmiConfig
}
export interface IRoute{
    //是否区分大小写
    caseSensitive?: boolean;
    children?: IRoute[];
    index?: boolean;
    name?: string,
    path?: string;
    element?: React.ReactElement|string|Function;
    //同步,默认true
    getInitialPropsSync?:boolean|undefined
    //加载组件
    loading?:React.ReactElement|string
    //要跳转的地址
    redirect?: string
    skipAccess?:boolean
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
export enum ErrorShowType {
    SILENT = 0,
    WARN_MESSAGE = 1,
    ERROR_MESSAGE = 2,
    NOTIFICATION = 3,
    REDIRECT = 9,
}
export interface IErrorInfo {
    success: boolean;
    data?: any;
    errorCode?: string;
    errorMessage?: string;
    showType?: ErrorShowType;
    traceId?: string;
    host?: string;
    [key: string]: any;
}
// resData 其实就是 response.data, response 则是 axios 的响应对象
export interface IAdaptor {
    (resData: any, response: AxiosResponse): IErrorInfo;
}
export interface IErrorHandler {
    (error: RequestError, opts: AxiosRequestConfig & { skipErrorHandler?: boolean }, config: RequestConfig): void;
}
export interface RequestError extends Error {
    data?: any;
    info?: IErrorInfo;
}
export interface IFormatResultAdaptor {
    (res: AxiosResponse): any;
}
export interface RequestConfig extends AxiosRequestConfig {
    errorConfig?: {
        errorPage?: string;
        adaptor?: IAdaptor; // adaptor 用以用户将不满足接口的后端数据修改成 errorInfo
        errorHandler?: IErrorHandler;
        defaultCodeErrorMessage?: string;
        defaultNoneResponseErrorMessage?: string;
        defaultRequestErrorMessage?: string;
    };
    formatResultAdaptor?: IFormatResultAdaptor;
}


export type PropsWithUmi<P> = P & {
    path?:string
    access?:string[]
    getInitialPropsSync?:boolean
    initialedProps?:boolean
    meta?:{
        title?:string
        [name:string]:any
    },
    auth?:{
        auth:boolean
        allows:string[]
        forbid?:string
    }
    [name:string]:any
};
export interface FunctionComponent<P = {}> {
    (props: PropsWithUmi<P>, context?: any): React.ReactElement<any, any> | null;
    propTypes?: React.WeakValidationMap<P> | undefined;
    contextTypes?: React.ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
    access?:string|string[]
    //元数据
    meta?:{
        //标题
        title?: string
        [name:string]:any
    }
    getInitialProps?:Function|Record<string,any>
    getInitialPropsSync?:boolean
    loading?:React.ReactElement|string
    [name:string]:any
}

export type FC<P = {}> = FunctionComponent<P>;
