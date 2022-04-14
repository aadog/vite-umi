import {defineRoute} from "@vite-umi/client";
import {lazy} from "react";
const XX =lazy(()=>import("./src/XX"));

export default defineRoute(
    {
        path: '/xx',
        element: <XX />,
        meta:{
            xx:"vv"
        }
    }
)
