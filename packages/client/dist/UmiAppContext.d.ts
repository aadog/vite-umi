import React from "react";
import { RouteObject } from "react-router-dom";
import { IAppData } from "./types";
export declare const InitialStateError: React.FC<any>;
export interface IUmiAppContext {
    appData?: IAppData;
    loading: React.ReactElement | null;
    notfound: React.ReactElement | null;
    initialStateLoading: React.ReactElement | null;
    initialStateError: React.ReactElement | null;
    initialStateSync: boolean;
    initialPropsSync: boolean;
    noAccess: React.ReactElement;
    routes?: RouteObject[];
    [name: string]: any;
}
export declare const UmiAppContext: React.Context<IUmiAppContext>;
