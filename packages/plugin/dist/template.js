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
exports.template = void 0;
const fs = __importStar(require("fs"));
const vite_1 = require("vite");
const appdata_1 = require("./appdata");
const art_template_1 = __importDefault(require("art-template"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
class template {
    static templateRenders = {};
    static registerBuiltin() {
        this.registerImports("appData", function () {
            return (0, appdata_1.useAppData)();
        });
        this.registerImports("absPkgPath", function (pkgName) {
            return (0, vite_1.resolvePackageData)(pkgName, ".").dir.replaceAll("\\", "/");
        });
        this.registerImports("JSON.stringify", function (...v) {
            return JSON.stringify(v);
        });
        this.registerImports("RegExp", function (e, p) {
            return new RegExp(e, p);
        });
        this.registerImports("ListSystemModels", function () {
            const appData = (0, appdata_1.useAppData)();
            const r = [];
            const ls = fs.readdirSync(path_1.default.join(appData.projectUmiDir, "models"));
            ls.map((item) => {
                r.push(item.replace(/.tsx$/g, ""));
            });
            return r;
        });
    }
    static registerImports(name, obj) {
        art_template_1.default.defaults.imports[name] = obj;
    }
    static render(templateName, data) {
        const appData = (0, appdata_1.useAppData)();
        data = {
            ...data,
            AppData: { ...appdata_1.AppData }
        };
        if (templateName.endsWith(appData.templateExt) == false) {
            templateName = `${templateName}${appData.templateExt}`;
        }
        if (this.templateRenders[templateName]) {
            return this.templateRenders[templateName](data);
        }
        const templatePath = (0, utils_1.getTemplatePath)(templateName);
        const templateRender = art_template_1.default.compile(fs.readFileSync(templatePath, 'utf-8'), { noEscape: true });
        this.templateRenders[templateName] = templateRender;
        return templateRender(data);
    }
    static renderToProjectUmiFile(templateName, ext = ".ts", data) {
        const appData = (0, appdata_1.useAppData)();
        if (!fs.existsSync(appData.projectUmiDir)) {
            fs.mkdirSync(appData.projectUmiDir, { recursive: true });
        }
        const absPath = path_1.default.join(appData.projectUmiDir, templateName);
        if (!fs.existsSync(path_1.default.dirname(absPath))) {
            fs.mkdirSync(path_1.default.dirname(absPath), { recursive: true });
        }
        const str = this.render(templateName, data);
        if (templateName.endsWith(appData.templateExt)) {
            templateName.replaceAll(appData.templateExt, "");
        }
        templateName = `${templateName}${ext}`;
        fs.writeFileSync((0, utils_1.getProjectUmiPath)(templateName), str, {});
    }
}
exports.template = template;
template.registerBuiltin();
//# sourceMappingURL=template.js.map