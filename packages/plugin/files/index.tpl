export {useAppData} from "./appData"
export type {IAppData,IRoute,IUmiConfig,} from '@vite-umi/client'
export type {FC,PropsWithUmi,FunctionComponent} from '@vite-umi/client'
export {UmiApp} from './UmiApp'



//model导出
export {ModelProvider,useModel} from '@vite-umi/client'
//Access导出
export {useAccess,Access,useAccessMarkedRoutes} from '@vite-umi/client'
//request导出
export { useRequest, UseRequestProvider, request } from './request'
//路由导出
export {Navigate,createSearchParams, Link, matchPath, matchRoutes, NavLink, Outlet, useLocation, useMatch, useNavigate, useOutlet, useParams, useResolvedPath, useRoutes, useSearchParams,BrowserRouter,Routes,Route} from '@vite-umi/client';
