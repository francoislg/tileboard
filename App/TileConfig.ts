export interface IAppConfig {
    tiles: Array<ITileConfig & ITileState<unknown>>,
    defaultTimeout?: number;
    direction?: 'column' | 'row';
}

// Component props are sent with the configuration. Those should be used to configure a tile
export interface ITileConfig<TProps = undefined> {
    id: string;
    type: string;
    title?: string
    layout?: string;
    layoutProps?: any;
    props: TProps;
    timeout?: number;
}

// A tile state is changing often and can be updated individually.
export interface ITileState<T> {
    id: string;
    value: T;
    lastTimestamp: number;
}