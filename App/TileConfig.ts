export interface IAppConfig {
    tiles: ITileConfig[]
}

export interface ITileConfig {
    id: string;
    type: string;
    props?: any;
}