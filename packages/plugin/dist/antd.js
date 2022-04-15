"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const appdata_1 = require("./appdata");
const ANTD_IMPORT_LINE_REG = /import {[\w,\s]+} from (\'|\")antd(\'|\");?/g;
function transformToKebabCase(name) {
    return name.replace(/([^-])([A-Z])/g, '$1-$2').toLocaleLowerCase();
}
class Antd {
    static config(config, env) {
        const appData = (0, appdata_1.useAppData)();
        if (!appData.pluginOptions.antd) {
            return config;
        }
        if (appData.pluginOptions.antd.style == "less") {
            config = (0, vite_1.mergeConfig)(config, {
                css: {
                    preprocessorOptions: {
                        less: {
                            javascriptEnabled: true
                        }
                    }
                }
            });
        }
        if (appData.pluginOptions.antd.pro == true) {
            config = (0, vite_1.mergeConfig)(config, {
                css: {
                    preprocessorOptions: {
                        less: {
                            javascriptEnabled: true,
                        }
                    }
                },
                resolve: {
                    alias: [
                        { find: /^~/, replacement: "" },
                    ]
                }
            });
        }
        return config;
    }
}
exports.default = Antd;
//# sourceMappingURL=antd.js.map