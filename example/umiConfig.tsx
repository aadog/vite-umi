import 'antd/dist/antd.css'
import {defineUmi} from "@vite-umi/client";
import route1 from "./route1";


export default defineUmi({
    access:()=>{
      return {a:"b"}
    },
    getInitialState:()=>{
      return {state:"b"}
    },
    routes:[
        {path:"/",element:"test"},
        route1
    ]
})
