import {
    HmrContext,
    mergeConfig,
    Plugin,
    UserConfig
} from "vite";
import {IPluginOptions} from "./types";
import antd from "./antd";
import path from "path";
import {useAppData} from "./appData";
import {generateFiles} from "./utils";




export default function umi(pluginOptions: IPluginOptions): Plugin {
    const appData=useAppData()
    return {
        name: "@vite-umi/plugin",
        enforce: "pre",

        config(config, env) {
            config = mergeConfig(config, {
                resolve: {
                    alias: [
                        {find: "umi", replacement: `${path.resolve(appData.projectDir, `src/${appData.pluginOptions.tempDir}`)}/`},
                        {find: "@/", replacement: `${path.resolve(appData.projectDir, "src")}/`},
                    ]
                }
            } as UserConfig)
            config = antd?.config(config, env)

            return config
        },
        transform(code: string, id: string, options?: { ssr?: boolean }) {
            // code = antd.transform(code, id, options)


            return code;
        },
        configureServer(server) {
            generateFiles()
        },

        handleHotUpdate(ctx: HmrContext) {
            if(path.basename(ctx.file)=='umiConfig.tsx'&&path.basename(path.dirname(ctx.file)).toLowerCase()==appData.projectName.toLowerCase()){
                generateFiles()
            }
        }
    }
}
