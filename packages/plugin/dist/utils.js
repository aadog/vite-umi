"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplatePath = exports.getProjectUmiPath = exports.generateFiles = void 0;
const template_1 = require("./template");
const path_1 = __importDefault(require("path"));
const appData_1 = require("./appData");
function generateFiles() {
    template_1.template.renderToProjectUmiFile("appData", ".tsx");
    template_1.template.renderToProjectUmiFile("umiApp", ".tsx");
    template_1.template.renderToProjectUmiFile("models/@@initialState", ".tsx");
    template_1.template.renderToProjectUmiFile("model", ".tsx");
    template_1.template.renderToProjectUmiFile("access", ".tsx");
    template_1.template.renderToProjectUmiFile("request", ".ts");
    template_1.template.renderToProjectUmiFile("index", ".ts");
}
exports.generateFiles = generateFiles;
function getProjectUmiPath(name) {
    const appData = (0, appData_1.useAppData)();
    return path_1.default.join(appData.projectUmiDir, name);
}
exports.getProjectUmiPath = getProjectUmiPath;
function getTemplatePath(name) {
    const appData = (0, appData_1.useAppData)();
    return path_1.default.join(appData.templateDir, name);
}
exports.getTemplatePath = getTemplatePath;
//# sourceMappingURL=utils.js.map