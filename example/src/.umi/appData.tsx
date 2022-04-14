import {defineUmi, IAppData, IRoute, IUmiConfig} from "@vite-umi/client";
import umiConfig from "../../umiConfig";
import {Result} from "antd";


export function useAppData():IAppData{
    const config=setDefaultUmiConfig(umiConfig)
    return {
        pluginName:'undefined',
        pluginVersion:'undefined',
        projectName:'undefined',
        umiConfig:config,
    }
}

function setDefaultUmiConfig(umiConfig:IUmiConfig):IUmiConfig{
    const defaultRouter:IRoute={path:"*",element:<Result status={'success'} title={`vite-plugin-react-umi 1.0.53`} extra={"现在没有路由,在umiConfig中配置"} />}
    const {
        type = "browser",
        basename= "/",
        request={},
        routes=[{path:"*",element:<Result status={'success'} title={` `} extra={"现在没有路由,在umiConfig中配置"} />} as IRoute],
        getInitialState = ()=>{return undefined},
        access= ()=>{return {}}
    } = umiConfig
    if(routes.length==0){
        routes.push(defaultRouter)
    }

    return defineUmi({
        ...umiConfig,
        type,
        basename,
        request,
        routes,
        getInitialState,
        access,
    })
}
