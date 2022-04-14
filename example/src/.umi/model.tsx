import React from 'react';
import {ModelProvider} from "@vite-umi/client";

import model_0 from './models/@@initialState'

export const rawModels:Record<string, {
    namespace:string,
    model:typeof model_0,
}> = {
    model_0: { namespace: '@@initialState', model: model_0 },
}

export function ModelProviderWrapper(props: any) {
    const models = React.useMemo(() => {
        return Object.keys(rawModels).reduce((memo:Record<any, typeof model_0>, key) => {
            memo[rawModels[key].namespace] = rawModels[key].model;
            return memo;
        }, {});
    }, []);
    return <ModelProvider models={models} {...props}>{ props.children }</ModelProvider>
}
