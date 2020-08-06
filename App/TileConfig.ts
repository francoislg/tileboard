export interface IAppConfig {
    tiles: Array<ITileConfig & ITileState<unknown>>,
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

export interface ITileState<T> {
    id: string;
    value: T;
    lastTimestamp: number;
}