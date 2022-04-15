import React from "react";
import { IRoute, IUmiConfig, IUmiRoute } from "./types";
import { RouteObject } from "react-router-dom";
export declare function transformRoutes(umiConfig: IUmiConfig): RouteObject[];
export declare function routeToUmiRoute(f: IRoute): IUmiRoute;
export declare type DynamicRouterProps = {
    type?: string;
    children: React.ReactNode;
    basename?: string;
};
export declare const DynamicRouter: React.FC<DynamicRouterProps>;
