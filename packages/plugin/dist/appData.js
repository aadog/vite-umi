"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppData = exports.initAppData = exports.AppData = void 0;
const path_1 = __importDefault(require("path"));
const vite_1 = require("vite");
const pkginfo_1 = __importDefault(require("pkginfo"));
const fs = __importStar(require("fs"));
class AppData {
    pluginOptions;
    templateDir;
    templateExt;
    pluginDir;
    pluginName;
    pluginVersion;
    pluginPackage;
    projectName;
    projectDir;
    projectUmiDir;
    projectPackage;
    runtimeExports;
    umiConfig;
}
exports.AppData = AppData;
function initAppData(pluginOptions) {
    const appData = new AppData();
    appData.pluginOptions = pluginOptions;
    const findPackage = pkginfo_1.default.read(module);
    appData.pluginPackage = (0, vite_1.resolvePackageData)(findPackage.package.name, ".");
    appData.pluginName = appData.pluginPackage.data.name;
    appData.pluginDir = appData.pluginPackage.dir;
    appData.pluginVersion = appData.pluginPackage.data.version;
    appData.projectPackage = (0, vite_1.resolvePackageData)(".", ".");
    appData.projectName = appData.projectPackage.data.name;
    appData.projectDir = appData.projectPackage.dir;
    appData.projectUmiDir = path_1.default.join(appData.projectDir, `./src/${pluginOptions.tempDir}`);
    appData.templateDir = path_1.default.join(appData.pluginDir, "files");
    appData.templateExt = ".tpl";
    appData.runtimeExports = [];
    if (!fs.existsSync(path_1.default.join(appData.projectDir, "umiConfig.tsx"))) {
        return Error("配置文件不存在:umiConfig.tsx");
    }
    global.appData = appData;
    return null;
}
exports.initAppData = initAppData;
function useAppData() {
    const appData = global.appData;
    return appData;
}
exports.useAppData = useAppData;
//# sourceMappingURL=appdata.js.map