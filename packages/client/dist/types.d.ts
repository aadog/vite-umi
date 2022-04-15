import { AxiosRequestConfig, AxiosResponse } from "axios";
import * as React from "react";
export interface IUmiConfig {
    type?: ('browser' | 'hash' | 'memory');
    basename?: string;
    request?: RequestConfig;
    getInitialState?: Function;
    skipAccess?: boolean;
    access?: (initialState?: Record<string, any>) => Record<string, any>;
    routes?: IRoute[];
}
export interface IAppData {
    pluginName: string;
    pluginVersion: string;
    projectName: string;
    umiConfig: IUmiConfig;
}
export interface IUmiRoute {
    name?: string;
    path?: string;
    icon?: string;
    redirect?: string;
    access?: string;
    [name: string]: any;
}
export interface IRoute {
    caseSensitive?: boolean;
    children?: IRoute[];
    index?: boolean;
    name?: string;
    path?: string;
    element?: React.ReactElement | string | Function;
    getInitialPropsSync?: boolean | undefined;
    loading?: React.ReactElement | string;
    redirect?: string;
    skipAccess?: boolean;
    access?: string | string[];
    meta?: {
        title?: string;
        [name: string]: any;
    };
    [name: string]: any;
}
export declare enum ErrorShowType {
    SILENT = 0,
    WARN_MESSAGE = 1,
    ERROR_MESSAGE = 2,
    NOTIFICATION = 3,
    REDIRECT = 9
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
export interface IAdaptor {
    (resData: any, response: AxiosResponse): IErrorInfo;
}
export interface IErrorHandler {
    (error: RequestError, opts: AxiosRequestConfig & {
        skipErrorHandler?: boolean;
    }, config: RequestConfig): void;
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
        adaptor?: IAdaptor;
        errorHandler?: IErrorHandler;
        defaultCodeErrorMessage?: string;
        defaultNoneResponseErrorMessage?: string;
        defaultRequestErrorMessage?: string;
    };
    formatResultAdaptor?: IFormatResultAdaptor;
}
export declare type PropsWithUmi<P> = P & {
    path?: string;
    access?: string[];
    getInitialPropsSync?: boolean;
    initialedProps?: boolean;
    meta?: {
        title?: string;
        [name: string]: any;
    };
    auth?: {
        auth: boolean;
        allows: string[];
        forbid?: string;
    };
    [name: string]: any;
};
export interface FunctionComponent<P = {}> {
    (props: PropsWithUmi<P>, context?: any): React.ReactElement<any, any> | null;
    propTypes?: React.WeakValidationMap<P> | undefined;
    contextTypes?: React.ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
    access?: string | string[];
    meta?: {
        title?: string;
        [name: string]: any;
    };
    getInitialProps?: Function | Record<string, any>;
    getInitialPropsSync?: boolean;
    loading?: React.ReactElement | string;
    [name: string]: any;
}
export declare type FC<P = {}> = FunctionComponent<P>;
