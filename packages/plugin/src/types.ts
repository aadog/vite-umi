export interface IAntdOptions {
    //使用css还是less,会自动配置按需导入
    style?: ("css" | "less")
    //是否使用ant design pro,会自动处理别名问题
    pro?:boolean
}
export interface IPluginOptions {
    //默认不开启
    antd?: IAntdOptions
    tempDir?: '.umi'|string
}
