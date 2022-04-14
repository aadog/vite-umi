import React from 'react';
export declare function Provider(props: {
    models: Record<string, any>;
    children: React.ReactNode;
}): JSX.Element;
export declare function useModel(namespace: string, selector?: any): any;
