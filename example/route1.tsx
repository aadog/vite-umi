import {defineRoute} from "@vite-umi/client";
import {lazy} from "react";

export default defineRoute(
    {
        path: '/xx',
        access:"test",
        element: lazy(() => import('./src/XX')),
    }
)
