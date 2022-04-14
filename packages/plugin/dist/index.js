"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUmi = void 0;
const umi_1 = __importDefault(require("./umi"));
const appData_1 = require("./appData");
function setPluginOptionsDefaults(options) {
    if (!options) {
        options = {};
    }
    const { antd = { style: 'css' }, tempDir = ".umi" } = options;
    antd.style = antd.style || 'css';
    const pluginOptions = {
        antd,
        tempDir: tempDir
    };
    return pluginOptions;
}
function createUmi(options) {
    const pluginOptions = setPluginOptionsDefaults(options);
    const errInitAppData = (0, appData_1.initAppData)(pluginOptions);
    if (errInitAppData) {
        console.error(`createUmi失败:${errInitAppData}`);
        return [];
    }
    return [(0, umi_1.default)(pluginOptions), ...usePlugins(pluginOptions)];
}
exports.createUmi = createUmi;
function usePlugins(options) {
    const plugins = [];
    // if(!AppData.pluginOptions.antd){
    //     // plugins.push(createStyleImportPlugin({
    //     //     resolves:[
    //     //         AntdResolve(),
    //     //     ]
    //     // }))
    // }
    return plugins;
}
//# sourceMappingURL=index.js.map