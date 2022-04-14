"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ANTD_IMPORT_LINE_REG = /import {[\w,\s]+} from (\'|\")antd(\'|\");?/g;
function transformToKebabCase(name) {
    return name.replace(/([^-])([A-Z])/g, '$1-$2').toLocaleLowerCase();
}
class Antd {
}
exports.default = Antd;
//# sourceMappingURL=antd.js.map