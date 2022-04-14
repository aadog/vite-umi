export interface IAntdOptions {
    style?: ("css" | "less");
    pro?: boolean;
}
export interface IPluginOptions {
    antd?: IAntdOptions;
    tempDir?: '.umi' | string;
}
