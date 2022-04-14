import {IPluginOptions} from "./types";
import path from "path";
import {PackageData, resolvePackageData} from "vite";
import pkgInfo from "pkginfo";
import * as fs from "fs";


export class AppData {
    pluginOptions: IPluginOptions
    templateDir: string
    templateExt: string

    pluginDir: string
    pluginName: string
    pluginVersion: string

    pluginPackage: PackageData
    projectName: string
    projectDir: string
    projectUmiDir: string
    projectPackage: PackageData
    runtimeExports: string[]

    umiConfig: string
}
export function initAppData(pluginOptions:IPluginOptions):Error{
    const appData=new AppData()


    appData.pluginOptions = pluginOptions
    const findPackage = pkgInfo.read(module)
    appData.pluginPackage = resolvePackageData(findPackage.package.name, ".")
    appData.pluginName = appData.pluginPackage.data.name
    appData.pluginDir = appData.pluginPackage.dir
    appData.pluginVersion = appData.pluginPackage.data.version

    appData.projectPackage = resolvePackageData(".", ".")
    appData.projectName = appData.projectPackage.data.name
    appData.projectDir = appData.projectPackage.dir
    appData.projectUmiDir = path.join(appData.projectDir, `./src/${pluginOptions.tempDir}`)
    appData.templateDir = path.join(appData.pluginDir, "files")
    appData.templateExt = ".tpl"
    appData.runtimeExports = []


    if (!fs.existsSync(path.join(appData.projectDir, "umiConfig.tsx"))) {
        return Error("配置文件不存在:umiConfig.tsx")
    }
    global.appData=appData
    return null
}
export function useAppData():AppData{
    const appData=global.appData
    return appData
}
