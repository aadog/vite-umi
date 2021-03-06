// @ts-nocheck
import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from 'axios';
import useUmiRequest, { UseRequestProvider } from '@ahooksjs/use-request';
import { message, notification } from 'antd';
import 'antd/es/message/style/index.css'
import 'antd/es/notification/style/index.css'
import {
    BaseOptions,
    BasePaginatedOptions,
    BaseResult,
    CombineService,
    LoadMoreFormatReturn,
    LoadMoreOptions,
    LoadMoreOptionsWithFormat,
    LoadMoreParams,
    LoadMoreResult,
    OptionsWithFormat,
    PaginatedFormatReturn,
    PaginatedOptionsWithFormat,
    PaginatedParams,
    PaginatedResult,
} from '@ahooksjs/use-request/es/types';
import {useAppData} from "./appData";



type ResultWithData< T = any > = { data?: T; [key: string]: any };
function useRequest<
    R = any,
    P extends any[] = any,
    U = any,
    UU extends U = any,
    >(
    service: CombineService<R, P>,
    options: OptionsWithFormat<R, P, U, UU>,
): BaseResult<U, P>;
function useRequest<R extends ResultWithData = any, P extends any[] = any>(
    service: CombineService<R, P>,
    options?: BaseOptions<R['data'], P>,
): BaseResult<R['data'], P>;
function useRequest<R extends LoadMoreFormatReturn = any, RR = any>(
    service: CombineService<RR, LoadMoreParams<R>>,
    options: LoadMoreOptionsWithFormat<R, RR>,
): LoadMoreResult<R>;
function useRequest<
    R extends ResultWithData<LoadMoreFormatReturn | any> = any,
    RR extends R = any,
    >(
    service: CombineService<R, LoadMoreParams<R['data']>>,
    options: LoadMoreOptions<RR['data']>,
): LoadMoreResult<R['data']>;
function useRequest<R = any, Item = any, U extends Item = any>(
    service: CombineService<R, PaginatedParams>,
    options: PaginatedOptionsWithFormat<R, Item, U>,
): PaginatedResult<Item>;
function useRequest<Item = any, U extends Item = any>(
    service: CombineService<
        ResultWithData<PaginatedFormatReturn<Item>>,
        PaginatedParams
        >,
    options: BasePaginatedOptions<U>,
): PaginatedResult<Item>;
function useRequest(service: any, options: any = {}) {
    return useUmiRequest(service, {
        formatResult: result => result?.data,
        requestMethod: (requestOptions: any) => {
            if (typeof requestOptions === 'string') {
                return request(requestOptions);
            }
            if (typeof requestOptions === 'object') {
                const { url, ...rest } = requestOptions;
                return request(url, rest);
            }
            throw new Error('request options error');
        },
        ...options,
    });
}
export interface RequestConfig extends AxiosRequestConfig {
    errorConfig?: {
        errorPage?: string;
        adaptor?: IAdaptor; // adaptor ?????????????????????????????????????????????????????? errorInfo
        errorHandler?: IErrorHandler;
        defaultCodeErrorMessage?: string;
        defaultNoneResponseErrorMessage?: string;
        defaultRequestErrorMessage?: string;
    };
    formatResultAdaptor?: IFormatResultAdaptor;
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
// resData ???????????? response.data, response ?????? axios ???????????????
interface IAdaptor {
    (resData: any, response: AxiosResponse): IErrorInfo;
}
export interface RequestError extends Error {
    data?: any;
    info?: IErrorInfo;
}
interface IRequest {
    (
        url: string,
        opts: AxiosRequestConfig & { skipErrorHandler?: boolean },
    ): Promise<AxiosResponse<any, any>>;
}
interface IErrorHandler {
    (error: RequestError, opts: AxiosRequestConfig & { skipErrorHandler?: boolean }, config: RequestConfig): void;
}
interface IFormatResultAdaptor {
    (res: AxiosResponse): any;
}
const defaultErrorHandler: IErrorHandler = (error, opts, config) => {
    if (opts?.skipErrorHandler) throw error;
    const { errorConfig } = config;
    if (error.response) {
        // ?????????????????????????????????????????????????????????????????????????????? 2xx ????????? ?????? ???????????????success?????????false ????????????????????????
        let errorInfo: IErrorInfo | undefined;
        if (error.name == 'Error') {
            // ??????????????????????????????
            message.error(
                errorConfig?.defaultCodeErrorMessage || '?????????????????????,?????????.',
                1,
                () => {
                }
            );
            return
        }
        // ?????????????????????
        if(error.name === 'ResponseError'){
            const adaptor: IAdaptor =
                errorConfig?.adaptor || ((errorData) => errorData);
            errorInfo = adaptor(error.response.data, error.response);
            error.info = errorInfo;
            error.data = error.response.data;
        }
        errorInfo = error.info;
        if (errorInfo) {
            const { errorMessage, errorCode } = errorInfo;
            switch (errorInfo.showType) {
                case ErrorShowType.SILENT:
                    // do nothong
                    break;
                case ErrorShowType.WARN_MESSAGE:
                    message.warn(errorMessage);
                    break;
                case ErrorShowType.ERROR_MESSAGE:
                    message.error(errorMessage);
                    break;
                case ErrorShowType.NOTIFICATION:
                    notification.open({ description: errorMessage, message: errorCode });
                    break;
                case ErrorShowType.REDIRECT:
                    // TODO: redirect
                    window.location.href=error.data
                    break;
                default:
                    message.error(errorMessage);
            }
        }
    } else if (error.request) {
        // ????????????????????????????????????????????????
        // \`error.request\` ?????????????????? XMLHttpRequest ????????????
        // ??????node.js?????? http.ClientRequest ?????????
        message.error(
            errorConfig?.defaultNoneResponseErrorMessage ||
            'None response! Please retry.',
        );
    } else {
        // ??????????????????????????????
        message.error(
            errorConfig?.defaultRequestErrorMessage || 'Request error, please retry.',
        );
    }
    throw error;
};
let requestInstance: AxiosInstance;
let config: RequestConfig;
const getConfig = (): RequestConfig => {
    if (config) return config;
    config=useAppData().umiConfig.request
    return config;
};
const getRequestInstance = (): AxiosInstance => {
    if (requestInstance) return requestInstance;
    const config = getConfig();
    requestInstance = axios.create(config);
    // ?????????????????? success ??? false ?????????????????? error ?????? errorHandler ?????????
    requestInstance.interceptors.response.use((response)=>{
        const {data} = response;
        const adaptor = config?.errorConfig?.adaptor || ((resData) => resData);
        const errorInfo = adaptor(data,response);
        if(errorInfo.success === false){
            const error: RequestError = new Error(errorInfo.errorMessage);
            error.name = 'BizError';
            error.data = data;
            error.info = errorInfo;
            error.response = response;
            throw error;
        }
        return response;
    })
    return requestInstance;
};
const request: IRequest = (url, opts) => {
    const requestInstance = getRequestInstance();
    const config = getConfig();
    return new Promise((resolve, reject) => {
        requestInstance
            .request({ ...opts, url })
            .then((res) => {
                const formatResultAdaptor =
                    config?.formatResultAdaptor || ((res) => res.data);
                resolve(formatResultAdaptor(res));
            })
            .catch((error) => {
                try {
                    const handler =
                        config.errorConfig?.errorHandler || defaultErrorHandler;
                    handler(error, opts, config);
                } catch (e) {
                    reject(e);
                }
            });
    });
};
export {
    useRequest,
    UseRequestProvider,
    request,
    getRequestInstance,
};
export type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
};
