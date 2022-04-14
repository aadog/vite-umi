export function defineUmi(umiConfig) {
    return umiConfig;
}
export function defineRoute(umiRoute) {
    return umiRoute;
}
export { ErrorShowType, } from './types';
export { UmiAppContext } from "./UmiAppContext";
export { RouteContext } from "./RouteContext";
export { AccessContext } from './access/context';
export { transformRoutes, DynamicRouter } from './route';
//model导出
export { Provider as ModelProvider, useModel } from './model/index';
//Access导出
export { useAccess, Access, useAccessMarkedRoutes } from './access';
//路由导出
export { Navigate, createSearchParams, Link, matchPath, matchRoutes, NavLink, Outlet, useLocation, useMatch, useNavigate, useOutlet, useParams, useResolvedPath, useRoutes, useSearchParams, BrowserRouter, Routes, Route } from 'react-router-dom';
//# sourceMappingURL=index.js.map