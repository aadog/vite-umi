import {Plugin} from "vite";
import {IPluginOptions} from "./types";
import umi from "./umi";
import {AppData, initAppData} from "./appData";


function setPluginOptionsDefaults(options?:IPluginOptions):IPluginOptions{
    if(!options){
        options={}
    }
    const {
        antd = {style:'css'},
        tempDir = ".umi"
    }=options;
    antd.style=antd.style||'css'
    const pluginOptions={
        antd,
        tempDir: tempDir
    }
    return pluginOptions
}
export function createUmi(options?:IPluginOptions): Plugin[] {
    const pluginOptions = setPluginOptionsDefaults(options)


    const errInitAppData=initAppData(pluginOptions)
    if(errInitAppData){
        console.error(`createUmi失败:${errInitAppData}`)
        return []
    }



    return [umi(pluginOptions), ...usePlugins(pluginOptions)]
}
function usePlugins(options: IPluginOptions):Plugin[]{
    const plugins:Plugin[]=[]
    // if(!AppData.pluginOptions.antd){
    //     // plugins.push(createStyleImportPlugin({
    //     //     resolves:[
    //     //         AntdResolve(),
    //     //     ]
    //     // }))
    // }

    return plugins
}
