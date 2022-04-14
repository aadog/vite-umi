import React from 'react';
import {ModelProvider} from "@vite-umi/client";

<%
var models = $imports.ListSystemModels()
for(var i=0;i<models.length;i++){
    print(`import model_${i} from './models/${models[i]}'`)
}
%>

export const rawModels:Record<string, {
    namespace:string,
    model:typeof model_0,
}> = {
    <%
    for(var i=0;i<models.length;i++){
          print(`model_${i}: { namespace: '${models[i]}', model: model_${i} },`)
    }
    %>
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
