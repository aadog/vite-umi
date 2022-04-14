import { IPluginOptions } from "./types";
import { PackageData } from "vite";
export declare class AppData {
    pluginOptions: IPluginOptions;
    templateDir: string;
    templateExt: string;
    pluginDir: string;
    pluginName: string;
    pluginVersion: string;
    pluginPackage: PackageData;
    projectName: string;
    projectDir: string;
    projectUmiDir: string;
    projectPackage: PackageData;
    runtimeExports: string[];
    umiConfig: string;
}
export declare function initAppData(pluginOptions: IPluginOptions): Error;
export declare function useAppData(): AppData;
