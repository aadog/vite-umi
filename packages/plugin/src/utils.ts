import {template} from "./template";
import path from "path";
import {useAppData} from "./appData";

export function generateFiles(){
    template.renderToProjectUmiFile("appData", ".tsx")
    template.renderToProjectUmiFile("umiApp", ".tsx")
    template.renderToProjectUmiFile("models/@@initialState", ".tsx")
    template.renderToProjectUmiFile("model", ".tsx")
    template.renderToProjectUmiFile("access", ".tsx")
    template.renderToProjectUmiFile("request", ".ts")
    template.renderToProjectUmiFile("index", ".ts")
}
export function getProjectUmiPath(name: string) {
    const appData=useAppData()
    return path.join(appData.projectUmiDir, name)
}

export function getTemplatePath(name: string) {
    const appData=useAppData()
    return path.join(appData.templateDir, name)
}
