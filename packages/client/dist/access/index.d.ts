import React from 'react';
import type { IRoute } from 'umi';
export declare function useAccess<T = Record<string, any>>(): T;
export interface AccessProps {
    accessible: boolean;
    fallback?: React.ReactNode;
}
export declare const Access: React.FC<AccessProps>;
export declare const useAccessMarkedRoutes: (routes: IRoute[]) => IRoute[];
