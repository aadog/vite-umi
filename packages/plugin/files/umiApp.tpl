import React from "react";
import {
    useRoutes,
} from "react-router-dom";
import {useAppData} from "./appData";
import {Result} from "antd";
import {ModelProviderWrapper} from './model'
import {useModel} from "@vite-umi/client";
import {Provider as AccessProvider} from './access'
import {UmiAppContext,RouteContext,transformRoutes,DynamicRouter} from "@vite-umi/client";

function findFullRoute(routepage:React.ReactElement):React.ReactElement{
    if(routepage.props.value.outlet==null){
        return routepage.props.children
    }
    return findFullRoute(routepage.props.value.outlet)
}
type RenderElementProps={

}
const RenderElement: React.FC<RenderElementProps> = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    const routePage = useRoutes(umiAppContext.routes||[])
    if(!routePage){
        return umiAppContext.notfound
    }
    const fullRoute=findFullRoute(routePage)



    return (
        <RouteContext.Provider value={ {"route":fullRoute} }>
            <React.Suspense fallback={umiAppContext.loading}>
                {routePage}
            </React.Suspense>
        </RouteContext.Provider>
    )
}

export const InitialStateError:React.FC<any> = (props) => {
    const initialStateModel=useModel("@@initialState")
    return <Result status={'error'} extra={`App初始化失败:${initialStateModel.error}`}/>
}

type UmiAppProps = {
    loading?: React.ReactElement|null;
    notfound?: React.ReactElement|null;
    initialStateLoading?: React.ReactElement|null;
    initialStateError?: React.ReactElement|null;
    initialStateSync?: boolean
    initialPropsSync?: boolean
    noAccess?:React.ReactElement
}
export const UmiApp: React.FC<UmiAppProps> = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    const appData=useAppData()
    umiAppContext.initialStateSync=props.initialStateSync==false?false:umiAppContext.initialStateSync
    umiAppContext.initialPropsSync=props.initialPropsSync==false?false:umiAppContext.initialPropsSync
    umiAppContext.initialStateLoading=props.initialStateLoading||umiAppContext.initialStateLoading
    umiAppContext.initialStateError=props.initialStateError||umiAppContext.initialStateError
    umiAppContext.loading=props.loading||umiAppContext.loading
    umiAppContext.notfound=props.notfound||umiAppContext.notfound
    umiAppContext.noAccess=props.noAccess||umiAppContext.noAccess
    umiAppContext.routes=transformRoutes(useAppData().umiConfig)
    umiAppContext.appData=appData
    return (
        <UmiAppContext.Provider value={umiAppContext}>
            <ModelProviderWrapper>
                <AccessProvider>
                    <UmiAppEntry />
                </AccessProvider>
            </ModelProviderWrapper>
        </UmiAppContext.Provider>
    )
}

type UmiAppEntryProps = {

}
export const UmiAppEntry: React.FC<UmiAppEntryProps> = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    const initialStateSyncInited=React.useRef(false)
    if(umiAppContext.initialStateSync){
        const initialStateModel=useModel("@@initialState")

        if(initialStateSyncInited.current==false){
            if(initialStateModel.loading){
                return umiAppContext.initialStateLoading
            }
            if(initialStateModel.error){
                return umiAppContext.initialStateError
            }
            initialStateSyncInited.current=true
        }

    }

    return (
        <DynamicRouter type={useAppData().umiConfig.type} basename={useAppData().umiConfig.basename}>
            <RenderElement />
        </DynamicRouter>
    )
}


