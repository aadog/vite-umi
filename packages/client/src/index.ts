
import {IRoute, IUmiConfig} from "./types";


export function defineUmi(umiConfig:IUmiConfig):IUmiConfig{
    return umiConfig
}
export function defineRoute(umiRoute:IRoute):IRoute{
    return umiRoute
}

export {PropsWithUmi,FunctionComponent,FC,RequestConfig,IFormatResultAdaptor,RequestError,IErrorHandler,IAdaptor,IAppData,IUmiConfig,IRoute,ErrorShowType,IErrorInfo,} from './types'

export { UmiAppContext } from "./UmiAppContext";
export { RouteContext } from "./RouteContext";
export {AccessContext} from './access/context'
export { transformRoutes,DynamicRouter} from  './route'
export type {DynamicRouterProps} from './route'

//model导出
export {Provider as ModelProvider,useModel} from './model/index'
//Access导出
export {useAccess,Access,useAccessMarkedRoutes} from './access'
//路由导出
export {Navigate,createSearchParams, Link, matchPath, matchRoutes, NavLink, Outlet, useLocation, useMatch, useNavigate, useOutlet, useParams, useResolvedPath, useRoutes, useSearchParams,BrowserRouter,Routes,Route} from 'react-router-dom';
