export interface IAppConfig {
    tiles: ITileConfig[],
    defaultTimeout?: number;
    direction?: 'column' | 'row';
}

export interface ITileConfig {
    id: string;
    type: string;
    title?: string;
    initialValue?: any;
    layout?: string;
    layoutProps?: any;
    props?: any;
}