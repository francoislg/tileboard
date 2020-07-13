export interface IAppConfig {
    tiles: ITileConfig[],
    defaultTimeout?: number;
}

export interface ITileConfig {
    id: string;
    type: string;
    props?: any;
}