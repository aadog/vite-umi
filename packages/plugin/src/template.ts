import * as fs from "fs";
import {resolvePackageData} from "vite";
import {AppData, useAppData} from "./appdata";
import artTemplate from "art-template";
import path from "path";
import {getProjectUmiPath, getTemplatePath} from "./utils";

export class template{
    static templateRenders:{}={}
    static registerBuiltin(){

        this.registerImports("appData",function (){
            return useAppData()
        })
        this.registerImports("absPkgPath",function (pkgName:string) {
            return resolvePackageData(pkgName,".").dir.replaceAll("\\","/")
        })
        this.registerImports("JSON.stringify",function (...v: any){
            return JSON.stringify(v)
        })
        this.registerImports("RegExp",function(e,p){
            return new RegExp(e,p)
        })
        this.registerImports("ListSystemModels",function () {
            const appData=useAppData()
            const r=[]
            const ls=fs.readdirSync(path.join(appData.projectUmiDir,"models"))
            ls.map((item)=>{
                r.push(item.replace(/.tsx$/g,""))
            })
            return r
        })
    }
    static registerImports(name: string, obj: any):void{
        artTemplate.defaults.imports[name]=obj
    }
    static render(templateName:string,data?:Record<string, any>):string{
        const appData=useAppData()
        data={
            ...data,
            AppData:{...AppData}
        }

        if(templateName.endsWith(appData.templateExt)==false){
            templateName=`${templateName}${appData.templateExt}`
        }
        if(this.templateRenders[templateName]){
            return this.templateRenders[templateName](data)
        }
        const templatePath=getTemplatePath(templateName)

        const templateRender=artTemplate.compile(
            fs.readFileSync(templatePath,'utf-8'),
            {noEscape:true}
        )
        this.templateRenders[templateName]=templateRender

        return templateRender(data)
    }

    static renderToProjectUmiFile(templateName:string,ext:string=".ts",data?:Record<string, any>){
        const appData=useAppData()
        if(!fs.existsSync(appData.projectUmiDir)){
            fs.mkdirSync(appData.projectUmiDir,{recursive:true})
        }
        const absPath=path.join(appData.projectUmiDir,templateName)
        if(!fs.existsSync(path.dirname(absPath))){
            fs.mkdirSync(path.dirname(absPath),{recursive:true})
        }

        const str=this.render(templateName,data)
        if(templateName.endsWith(appData.templateExt)){
            templateName.replaceAll(appData.templateExt,"")
        }
        templateName=`${templateName}${ext}`
        fs.writeFileSync(getProjectUmiPath(templateName),str,{})
    }
}

template.registerBuiltin()
