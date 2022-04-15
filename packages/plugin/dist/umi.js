"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const antd_1 = __importDefault(require("./antd"));
const path_1 = __importDefault(require("path"));
const appData_1 = require("./appData");
const utils_1 = require("./utils");
function umi(pluginOptions) {
    const appData = (0, appData_1.useAppData)();
    return {
        name: "@vite-umi/plugin",
        enforce: "pre",
        config(config, env) {
            config = (0, vite_1.mergeConfig)(config, {
                resolve: {
                    alias: [
                        { find: "umi", replacement: `${path_1.default.resolve(appData.projectDir, `src/${appData.pluginOptions.tempDir}`)}/` },
                        { find: "@/", replacement: `${path_1.default.resolve(appData.projectDir, "src")}/` },
                    ]
                }
            });
            config = antd_1.default?.config(config, env);
            return config;
        },
        transform(code, id, options) {
            // code = antd.transform(code, id, options)
            return code;
        },
        configureServer(server) {
            (0, utils_1.generateFiles)();
        },
        handleHotUpdate(ctx) {
            if (path_1.default.basename(ctx.file) == 'umiConfig.tsx' && path_1.default.basename(path_1.default.dirname(ctx.file)).toLowerCase() == appData.projectName.toLowerCase()) {
                (0, utils_1.generateFiles)();
            }
        }
    };
}
exports.default = umi;
//# sourceMappingURL=umi.js.map